/**
 * =========================================================
 *  GSA CREATIVES — Relais serveur (mail + publication CMS)
 *  (équivalent de la fonction PHP mail() + config SMTP)
 * ---------------------------------------------------------
 *  Ce script est le SEUL canal sortant du portfolio statique :
 *  1) brief     → mail au propriétaire (formulaire de contact)
 *  2) analytics → rapport de visite (tracker.js)
 *  3) cms_push  → commit de assets/data/cms.json dans le dépôt
 *                 GitHub (API Contents). Le navigateur ne détient
 *                 AUCUN secret : le token GitHub vit dans les
 *                 Script Properties (chiffrées côté Google).
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
    var p = JSON.parse(e.postData.contents);
    Logger.log('doPost received, type=%s', p.type || 'brief');

    // Type 3 : publication CMS → commit dans le dépôt GitHub
    if (p.type === 'cms_push') {
      return gsaJson(handleCmsPush(p));
    }

    // Type 2 : rapport de visite (analytics)
    if (p.type === 'analytics' && p.session) {
      return gsaJson(handleAnalytics(p.session));
    }

    // Type 1 : brief du formulaire de contact
    return gsaJson(handleBrief(p));
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

  var fullSubject = '[GSA Portfolio] ' + subject + ' — ' + name;
  var body =
    'Nouveau brief reçu depuis le portfolio\n' +
    '=====================================\n\n' +
    'Nom     : ' + name + '\n' +
    'Email   : ' + email + '\n' +
    'Sujet   : ' + subject + '\n\n' +
    'Message :\n' + message + '\n\n' +
    '— Envoyé automatiquement par mail-relay.gs (portfolio GSA Creatives)';

  // Équivalent PHP : mail($to, $subject, $body,
  //   'From: gsacreatives@gmail.com' . "\r\n" . 'Reply-To: ' . $email);
  GmailApp.sendEmail(GSA_TO, fullSubject, body, {
    replyTo: email,
    name: 'Portfolio GSA Creatives'
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
  lines.push('Rapport de visite — portfolio GSA');
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
    '[GSA Analytics] Visite — ' + (s.geo || s.ip || (s.device ? s.device.type : 'session')) + ' — ' + (s.startedAt || ''),
    lines.join('\n'),
    { name: 'Monitoring Portfolio GSA' }
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

function gsaJson(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
