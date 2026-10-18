/**
 * =========================================================
 *  LIFESCHÉDIO — Relais serveur (mail + publication CMS
 *  + accès admin par code à usage unique)
 *  (équivalent de la fonction PHP mail() + config SMTP)
 * ---------------------------------------------------------
 *  Ce script est le SEUL canal sortant du portfolio statique :
 *  1) brief      → mail au propriétaire (formulaire de contact)
 *  2) analytics  → rapport de visite (tracker.js)
 *  3) cms_push   → commit de assets/data/cms.json dans le dépôt
 *                  GitHub (API Contents). Le navigateur ne détient
 *                  AUCUN secret : le token GitHub vit dans les
 *                  Script Properties (chiffrées côté Google).
 *                  Le résultat est aussi stocké 5 min dans le cache
 *                  sous la clé rcpt_<rid> quand le payload porte un rid :
 *                  le client (gsaRelayPost) le récupère en JSONP via
 *                  doGet(type=_receipt) — c'est le seul canal de lecture
 *                  cross-origin fiable (fetch illisible : pas de CORS ;
 *                  iframe interdite : frame-ancestors 'self'). La
 *                  publication affiche alors le VRAI résultat.
 *  4) admin      → verrou de la page console : admin_code envoie un
 *                  code à 6 chiffres par e-mail (10 min, 5 essais,
 *                  60 s de cooldown), admin_login échange le code
 *                  contre un token de session (30 min), admin_session
 *                  valide un token, admin_log reçoit le journal
 *                  d'accès et le transmet par e-mail.
 *
 *  CONFIGURATION (Script Properties — ⚙️ Paramètres du projet) :
 *    GITHUB_TOKEN      token GitHub fine-grained, portée « Contents :
 *                      Read/Write » sur CE dépôt uniquement
 *    GITHUB_REPO       ex: Demanoua/video-ads-specialist
 *    GITHUB_BRANCH     ex: master
 *    GITHUB_PATH       ex: assets/data/cms.json
 *    GSA_PUBLISH_KEY   mot de passe de publication (choisi par toi)
 *  Les propriétés sont lues à chaque appel : aucun redéploiement
 *  nécessaire quand tu les modifies (si tu modifies le CODE,
 *  republie une nouvelle version : Déployer → Gérer les installs).
 *
 *  MISE EN ROUTE / MISE À JOUR DU CODE :
 *  1. https://script.google.com (compte gsacreatives@gmail.com)
 *  2. Colle ce fichier dans Code.gs → Enregistrer
 *  3. ⚙️ Paramètres → Propriétés du script → ajoute les 5 clés
 *  4. Déployer → Gérer les installations → ✎ → Nouvelle version
 * =========================================================
 */

var GSA_TO = 'gsacreatives@gmail.com';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.tryLock(10000); } catch (err) { }

  try {
    // Deux transporteurs arrivent ici :
    //  - fetch (gsaSendMail) → corps brut en JSON ;
    //  - formulaire iframe (gsaRelayPost) → corps urlencodé, Apps Script
    //    décode déjà le champ "payload".
    var raw = (e.parameter && e.parameter.payload) ? e.parameter.payload : e.postData.contents;
    var p = JSON.parse(raw);
    Logger.log('doPost received, type=%s', p.type || 'brief');

    var result;
    if (p.type === 'cms_push') result = handleCmsPush(p);                // commit GitHub
    else if (p.type === 'admin_code') result = handleAdminCode(p);       // OTP par e-mail
    else if (p.type === 'admin_login') result = handleAdminLogin(p);     // OTP → session
    else if (p.type === 'admin_session') result = handleAdminSession(p); // validité session
    else if (p.type === 'admin_log') result = handleAdminLog(p.session); // journal d'accès
    else if (p.type === 'analytics' && p.session) result = handleAnalytics(p.session);
    else result = handleBrief(p);

    // Reçu : le résultat est stocké quelques minutes dans le cache ; le
    // client le récupère en JSONP via doGet(type=_receipt). Une page HTML
    // postMessage est impossible : Apps Script interdit le cadrage
    // cross-origin (frame-ancestors 'self' sur la redirection /exec).
    if (p.rid) {
      try {
        CacheService.getScriptCache().put('rcpt_' + p.rid, JSON.stringify(result), 300);
      } catch (err) { }
    }
    return gsaJson(result);
  } catch (err) {
    return gsaJson({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (err) { }
  }
}

/* ---------------- Brief (formulaire de contact) ---------------- */
function handleBrief(p) {
  var name = String(p.name || '').trim();
  var email = String(p.email || '').trim();
  var subject = String(p.subject || '').trim();
  var message = String(p.message || '').trim();

  if (!name || !email || !message) {
    return { ok: false, error: 'missing_fields' };
  }
  if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    return { ok: false, error: 'invalid_email' };
  }

  var fullSubject = '[LifeSchédio] ' + subject + ' — ' + name;
  var body =
    'Nouveau brief reçu depuis le portfolio\n' +
    '=====================================\n\n' +
    'Nom     : ' + name + '\n' +
    'Email   : ' + email + '\n' +
    'Sujet   : ' + subject + '\n\n' +
    'Message :\n' + message + '\n\n' +
    '— Envoyé automatiquement par mail-relay.gs (portfolio LifeSchédio)';

  // Équivalent PHP : mail($to, $subject, $body,
  //   'From: gsacreatives@gmail.com' . "\r\n" . 'Reply-To: ' . $email);
  GmailApp.sendEmail(GSA_TO, fullSubject, body, {
    replyTo: email,
    name: 'LifeSchédio'
  });

  return { ok: true };
}

/* ---------------- Rapport de visite (analytics) ---------------- */
function handleAnalytics(s) {
  var fmtT = function (sec) {
    sec = Math.round(sec || 0);
    var m = Math.floor(sec / 60), r = sec % 60;
    return (m ? m + 'min ' : '') + (r < 10 && m ? '0' : '') + r + 's';
  };
  var videos = s.videoWatch || {};
  var vKeys = Object.keys(videos);
  var events = s.events || [];

  var lines = [];
  lines.push('Rapport de visite — portfolio LifeSchédio');
  lines.push('=================================');
  lines.push('Début    : ' + (s.startedAt || '—'));
  lines.push('Appareil : ' + (s.device ? s.device.type + ' · ' + s.device.browser + ' · ' + s.device.os : '—'));
  lines.push('Écran    : ' + (s.screen || '—'));
  lines.push('Langue   : ' + (s.lang || '—') + '  |  Fuseau : ' + (s.tz || '—'));
  lines.push('IP       : ' + (s.ip || '—'));
  lines.push('Lieu     : ' + (s.geo || '—'));
  lines.push('Référent : ' + (s.referrer || 'direct'));
  lines.push('Entrée   : ' + (s.landing || '(aucune)'));
  lines.push('');
  lines.push('Vidéos regardées (' + vKeys.length + ') :');
  if (vKeys.length) {
    vKeys.forEach(function (k) { lines.push('  • ' + k + ' — ' + fmtT(videos[k])); });
  } else {
    lines.push('  (aucune)');
  }
  lines.push('');
  lines.push('Journal d\'actions (' + events.length + ' — 40 dernières ci-dessous) :');
  events.slice(-40).forEach(function (ev) {
    var t = '';
    try { t = Utilities.formatDate(new Date(ev.t), Session.getScriptTimeZone(), 'HH:mm:ss'); } catch (e) { t = ev.t; }
    lines.push('  [' + t + '] ' + ev.type + '  ' + JSON.stringify(ev.data || {}));
  });

  GmailApp.sendEmail(
    GSA_TO,
    '[LifeSchédio] Visite — ' + (s.geo || s.ip || (s.device ? s.device.type : 'session')) + ' — ' + (s.startedAt || ''),
    lines.join('\n'),
    { name: 'Monitoring LifeSchédio' }
  );

  return { ok: true };
}

/* ---------------- Accès admin (code à usage unique par e-mail) ----------------
   La page console est verrouillée : à l'arrivée elle demande un code
   (admin_code) — le relais génère un OTP à 6 chiffres valable 10 min
   (CacheService, TTL natif) et l'envoie au propriétaire. Le bon code
   (admin_login) détruit l'OTP et émet un token de session valable 30 min.
   admin_session valide un token existant. admin_log reçoit le journal
   d'accès et le transmet par e-mail au propriétaire.
   Protections : 60 s minimum entre deux envois de code, 5 essais max
   par code. Limite : CacheService peut évincer une entrée avant son TTL
   (pression mémoire) → code/session morts prématurément ; il suffit alors
   de redemander un code. */
var GSA_ADMIN_OTP = 'admin_otp';            // code en cours
var GSA_ADMIN_OTP_ATTEMPTS = 'admin_otp_attempts';
var GSA_ADMIN_OTP_CD = 'admin_otp_cd';      // cooldown entre deux envois

function handleAdminCode(p) {
  var cache = CacheService.getScriptCache();
  if (cache.get(GSA_ADMIN_OTP_CD)) {
    return { ok: false, error: 'code_just_sent' };
  }
  var code = String(Math.floor(100000 + Math.random() * 900000));
  cache.put(GSA_ADMIN_OTP, code, 600);        // 10 min
  cache.put(GSA_ADMIN_OTP_ATTEMPTS, '0', 600);
  cache.put(GSA_ADMIN_OTP_CD, '1', 60);       // 1 envoi / 60 s max

  var when = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  GmailApp.sendEmail(GSA_TO,
    '[LifeSchédio Admin] Code d\'accès : ' + code,
    'Code d\'accès à la page admin LifeSchédio\n' +
    '================================\n\n' +
    'Code       : ' + code + '\n' +
    'Valable    : 10 minutes (demandé le ' + when + ')\n' +
    'Essais max : 5\n\n' +
    'Si vous n\'êtes pas à l\'origine de cette demande, ignorez ce message :\n' +
    'sans ce code, la page admin reste verrouillée.\n\n' +
    '— Relais LifeSchédio (portfolio LifeSchédio)',
    { name: 'LifeSchédio Admin' });
  Logger.log('admin_code: code envoyé (TTL 600 s)');
  return { ok: true };
}

function handleAdminLogin(p) {
  var cache = CacheService.getScriptCache();
  var code = String(p.code || '').trim();
  var expected = cache.get(GSA_ADMIN_OTP);
  if (!expected) {
    return { ok: false, error: 'code_expired' };
  }
  var attempts = parseInt(cache.get(GSA_ADMIN_OTP_ATTEMPTS) || '0', 10);
  if (attempts >= 5) {
    cache.remove(GSA_ADMIN_OTP);
    cache.remove(GSA_ADMIN_OTP_ATTEMPTS);
    return { ok: false, error: 'code_locked' };
  }
  if (code !== expected) {
    attempts++;
    cache.put(GSA_ADMIN_OTP_ATTEMPTS, String(attempts), 600);
    return { ok: false, error: 'bad_code', left: 5 - attempts };
  }
  // bon code → OTP détruit, session 30 min
  cache.remove(GSA_ADMIN_OTP);
  cache.remove(GSA_ADMIN_OTP_ATTEMPTS);
  var token = Utilities.getUuid();
  cache.put('admin_sess_' + token, '1', 1800);
  Logger.log('admin_login: session créée (token %s…)', token.slice(0, 8));
  return { ok: true, token: token, expiresIn: 1800 };
}

function handleAdminSession(p) {
  var cache = CacheService.getScriptCache();
  var token = String(p.token || '');
  if (!token || !cache.get('admin_sess_' + token)) {
    return { ok: false, error: 'session_expired' };
  }
  return { ok: true, expiresIn: 1800 };
}

function handleAdminLog(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) {
    return { ok: false, error: 'missing_session' };
  }
  var lines = [];
  lines.push('Rapport d\'accès admin — LifeSchédio');
  lines.push('==================================');
  lines.push('Début    : ' + (s.startedAt || '—'));
  lines.push('Appareil : ' + (s.device ? s.device.type + ' · ' + s.device.browser + ' · ' + s.device.os : '—'));
  lines.push('Écran    : ' + (s.screen || '—'));
  lines.push('Langue   : ' + (s.lang || '—') + '  |  Fuseau : ' + (s.tz || '—'));
  lines.push('IP       : ' + (s.ip || '—'));
  lines.push('Lieu     : ' + (s.geo || '—'));
  lines.push('Référent : ' + (s.referrer || 'direct'));
  lines.push('');
  var events = s.events || [];
  lines.push('Journal d\'événements (' + events.length + ') :');
  events.slice(-60).forEach(function (ev) {
    var t = '';
    try { t = Utilities.formatDate(new Date(ev.t), Session.getScriptTimeZone(), 'HH:mm:ss'); } catch (e) { t = ev.t; }
    lines.push('  [' + t + '] ' + ev.type + '  ' + JSON.stringify(ev.data || {}));
  });
  GmailApp.sendEmail(
    GSA_TO,
    '[LifeSchédio Admin] Accès — ' + (s.geo || s.ip || (s.device ? s.device.type : 'session')) + ' — ' + (s.startedAt || ''),
    lines.join('\n'),
    { name: 'Monitoring Admin LifeSchédio' }
  );
  return { ok: true };
}

/* ---------------- Publication CMS → commit GitHub ----------------
   Le navigateur envoie { type:'cms_push', key, cms }. Le token GitHub
   n'existe QUE dans les Script Properties — jamais dans le dépôt,
   jamais dans le navigateur. Le commit déclenche la reconstruction
   de GitHub Pages (~1 min) : le contenu devient visible pour tous. */
function handleCmsPush(p) {
  var props = PropertiesService.getScriptProperties();
  var expectedKey = props.getProperty('GSA_PUBLISH_KEY');
  var token = props.getProperty('GITHUB_TOKEN');
  var repo = props.getProperty('GITHUB_REPO');
  var branch = props.getProperty('GITHUB_BRANCH') || 'master';
  var path = props.getProperty('GITHUB_PATH') || 'assets/data/cms.json';

  var keyOk = !!expectedKey && String(p.key || '') === expectedKey;
  Logger.log('cms_push: keyOk=%s | token set=%s | repo=%s | branch=%s | path=%s',
    keyOk, !!token, repo, branch, path);

  if (!keyOk) {
    return { ok: false, error: 'bad_publish_key' };
  }
  if (!token || !repo) {
    return { ok: false, error: 'github_not_configured' };
  }
  if (!p.cms || typeof p.cms !== 'object' || Array.isArray(p.cms)) {
    return { ok: false, error: 'missing_cms' };
  }

  var api = 'https://api.github.com/repos/' + repo + '/contents/' + path;
  var headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': 'Bearer ' + token,
    'X-GitHub-Api-Version': '2022-11-28'
  };

  // SHA du fichier actuel (obligatoire pour mettre à jour un fichier existant)
  var sha = null;
  try {
    var cur = UrlFetchApp.fetch(api + '?ref=' + encodeURIComponent(branch), {
      method: 'get', headers: headers, muteHttpExceptions: true
    });
    var getCode = cur.getResponseCode();
    Logger.log('cms_push: github GET existing file → HTTP ' + getCode);
    if (getCode === 200) {
      sha = JSON.parse(cur.getContentText()).sha || null;
    }
  } catch (e) {
    Logger.log('cms_push: github GET failed: ' + e);
  }

  var payload = {
    message: 'cms: publish from portfolio admin',
    content: Utilities.base64Encode(JSON.stringify(p.cms, null, 2), Utilities.Charset.UTF_8),
    branch: branch
  };
  if (sha) payload.sha = sha;

  var res = UrlFetchApp.fetch(api, {
    method: 'put',
    headers: headers,
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  Logger.log('cms_push: github PUT result → HTTP ' + code + ' — ' + String(res.getContentText()).slice(0, 200));
  if (code === 200 || code === 201) return { ok: true };

  return {
    ok: false,
    error: 'github_http_' + code,
    detail: String(res.getContentText()).slice(0, 300)
  };
}

/* ---------------- Reçu JSONP (lecture du résultat cross-origin) ----------------
   fetch() ne peut pas lire une réponse Apps Script (pas d'en-tête CORS) et
   une page de reçu ne peut pas être cadrée dans un iframe caché
   (frame-ancestors 'self' sur la redirection /exec). Un <script src>
   classique (JSONP) contourne les deux : gsaRelayPost envoie en POST
   no-cors avec un rid unique, puis interroge ce endpoint en GET toutes
   les 2 s jusqu'à ce que doPost ait stocké le résultat (rcpt_<rid>, 5 min). */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.type === '_receipt') {
    var raw = null, result = null;
    try {
      raw = CacheService.getScriptCache().get('rcpt_' + String(p.rid || ''));
      if (raw) result = JSON.parse(raw);
    } catch (err) { }
    var json = JSON.stringify(result).replace(/</g, '\\u003c');
    var js = 'window.gsaRelayReceipt && window.gsaRelayReceipt(' +
      JSON.stringify(String(p.rid || '')) + ',' + json + ');';
    return ContentService.createTextOutput(js)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput('Relais LifeSchédio : utilisez POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function gsaJson(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
