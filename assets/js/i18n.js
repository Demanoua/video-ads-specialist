/* =========================================================
   LIFESCHÉDIO — i18n (EN default · FR · ES · AR + RTL)
   Dictionary + selector map. Exposes window.GSA_I18N.
   Applies data-* attributes, persists choice, dispatches
   window event 'gsa:lang' (detail.lang) after applying.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- Dictionary ---------------- */
  var D = {
    en: {
      'nav.services': 'Services', 'nav.work': 'Work', 'nav.process': 'Process', 'nav.toolkit': 'Toolkit',
      'nav.clients': 'Clients', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.hire': 'Hire me',
      'mob.services': 'Services <span>01</span>', 'mob.work': 'Work <span>02</span>', 'mob.process': 'Process <span>03</span>',
      'mob.toolkit': 'Toolkit <span>04</span>', 'mob.clients': 'Clients <span>05</span>', 'mob.about': 'About <span>06</span>',
      'mob.contact': 'Contact <span>07</span>',

      'hero.badge': 'Available · Booking',
      'hero.t1': 'Scroll-stopping', 'hero.t2': 'video ads that', 'hero.t3': 'actually <em>convert.</em>',
      'hero.sub': 'I build TikTok, Meta &amp; YouTube Shorts creatives engineered like <strong>high-converting funnels</strong> — hook in 3s, retain, sell. A software-engineer brain meets direct-response craft.',
      'hero.cta1': 'Book a project', 'hero.cta2': 'Watch showreel',
      'hero.stat1': 'Avg. Hook Rate lift', 'hero.stat2': 'ROAS uplift', 'hero.stat3': 'Ads shipped', 'hero.stat4': 'First cut delivery',

      'svc.eyebrow': '01 — Services',
      'svc.title': 'Built like funnels.<br /><span class="muted">Shipped like ads.</span>',
      'svc.lede': 'Four ways I help brands stop wasting money on boring video ads.',
      'svc1.t': 'Social Media Video Ads',
      'svc1.d': 'High-impact creatives for TikTok, Meta (Instagram/Facebook) &amp; YouTube Shorts — engineered for thumb-stop and CTR.',
      'svc1.l1': 'Native vertical 9:16', 'svc1.l2': 'Hook variations &amp; A/B testing', 'svc1.l3': 'Trend-aware editing',
      'svc2.t': 'SaaS &amp; App Demos',
      'svc2.d': 'Clear, modern promotional videos for tech products. I understand your product mechanics so the story actually lands.',
      'svc2.l1': 'Screen recording &amp; UI motion', 'svc2.l2': 'Feature-to-benefit storytelling', 'svc2.l3': 'Founder-led narration cuts',
      'svc3.t': 'UGC &amp; Direct Response',
      'svc3.d': 'Raw creator footage transformed into dynamic ads optimized for Hook Rate, Hold Rate, and conversion.',
      'svc3.l1': 'Pacing &amp; cut optimization', 'svc3.l2': 'Caption strategy', 'svc3.l3': 'Multiple aspect ratios',
      'svc4.t': 'Motion Graphics &amp; Captions',
      'svc4.d': 'Animated text, kinetic transitions and sound design that keep viewers watching all the way to the CTA.',
      'svc4.l1': 'After Effects compositions', 'svc4.l2': 'Burned-in dynamic captions', 'svc4.l3': 'SFX library &amp; mixing',

      'reel.eyebrow': '02 — Showreel',
      'reel.title': 'Recent <span class="muted">work.</span>',
      'reel.lede': 'Case studies with real results — across e-commerce, SaaS, and lifestyle brands. Search a project by name, platform, or style, then click any tile to preview.',
      'search.ph': 'Search a project — e.g. UGC, Meta Ads, VIN, spot TV…',
      'share.toggle': 'Build a client link', 'share.exit': 'Exit selection',
      'notice.text': 'You\'re viewing a <b>custom selection</b> — <b>{n}</b> videos picked for you.',
      'exit.selection': 'View full portfolio',
      'pager.prev': 'Previous projects', 'pager.next': 'Next projects',

      'proc.eyebrow': '03 — Process',
      'proc.title': 'Engineered, <span class="muted">not improvised.</span>',
      'proc.lede': 'My background is software. So every ad I ship is a measurable, debuggable, iterable system.',
      'proc1.t': 'Discovery &amp; Diagnostic', 'proc1.d': 'Audit existing creatives, ICP, offer, and competitor hooks. Define the conversion thesis we\'ll test against.',
      'proc2.t': 'Hook Engineering', 'proc2.d': '3–5 distinct hook angles per concept — pattern interrupt, problem-agitate, social proof, transformation, native.',
      'proc3.t': 'Edit &amp; Motion', 'proc3.d': 'Premiere Pro + After Effects. Pacing tuned to platform algo. Captions, SFX, and B-roll built for retention.',
      'proc4.t': 'Ship &amp; Iterate', 'proc4.d': 'Multi-aspect delivery. Then we read the data: Hook Rate, Hold Rate, CTR, ROAS — and ship V2 within 72h.',

      'tool.eyebrow': '04 — Toolkit', 'tool.title': 'The <span class="muted">stack.</span>',
      'tool1.t': 'Premiere Pro', 'tool1.d': 'Primary NLE for fast-paced ad edits, multi-cam &amp; team handoffs.',
      'tool2.t': 'After Effects', 'tool2.d': 'Motion graphics, kinetic typography, compositing &amp; transitions.',
      'tool3.t': 'CapCut Pro', 'tool3.d': 'Native TikTok pacing, trend-driven cuts, instant caption sync.',
      'tool4.t': 'Photoshop · Illustrator', 'tool4.d': 'Asset creation, thumbnail design, vector logos &amp; brand kits.',

      'testi.eyebrow': '05 — Clients',
      'testi.title': 'Results they <span class="muted">came back for.</span>',
      'testi.lede': 'Not compliments — numbers. Here\'s what happens after the first batch ships.',
      'strip.1v': '92%', 'strip.1l': 'of clients reorder', 'strip.2v': '-38%', 'strip.2l': 'avg. CPA after 30 days',
      'strip.3v': '4.3×', 'strip.3l': 'avg. ROAS across accounts', 'strip.4v': '72h', 'strip.4l': 'V2 iteration turnaround',
      'q1': 'Hook rate up <em>287%</em> in 14 days, CPA down <em>43%</em>. He out-tested our entire in-house team — we moved the whole account over.',
      'q2': 'The demo cut paid for itself in a single ad set. <em>4.6× ROAS</em> on the first sprint — we paused our agency retainer the same week.',
      'q3': 'Six creatives, <em>68% hold rate</em>, and our restock sold out in 11 days. The street-interview format is still our best performer six months later.',
      'q4': 'Three hook variants beat our control in week one. Cold-traffic CTR went from 1.9% to <em>3.8%</em>. Fast, calm, and surgical with feedback.',
      'r1': 'Creative Director · Aurora Apparel', 'r2': 'CEO · Northwave', 'r3': 'Founder · Double Root Coffee', 'r4': 'Head of Growth · Pulse',

      'about.eyebrow': '06 — Who we are',
      'about.title': 'We are <span class="about__name">LifeSchédio.</span>',
      'about.p1': 'LifeSchédio is a video ads studio built for one thing: <strong>turning scrollers into buyers</strong>. We engineer TikTok, Meta &amp; YouTube Shorts creatives like funnels — a hook in the first 3 seconds, pacing that holds attention, and a CTA that closes.',
      'about.p2': 'Behind every cut is a direct-response system: consumer psychology, systematic hook testing, and read-outs on Hook Rate, Hold Rate, CTR and ROAS. We ship first cuts in <strong>24–48 hours</strong>, then iterate on performance data until the ad wins.',
      'about.p3': 'From e-commerce and lifestyle brands to SaaS demos and TV spots, our work runs in <strong>9:16 feeds</strong> and on <strong>big screens</strong> across Africa, Europe and North America. Every client leaves with something they can show — and numbers to back it up.',
      'about.li1': 'Social Media Video Ads', 'about.li2': 'SaaS &amp; App Demos', 'about.li3': 'UGC &amp; Direct Response', 'about.li4': 'Motion Graphics &amp; Captions',
      'about.card.name': 'LifeSchédio', 'about.card.tag': 'Video ads engineered to convert',
      'about.stat1v': '180+', 'about.stat1l': 'ads shipped', 'about.stat2v': '4.3×', 'about.stat2l': 'avg. ROAS', 'about.stat3v': '24–48h', 'about.stat3l': 'first cut',

      'cta.eyebrow': '07 — Let\'s work',
      'cta.title': 'Let\'s turn viewers <br />into <span class="cta__accent">customers.</span>',
      'cta.lede': 'Send a brief. I reply within 24 hours with a rough cut plan &amp; quote.',
      'cta.book': 'Book a 20-min call',
      'cta.contact': 'Contact us',
      'modal.eyebrow': 'New brief', 'modal.title': 'Send a brief right here',
      'form.name': 'Your name', 'form.email': 'Email address', 'form.subject': 'Subject',
      'form.budget': 'Budget range <span>(optional)</span>', 'form.details': 'Project details',
      'form.subject.ph': 'Select a subject…', 'form.subject.1': 'Request a quote', 'form.subject.2': 'New project inquiry',
      'form.subject.3': 'Free consultation', 'form.subject.4': 'General question',
      'form.budget.ph': 'Select budget range…', 'form.budget.1': 'Less than $500', 'form.budget.2': '$500 – $1,000',
      'form.budget.3': '$1,000 – $3,000', 'form.budget.4': 'More than $3,000',
      'form.message.ph': 'Tell me about your brand, goals, platforms (TikTok, Meta…) and timeline.',
      'form.submit': 'Send message',
      'form.val.name': 'Please enter your name.', 'form.val.email': 'Please enter a valid email address.',
      'form.val.subject': 'Please select a subject.', 'form.val.message': 'Please tell me a few words about your project.',
      'form.sending': 'Sending…', 'form.success': 'Thanks — your brief is on its way. I reply within 24 hours.',
      'form.error.net': 'Network error. Please email gsacreatives@gmail.com directly.',
      'form.error.generic': 'Something went wrong. Please email gsacreatives@gmail.com directly.',

      'footer.text': 'LifeSchédio — Video Ads Studio.',
      'fab.aria': 'Hire me — jump to the contact section',

      'count.paged': 'Showing <b>5</b> of {n} projects — swipe or use the arrows to see more.',
      'count.results': 'Showing <b>{n}</b> of {total} projects — click a tile to preview.',
      'count.select': 'Selection mode — tick any videos, then <b>Generate link</b> for your client.',
      'empty.title': 'No projects match "{term}"',
      'empty.hint': 'Try a platform like TikTok or Meta Ads, a brand like VIN or Pulse, or a format like UGC or spot TV.',
      'suggest.all': 'Suggested projects', 'suggest.matches': 'Matching projects',
      'share.count': '<b>{n}</b> selected',
      'share.generate': 'Generate link', 'share.copy': 'Copy', 'share.done': 'Done',
      'share.ready': 'Link ready — copied to clipboard. Send it to your client.',
      'share.ready.manual': 'Link ready — copy it above and send it to your client.',
      'share.copied': 'Copied to clipboard.', 'share.copyfail': 'Copy failed — select the link and copy manually.',
      'tile.play': 'Play',
      'lightbox.unavailable': 'Preview unavailable'
    },

    fr: {
      'nav.services': 'Services', 'nav.work': 'Réalisations', 'nav.process': 'Processus', 'nav.toolkit': 'Outils',
      'nav.clients': 'Clients', 'nav.about': 'À propos', 'nav.contact': 'Contact', 'nav.hire': 'Me recruter',
      'mob.services': 'Services <span>01</span>', 'mob.work': 'Réalisations <span>02</span>', 'mob.process': 'Processus <span>03</span>',
      'mob.toolkit': 'Outils <span>04</span>', 'mob.clients': 'Clients <span>05</span>', 'mob.about': 'À propos <span>06</span>',
      'mob.contact': 'Contact <span>07</span>',

      'hero.badge': 'Disponible · Booking',
      'hero.t1': 'Des vidéos qui', 'hero.t2': 'arrêtent le scroll', 'hero.t3': 'et qui <em>convertissent.</em>',
      'hero.sub': 'Je crée des publicités TikTok, Meta &amp; YouTube Shorts conçues comme des <strong>fonnels haute conversion</strong> — accroche en 3 s, rétention, vente. Un cerveau d\'ingénieur logiciel au service du direct response.',
      'hero.cta1': 'Lancer un projet', 'hero.cta2': 'Voir le showreel',
      'hero.stat1': 'Gain de Hook Rate moyen', 'hero.stat2': 'ROAS moyen constaté', 'hero.stat3': 'Publicités livrées', 'hero.stat4': 'Livraison du premier cut',

      'svc.eyebrow': '01 — Services',
      'svc.title': 'Conçus comme des funnels.<br /><span class="muted">Livrés comme des ads.</span>',
      'svc.lede': 'Quatre façons d\'aider les marques à arrêter de brûler leur budget en vidéos plates.',
      'svc1.t': 'Publicités vidéo social media',
      'svc1.d': 'Des créations à fort impact pour TikTok, Meta (Instagram/Facebook) &amp; YouTube Shorts — pensées pour l\'arrêt du pouce et le CTR.',
      'svc1.l1': 'Vertical natif 9:16', 'svc1.l2': 'Variations d\'accroches &amp; A/B testing', 'svc1.l3': 'Montage dans les trends',
      'svc2.t': 'Démos SaaS &amp; Apps',
      'svc2.d': 'Des vidéos promotionnelles claires et modernes pour les produits tech. Je comprends votre produit pour que le récit fonctionne vraiment.',
      'svc2.l1': 'Screen recording &amp; motion UI', 'svc2.l2': 'Storytelling bénéfice-produit', 'svc2.l3': 'Narration par le fondateur',
      'svc3.t': 'UGC &amp; Direct Response',
      'svc3.d': 'Des rushs de créateurs transformés en publicités dynamiques optimisées pour le Hook Rate, le Hold Rate et la conversion.',
      'svc3.l1': 'Rythme &amp; optimisation des cuts', 'svc3.l2': 'Stratégie de sous-titres', 'svc3.l3': 'Multiples ratios d\'écran',
      'svc4.t': 'Motion Design &amp; Sous-titres',
      'svc4.d': 'Textes animés, transitions cinétiques et sound design qui gardent le spectateur jusqu\'au CTA.',
      'svc4.l1': 'Compositions After Effects', 'svc4.l2': 'Sous-titres dynamiques incrustés', 'svc4.l3': 'Bibliothèque SFX &amp; mixage',

      'reel.eyebrow': '02 — Showreel',
      'reel.title': 'Récentes <span class="muted">réalisations.</span>',
      'reel.lede': 'Des études de cas aux résultats réels — e-commerce, SaaS et marques lifestyle. Recherchez un projet par nom, plateforme ou style, puis cliquez sur une vignette pour le prévisualiser.',
      'search.ph': 'Rechercher un projet — ex. UGC, Meta Ads, VIN, spot TV…',
      'share.toggle': 'Créer un lien client', 'share.exit': 'Quitter la sélection',
      'notice.text': 'Vous consultez une <b>sélection personnalisée</b> — <b>{n}</b> vidéos choisies pour vous.',
      'exit.selection': 'Voir tout le portfolio',
      'pager.prev': 'Projets précédents', 'pager.next': 'Projets suivants',

      'proc.eyebrow': '03 — Processus',
      'proc.title': 'Ingénierie, <span class="muted">pas d\'improvisation.</span>',
      'proc.lede': 'Ma formation est le logiciel. Chaque publicité livrée est un système mesurable, déboguable et itérable.',
      'proc1.t': 'Diagnostic &amp; découverte', 'proc1.d': 'Audit des créations existantes, ICP, offre et accroches concurrentes. Définition de la thèse de conversion à tester.',
      'proc2.t': 'Ingénierie des accroches', 'proc2.d': '3 à 5 angles d\'accroche distincts par concept — interruption de pattern, problème-agitation, preuve sociale, transformation, natif.',
      'proc3.t': 'Montage &amp; motion', 'proc3.d': 'Premiere Pro + After Effects. Rythme calibré pour l\'algo. Sous-titres, SFX et B-roll pensés pour la rétention.',
      'proc4.t': 'Livraison &amp; itération', 'proc4.d': 'Livraison multi-formats. Puis on lit les données : Hook Rate, Hold Rate, CTR, ROAS — et la V2 part sous 72 h.',

      'tool.eyebrow': '04 — Outils', 'tool.title': 'La <span class="muted">stack.</span>',
      'tool1.t': 'Premiere Pro', 'tool1.d': 'NLE principal pour les montages ads rythmés, multi-cam &amp; handoffs équipe.',
      'tool2.t': 'After Effects', 'tool2.d': 'Motion design, typographie cinétique, compositing &amp; transitions.',
      'tool3.t': 'CapCut Pro', 'tool3.d': 'Rythme natif TikTok, cuts tendance, synchro sous-titres instantanée.',
      'tool4.t': 'Photoshop · Illustrator', 'tool4.d': 'Création d\'assets, miniatures, logos vectoriels &amp; brand kits.',

      'testi.eyebrow': '05 — Clients',
      'testi.title': 'Des résultats qui font <span class="muted">revenir.</span>',
      'testi.lede': 'Pas des compliments — des chiffres. Voici ce qui se passe après le premier batch.',
      'strip.1v': '92%', 'strip.1l': 'de clients reviennent', 'strip.2v': '-38%', 'strip.2l': 'CPA moyen après 30 jours',
      'strip.3v': '4,3×', 'strip.3l': 'ROAS moyen tous comptes', 'strip.4v': '72 h', 'strip.4l': 'itération V2',
      'q1': 'Hook rate en hausse de <em>287%</em> en 14 jours, CPA en baisse de <em>43%</em>. Il a battu toute notre équipe interne — on lui a confié le compte.',
      'q2': 'La démo s\'est remboursée en un seul ad set. <em>4,6× de ROAS</em> dès le premier sprint — on a suspendu notre agence la même semaine.',
      'q3': 'Six créations, <em>68% de hold rate</em>, et notre réassort s\'est vendu en 11 jours. Le format interview reste notre meilleur performer six mois après.',
      'q4': 'Trois variantes d\'accroche ont battu notre contrôle dès la première semaine. Le CTR à froid est passé de 1,9% à <em>3,8%</em>. Rapide, calme, chirurgical.',
      'r1': 'Directrice création · Aurora Apparel', 'r2': 'CEO · Northwave', 'r3': 'Fondateur · Double Root Coffee', 'r4': 'Head of Growth · Pulse',

      'about.eyebrow': '06 — Qui sommes-nous',
      'about.title': 'Nous sommes <span class="about__name">LifeSchédio.</span>',
      'about.p1': 'LifeSchédio est un studio de publicités vidéo construit pour une seule chose : <strong>transformer les scrolleurs en acheteurs</strong>. Nous concevons des créations TikTok, Meta &amp; YouTube Shorts comme des funnels — accroche dans les 3 premières secondes, rythme qui retient, CTA qui conclut.',
      'about.p2': 'Derrière chaque cut, un système de direct response : psychologie du consommateur, tests d\'accroches systématiques et lectures de Hook Rate, Hold Rate, CTR et ROAS. Premier cut livré en <strong>24–48 h</strong>, puis itérations jusqu\'à ce que l\'ad gagne.',
      'about.p3': 'De l\'e-commerce et du lifestyle au SaaS et au spot TV, notre travail tourne en <strong>flux 9:16</strong> comme sur <strong>grand écran</strong>, entre l\'Afrique, l\'Europe et l\'Amérique du Nord. Chaque client repart avec quelque chose à montrer — et des chiffres à l\'appui.',
      'about.li1': 'Publicités vidéo social media', 'about.li2': 'Démos SaaS &amp; Apps', 'about.li3': 'UGC &amp; Direct Response', 'about.li4': 'Motion Design &amp; Sous-titres',
      'about.card.name': 'LifeSchédio', 'about.card.tag': 'Des vidéos pensées pour convertir',
      'about.stat1v': '180+', 'about.stat1l': 'ads livrées', 'about.stat2v': '4,3×', 'about.stat2l': 'ROAS moyen', 'about.stat3v': '24–48 h', 'about.stat3l': 'premier cut',

      'cta.eyebrow': '07 — Travaillons ensemble',
      'cta.title': 'Transformons vos viewers <br />en <span class="cta__accent">clients.</span>',
      'cta.lede': 'Envoyez un brief. Réponse sous 24 h avec un plan de cut et un devis.',
      'cta.book': 'Réserver un appel 20 min',
      'cta.contact': 'Nous contacter',
      'modal.eyebrow': 'Nouveau brief', 'modal.title': 'Envoyez un brief ici',
      'form.name': 'Votre nom', 'form.email': 'Adresse email', 'form.subject': 'Sujet',
      'form.budget': 'Budget <span>(optionnel)</span>', 'form.details': 'Détails du projet',
      'form.subject.ph': 'Choisissez un sujet…', 'form.subject.1': 'Demande de devis', 'form.subject.2': 'Nouveau projet',
      'form.subject.3': 'Consultation gratuite', 'form.subject.4': 'Question générale',
      'form.budget.ph': 'Choisissez une fourchette…', 'form.budget.1': 'Moins de 500 $', 'form.budget.2': '500 – 1 000 $',
      'form.budget.3': '1 000 – 3 000 $', 'form.budget.4': 'Plus de 3 000 $',
      'form.message.ph': 'Parlez-moi de votre marque, vos objectifs, vos plateformes (TikTok, Meta…) et votre calendrier.',
      'form.submit': 'Envoyer le message',
      'form.val.name': 'Veuillez saisir votre nom.', 'form.val.email': 'Veuillez saisir une adresse email valide.',
      'form.val.subject': 'Veuillez choisir un sujet.', 'form.val.message': 'Dites-moi en quelques mots votre projet.',
      'form.sending': 'Envoi en cours…', 'form.success': 'Merci — votre brief est en route. Je réponds sous 24 h.',
      'form.error.net': 'Erreur réseau. Écrivez-moi directement à gsacreatives@gmail.com.',
      'form.error.generic': 'Une erreur est survenue. Écrivez-moi directement à gsacreatives@gmail.com.',

      'footer.text': 'LifeSchédio — Studio de publicités vidéo.',
      'fab.aria': 'Me recruter — aller à la section contact',

      'count.paged': 'Affichage de <b>5</b> projets sur {n} — glissez ou utilisez les flèches pour voir plus.',
      'count.results': '<b>{n}</b> projet(s) sur {total} — cliquez sur une vignette pour prévisualiser.',
      'count.select': 'Mode sélection — cochez vos vidéos, puis <b>Générer le lien</b> pour votre client.',
      'empty.title': 'Aucun projet ne correspond à « {term} »',
      'empty.hint': 'Essayez une plateforme comme TikTok ou Meta Ads, une marque comme VIN ou Pulse, ou un format comme UGC ou spot TV.',
      'suggest.all': 'Projets suggérés', 'suggest.matches': 'Projets correspondants',
      'share.count': '<b>{n}</b> sélectionnée(s)',
      'share.generate': 'Générer le lien', 'share.copy': 'Copier', 'share.done': 'Terminé',
      'share.ready': 'Lien prêt — copié dans le presse-papiers. Envoyez-le à votre client.',
      'share.ready.manual': 'Lien prêt — copiez-le ci-dessus et envoyez-le à votre client.',
      'share.copied': 'Copié dans le presse-papiers.', 'share.copyfail': 'Échec de la copie — sélectionnez le lien et copiez-le manuellement.',
      'tile.play': 'Lire',
      'lightbox.unavailable': 'Aperçu indisponible'
    },

    es: {
      'nav.services': 'Servicios', 'nav.work': 'Proyectos', 'nav.process': 'Proceso', 'nav.toolkit': 'Herramientas',
      'nav.clients': 'Clientes', 'nav.about': 'Nosotros', 'nav.contact': 'Contacto', 'nav.hire': 'Contrátame',
      'mob.services': 'Servicios <span>01</span>', 'mob.work': 'Proyectos <span>02</span>', 'mob.process': 'Proceso <span>03</span>',
      'mob.toolkit': 'Herramientas <span>04</span>', 'mob.clients': 'Clientes <span>05</span>', 'mob.about': 'Nosotros <span>06</span>',
      'mob.contact': 'Contacto <span>07</span>',

      'hero.badge': 'Disponible · Reservando',
      'hero.t1': 'Anuncios de vídeo', 'hero.t2': 'que frenan el scroll', 'hero.t3': 'y que <em>convierten.</em>',
      'hero.sub': 'Creo anuncios para TikTok, Meta y YouTube Shorts diseñados como <strong>embudos de alta conversión</strong> — gancho en 3 s, retención, venta. Una mente de ingeniero de software al servicio del direct response.',
      'hero.cta1': 'Reservar un proyecto', 'hero.cta2': 'Ver showreel',
      'hero.stat1': 'Subida media del Hook Rate', 'hero.stat2': 'ROAS medio logrado', 'hero.stat3': 'Anuncios entregados', 'hero.stat4': 'Entrega del primer corte',

      'svc.eyebrow': '01 — Servicios',
      'svc.title': 'Diseñados como embudos.<br /><span class="muted">Entregados como anuncios.</span>',
      'svc.lede': 'Cuatro formas de ayudar a las marcas a dejar de quemar presupuesto en vídeos planos.',
      'svc1.t': 'Anuncios de vídeo para redes',
      'svc1.d': 'Creatividades de alto impacto para TikTok, Meta (Instagram/Facebook) y YouTube Shorts — pensadas para frenar el pulgar y el CTR.',
      'svc1.l1': 'Vertical nativo 9:16', 'svc1.l2': 'Variaciones de gancho y A/B testing', 'svc1.l3': 'Edición según tendencias',
      'svc2.t': 'Demos SaaS y de apps',
      'svc2.d': 'Vídeos promocionales claros y modernos para productos tecnológicos. Entiendo tu producto para que la historia funcione de verdad.',
      'svc2.l1': 'Screen recording y motion UI', 'svc2.l2': 'Storytelling de beneficio', 'svc2.l3': 'Narración del fundador',
      'svc3.t': 'UGC y Direct Response',
      'svc3.d': 'Material en bruto de creadores transformado en anuncios dinámicos optimizados para Hook Rate, Hold Rate y conversión.',
      'svc3.l1': 'Ritmo y optimización de cortes', 'svc3.l2': 'Estrategia de subtítulos', 'svc3.l3': 'Múltiples ratios de pantalla',
      'svc4.t': 'Motion graphics y subtítulos',
      'svc4.d': 'Textos animados, transiciones cinéticas y sound design que mantienen al espectador hasta el CTA.',
      'svc4.l1': 'Composiciones en After Effects', 'svc4.l2': 'Subtítulos dinámicos quemados', 'svc4.l3': 'Librería SFX y mezcla',

      'reel.eyebrow': '02 — Showreel',
      'reel.title': 'Trabajos <span class="muted">recientes.</span>',
      'reel.lede': 'Casos de éxito con resultados reales — e-commerce, SaaS y marcas lifestyle. Busca un proyecto por nombre, plataforma o estilo, y haz clic en una tarjeta para verlo.',
      'search.ph': 'Buscar un proyecto — ej. UGC, Meta Ads, VIN, spot TV…',
      'share.toggle': 'Crear enlace para cliente', 'share.exit': 'Salir de la selección',
      'notice.text': 'Estás viendo una <b>selección personalizada</b> — <b>{n}</b> vídeos elegidos para ti.',
      'exit.selection': 'Ver todo el portfolio',
      'pager.prev': 'Proyectos anteriores', 'pager.next': 'Proyectos siguientes',

      'proc.eyebrow': '03 — Proceso',
      'proc.title': 'Ingeniería, <span class="muted">no improvisación.</span>',
      'proc.lede': 'Mi formación es el software. Cada anuncio que entrego es un sistema medible, depurable e iterable.',
      'proc1.t': 'Diagnóstico y descubrimiento', 'proc1.d': 'Auditoría de creatividades existentes, ICP, oferta y ganchos de la competencia. Definimos la tesis de conversión a probar.',
      'proc2.t': 'Ingeniería de ganchos', 'proc2.d': '3 a 5 ángulos de gancho distintos por concepto — interrupción de patrón, problema-agitación, prueba social, transformación, nativo.',
      'proc3.t': 'Edición y motion', 'proc3.d': 'Premiere Pro + After Effects. Ritmo calibrado para el algoritmo. Subtítulos, SFX y B-roll pensados para la retención.',
      'proc4.t': 'Entrega e iteración', 'proc4.d': 'Entrega multi-formato. Luego leemos los datos: Hook Rate, Hold Rate, CTR, ROAS — y la V2 sale en 72 h.',

      'tool.eyebrow': '04 — Herramientas', 'tool.title': 'El <span class="muted">stack.</span>',
      'tool1.t': 'Premiere Pro', 'tool1.d': 'NLE principal para ediciones rápidas, multicámara y trabajo en equipo.',
      'tool2.t': 'After Effects', 'tool2.d': 'Motion graphics, tipografía cinética, composición y transiciones.',
      'tool3.t': 'CapCut Pro', 'tool3.d': 'Ritmo nativo de TikTok, cortes de tendencia, sincronización de subtítulos.',
      'tool4.t': 'Photoshop · Illustrator', 'tool4.d': 'Creación de assets, miniaturas, logos vectoriales y brand kits.',

      'testi.eyebrow': '05 — Clientes',
      'testi.title': 'Resultados por los que <span class="muted">vuelven.</span>',
      'testi.lede': 'No cumplidos — números. Esto es lo que pasa tras el primer lote.',
      'strip.1v': '92%', 'strip.1l': 'de clientes repiten', 'strip.2v': '-38%', 'strip.2l': 'CPA medio a 30 días',
      'strip.3v': '4,3×', 'strip.3l': 'ROAS medio en todas las cuentas', 'strip.4v': '72 h', 'strip.4l': 'iteración V2',
      'q1': 'Hook rate subió un <em>287%</em> en 14 días y el CPA bajó un <em>43%</em>. Superó a todo nuestro equipo interno — le pasamos la cuenta entera.',
      'q2': 'La demo se pagó sola en un solo ad set. <em>4,6× de ROAS</em> en el primer sprint — pausamos nuestra agencia esa misma semana.',
      'q3': 'Seis creatividades, <em>68% de hold rate</em>, y la reposición se agotó en 11 días. El formato de entrevistas sigue siendo nuestro mejor activo seis meses después.',
      'q4': 'Tres variantes de gancho vencieron a nuestro control en la primera semana. El CTR en frío pasó del 1,9% al <em>3,8%</em>. Rápido, sereno y quirúrgico.',
      'r1': 'Directora creativa · Aurora Apparel', 'r2': 'CEO · Northwave', 'r3': 'Fundador · Double Root Coffee', 'r4': 'Head of Growth · Pulse',

      'about.eyebrow': '06 — Quiénes somos',
      'about.title': 'Somos <span class="about__name">LifeSchédio.</span>',
      'about.p1': 'LifeSchédio es un estudio de anuncios de vídeo construido para una sola cosa: <strong>convertir espectadores en compradores</strong>. Diseñamos creatividades para TikTok, Meta y YouTube Shorts como embudos — gancho en los primeros 3 segundos, ritmo que retiene y CTA que cierra.',
      'about.p2': 'Detrás de cada corte hay un sistema de direct response: psicología del consumidor, pruebas sistemáticas de ganchos y lecturas de Hook Rate, Hold Rate, CTR y ROAS. Primer corte en <strong>24–48 h</strong> y luego iteramos hasta que el anuncio gana.',
      'about.p3': 'Del e-commerce y el lifestyle al SaaS y el spot de TV, nuestro trabajo corre en <strong>feed 9:16</strong> y en <strong>gran pantalla</strong>, entre África, Europa y Norteamérica. Cada cliente se va con algo que enseñar — y cifras que lo respaldan.',
      'about.li1': 'Anuncios de vídeo para redes', 'about.li2': 'Demos SaaS y de apps', 'about.li3': 'UGC y Direct Response', 'about.li4': 'Motion graphics y subtítulos',
      'about.card.name': 'LifeSchédio', 'about.card.tag': 'Vídeos diseñados para convertir',
      'about.stat1v': '180+', 'about.stat1l': 'anuncios entregados', 'about.stat2v': '4,3×', 'about.stat2l': 'ROAS medio', 'about.stat3v': '24–48 h', 'about.stat3l': 'primer corte',

      'cta.eyebrow': '07 — Trabajemos',
      'cta.title': 'Convirtamos espectadores <br />en <span class="cta__accent">clientes.</span>',
      'cta.lede': 'Envía un brief. Respondo en 24 horas con un plan de corte y presupuesto.',
      'cta.book': 'Reservar llamada de 20 min',
      'cta.contact': 'Contáctanos',
      'modal.eyebrow': 'Nuevo brief', 'modal.title': 'Envía un brief aquí',
      'form.name': 'Tu nombre', 'form.email': 'Correo electrónico', 'form.subject': 'Asunto',
      'form.budget': 'Presupuesto <span>(opcional)</span>', 'form.details': 'Detalles del proyecto',
      'form.subject.ph': 'Elige un asunto…', 'form.subject.1': 'Solicitar presupuesto', 'form.subject.2': 'Nuevo proyecto',
      'form.subject.3': 'Consulta gratuita', 'form.subject.4': 'Pregunta general',
      'form.budget.ph': 'Elige un rango…', 'form.budget.1': 'Menos de 500 $', 'form.budget.2': '500 – 1 000 $',
      'form.budget.3': '1 000 – 3 000 $', 'form.budget.4': 'Más de 3 000 $',
      'form.message.ph': 'Cuéntame tu marca, objetivos, plataformas (TikTok, Meta…) y plazos.',
      'form.submit': 'Enviar mensaje',
      'form.val.name': 'Introduce tu nombre.', 'form.val.email': 'Introduce un correo válido.',
      'form.val.subject': 'Elige un asunto.', 'form.val.message': 'Cuéntame en pocas palabras tu proyecto.',
      'form.sending': 'Enviando…', 'form.success': 'Gracias — tu brief está en camino. Respondo en 24 horas.',
      'form.error.net': 'Error de red. Escríbeme directamente a gsacreatives@gmail.com.',
      'form.error.generic': 'Algo salió mal. Escríbeme directamente a gsacreatives@gmail.com.',

      'footer.text': 'LifeSchédio — Estudio de anuncios de vídeo.',
      'fab.aria': 'Contrátame — ir a la sección de contacto',

      'count.paged': 'Mostrando <b>5</b> de {n} proyectos — desliza o usa las flechas para ver más.',
      'count.results': '<b>{n}</b> de {total} proyectos — haz clic en una tarjeta para verlo.',
      'count.select': 'Modo selección — marca tus vídeos y pulsa <b>Generar enlace</b> para tu cliente.',
      'empty.title': 'Ningún proyecto coincide con "{term}"',
      'empty.hint': 'Prueba una plataforma como TikTok o Meta Ads, una marca como VIN o Pulse, o un formato como UGC o spot TV.',
      'suggest.all': 'Proyectos sugeridos', 'suggest.matches': 'Proyectos que coinciden',
      'share.count': '<b>{n}</b> seleccionados',
      'share.generate': 'Generar enlace', 'share.copy': 'Copiar', 'share.done': 'Listo',
      'share.ready': 'Enlace listo — copiado al portapapeles. Envíalo a tu cliente.',
      'share.ready.manual': 'Enlace listo — cópialo arriba y envíalo a tu cliente.',
      'share.copied': 'Copiado al portapapeles.', 'share.copyfail': 'Copia fallida — selecciona el enlace y cópialo manualmente.',
      'tile.play': 'Reproducir',
      'lightbox.unavailable': 'Vista previa no disponible'
    },

    ar: {
      'nav.services': 'الخدمات', 'nav.work': 'الأعمال', 'nav.process': 'المنهجية', 'nav.toolkit': 'الأدوات',
      'nav.clients': 'العملاء', 'nav.about': 'من نحن', 'nav.contact': 'تواصل', 'nav.hire': 'وظّفني',
      'mob.services': 'الخدمات <span>01</span>', 'mob.work': 'الأعمال <span>02</span>', 'mob.process': 'المنهجية <span>03</span>',
      'mob.toolkit': 'الأدوات <span>04</span>', 'mob.clients': 'العملاء <span>05</span>', 'mob.about': 'من نحن <span>06</span>',
      'mob.contact': 'تواصل <span>07</span>',

      'hero.badge': 'متاح للحجز',
      'hero.t1': 'إعلانات فيديو', 'hero.t2': 'توقف التمرير', 'hero.t3': 'و<em>تحقّق المبيعات.</em>',
      'hero.sub': 'أصنع إعلانات TikTok وMeta وYouTube Shorts مصمّمة كـ<strong>قمع عالي التحويل</strong> — خطّاف في 3 ثوانٍ، ثم احتفاظ، ثم بيع. عقل مهندس برمجيات في خدمة التسويق المباشر.',
      'hero.cta1': 'احجز مشروعاً', 'hero.cta2': 'شاهد الأعمال',
      'hero.stat1': 'متوسط ارتفاع Hook Rate', 'hero.stat2': 'متوسط ROAS', 'hero.stat3': 'إعلان منجز', 'hero.stat4': 'تسليم أول نسخة',

      'svc.eyebrow': '01 — الخدمات',
      'svc.title': 'نُصمّم كالقمع.<br /><span class="muted">نُسلّم كالإعلان.</span>',
      'svc.lede': 'أربع طرق أساعد بها العلامات التجارية على التوقف عن حرق الميزانية في فيديوهات مملة.',
      'svc1.t': 'إعلانات الفيديو للسوشيال ميديا',
      'svc1.d': 'إبداعات عالية التأثير لـ TikTok وMeta (Instagram/Facebook) وYouTube Shorts — مصمّمة لإيقاف الإبهام ورفع CTR.',
      'svc1.l1': 'عمودي أصلي 9:16', 'svc1.l2': 'تنويعات الخطّاف واختبار A/B', 'svc1.l3': 'مونتاج مواكب للترندات',
      'svc2.t': 'عروض SaaS والتطبيقات',
      'svc2.d': 'فيديوهات ترويجية واضحة وعصرية للمنتجات التقنية. أفهم منتجك لتحكي القصة كما يجب.',
      'svc2.l1': 'تسجيل الشاشة وحركة الواجهة', 'svc2.l2': 'سرد القصة من الميزة إلى المنفعة', 'svc2.l3': 'سرد بصوت المؤسس',
      'svc3.t': 'UGC والاستجابة المباشرة',
      'svc3.d': 'تحويل لقطات صنّاع المحتوى الخام إلى إعلانات ديناميكية محسّنة لـ Hook Rate وHold Rate والتحويل.',
      'svc3.l1': 'إيقاع وتحسين القصّ', 'svc3.l2': 'استراتيجية الترجمة على الشاشة', 'svc3.l3': 'أبعاد متعددة',
      'svc4.t': 'موشن جرافيك وترجمة',
      'svc4.d': 'نصوص متحركة وانتقالات حركية وتصميم صوتي يُبقى المشاهد حتى الـ CTA.',
      'svc4.l1': 'تكوينات After Effects', 'svc4.l2': 'ترجمة ديناميكية محروقة على الفيديو', 'svc4.l3': 'مكتبة مؤثرات صوتية ودمج',

      'reel.eyebrow': '02 — الأعمال',
      'reel.title': 'أعمال <span class="muted">حديثة.</span>',
      'reel.lede': 'دراسات حالة بنتائج حقيقية — تجارة إلكترونية وSaaS وعلامات لايف ستايل. ابحث باسم المشروع أو المنصة أو النمط، ثم انقر أي بطاقة للمعاينة.',
      'search.ph': 'ابحث عن مشروع — مثال: UGC، Meta Ads، VIN، spot TV…',
      'share.toggle': 'إنشاء رابط عميل', 'share.exit': 'إنهاء التحديد',
      'notice.text': 'أنت تشاهد <b>تشكيلة مخصصة</b> — <b>{n}</b> فيديو اختيرت لك.',
      'exit.selection': 'عرض الموقع كاملاً',
      'pager.prev': 'المشاريع السابقة', 'pager.next': 'المشاريع التالية',

      'proc.eyebrow': '03 — المنهجية',
      'proc.title': 'هندسة، <span class="muted">لا ارتجال.</span>',
      'proc.lede': 'خلفيتي الهندسة البرمجية، لذا كل إعلان أسلّمه نظام قابل للقياس والتصحيح والتكرار.',
      'proc1.t': 'التشخيص والاكتشاف', 'proc1.d': 'تدقيق الإبداعات الحالية والشخصية المستهدفة والعرض وخطّافات المنافسين. نحدّد أطروحة التحويل التي سنختبرها.',
      'proc2.t': 'هندسة الخطّافات', 'proc2.d': 'من 3 إلى 5 زوايا خطّاف مختلفة لكل مفهوم — مقاطعة النمط، مشكلة-تحريض، دليل اجتماعي، تحوّل، محتوى أصلي.',
      'proc3.t': 'المونتاج والموشن', 'proc3.d': 'Premiere Pro + After Effects. إيقاع مضبوط على خوارزمية المنصة. ترجمة ومؤثرات وB-roll للاحتفاظ.',
      'proc4.t': 'التسليم والتكرار', 'proc4.d': 'تسليم متعدد الأبعاد. ثم نقرأ البيانات: Hook Rate وHold Rate وCTR وROAS — والنسخة الثانية خلال 72 ساعة.',

      'tool.eyebrow': '04 — الأدوات', 'tool.title': 'الـ <span class="muted">stack.</span>',
      'tool1.t': 'Premiere Pro', 'tool1.d': 'المحرّر الأساسي لمونتاج الإعلانات السريع وتسليم الفريق.',
      'tool2.t': 'After Effects', 'tool2.d': 'موشن جرافيك وطباعة حركية ودمج وانتقالات.',
      'tool3.t': 'CapCut Pro', 'tool3.d': 'إيقاع TikTok الأصلي وقصّات مواكبة للترند ومزامنة ترجمة فورية.',
      'tool4.t': 'Photoshop · Illustrator', 'tool4.d': 'إنشاء الأصول وتصميم المصغّرات والشعارات وأدلة الهوية.',

      'testi.eyebrow': '05 — العملاء',
      'testi.title': 'نتائج يعودون <span class="muted">من أجلها.</span>',
      'testi.lede': 'ليس مجاملات — أرقام. هذا ما يحدث بعد أول دفعة.',
      'strip.1v': '92%', 'strip.1l': 'من العملاء يجدّدون', 'strip.2v': '-38%', 'strip.2l': 'متوسط CPA بعد 30 يوماً',
      'strip.3v': '4.3×', 'strip.3l': 'متوسط ROAS عبر الحسابات', 'strip.4v': '72س', 'strip.4l': 'تسليم النسخة الثانية',
      'q1': 'Hook Rate ارتفع <em>287%</em> في 14 يوماً وCPA انخفض <em>43%</em>. تفوّق على فريقنا الداخلي بأكمله — فسلّمناه الحساب كاملاً.',
      'q2': 'فيديو العرض استرد تكلفته من حملة إعلانية واحدة. <em>4.6× ROAS</em> في أول دفعة — أوقفنا عقد الوكالة في نفس الأسبوع.',
      'q3': 'ست إبداعات، <em>Hold Rate ‏68%</em>، والمخزون الجديد نفد خلال 11 يوماً. مقابلات الشارع ما زالت الأفضل بعد ستة أشهر.',
      'q4': 'ثلاث نسخ خطّاف تفوّقت على المجموعة الضابطة في الأسبوع الأول. CTR للزيارات الباردة من 1.9% إلى <em>3.8%</em>. سريع وهادئ ودقيق.',
      'r1': 'مديرة الإبداع · Aurora Apparel', 'r2': 'الرئيس التنفيذي · Northwave', 'r3': 'المؤسس · Double Root Coffee', 'r4': 'رئيس النمو · Pulse',

      'about.eyebrow': '06 — من نحن',
      'about.title': 'نحن <span class="about__name">LifeSchédio.</span>',
      'about.p1': 'LifeSchédio استوديو إعلانات فيديو بُني لغاية واحدة: <strong>تحويل الممرّرين إلى مشترين</strong>. نصمّم إبداعات TikTok وMeta وYouTube Shorts كالقمع — خطّاف في أول 3 ثوانٍ، وإيقاع يشدّ الانتباه، وCTA يُغلق البيع.',
      'about.p2': 'خلف كل قصّة نظام استجابة مباشرة: سيكولوجية المستهلك، واختبار منهجي للخطّافات، وقراءات لـ Hook Rate وHold Rate وCTR وROAS. نسلّم أول نسخة خلال <strong>24–48 ساعة</strong> ثم نكرّر حتى يربح الإعلان.',
      'about.p3': 'من التجارة الإلكترونية ولايف ستايل إلى عروض SaaS وإعلانات التلفاز، أعمالنا تعمل في <strong>فيديوهات 9:16</strong> وعلى <strong>الشاشات الكبيرة</strong> بين أفريقيا وأوروبا وأمريكا الشمالية. كل عميل يغادر بشيء يُعرضه — وأرقام تؤيّده.',
      'about.li1': 'إعلانات الفيديو للسوشيال', 'about.li2': 'عروض SaaS والتطبيقات', 'about.li3': 'UGC والاستجابة المباشرة', 'about.li4': 'موشن جرافيك وترجمة',
      'about.card.name': 'LifeSchédio', 'about.card.tag': 'فيديوهات مصمّمة للتحويل',
      'about.stat1v': '+180', 'about.stat1l': 'إعلان منجز', 'about.stat2v': '4.3×', 'about.stat2l': 'متوسط ROAS', 'about.stat3v': '24–48', 'about.stat3l': 'ساعة لأول نسخة',

      'cta.eyebrow': '07 — لنعمل معاً',
      'cta.title': 'لنحوّل المشاهدين <br />إلى <span class="cta__accent">عملاء.</span>',
      'cta.lede': 'أرسل موجزاً. أرد خلال 24 ساعة بخطة مونتاج وتسعيرة.',
      'cta.book': 'احجز مكالمة 20 دقيقة',
      'cta.contact': 'اتصل بنا',
      'modal.eyebrow': 'موجز جديد', 'modal.title': 'أرسل الموجز هنا',
      'form.name': 'اسمك', 'form.email': 'البريد الإلكتروني', 'form.subject': 'الموضوع',
      'form.budget': 'الميزانية <span>(اختياري)</span>', 'form.details': 'تفاصيل المشروع',
      'form.subject.ph': 'اختر الموضوع…', 'form.subject.1': 'طلب تسعيرة', 'form.subject.2': 'استفسار مشروع جديد',
      'form.subject.3': 'استشارة مجانية', 'form.subject.4': 'سؤال عام',
      'form.budget.ph': 'اختر الميزانية…', 'form.budget.1': 'أقل من 500$', 'form.budget.2': '500 – 1,000$',
      'form.budget.3': '1,000 – 3,000$', 'form.budget.4': 'أكثر من 3,000$',
      'form.message.ph': 'حدّثني عن علامتك وأهدافك ومنصاتك (TikTok, Meta…) وجدولك الزمني.',
      'form.submit': 'إرسال الرسالة',
      'form.val.name': 'يرجى إدخال اسمك.', 'form.val.email': 'يرجى إدخال بريد إلكتروني صحيح.',
      'form.val.subject': 'يرجى اختيار الموضوع.', 'form.val.message': 'أخبرني بكلمات قليلة عن مشروعك.',
      'form.sending': 'جارٍ الإرسال…', 'form.success': 'شكراً — موجزك في الطريق. أرد خلال 24 ساعة.',
      'form.error.net': 'خطأ في الشبكة. راسلني مباشرة على gsacreatives@gmail.com.',
      'form.error.generic': 'حدث خطأ ما. راسلني مباشرة على gsacreatives@gmail.com.',

      'footer.text': 'LifeSchédio — استوديو إعلانات الفيديو.',
      'fab.aria': 'وظّفني — الانتقال إلى قسم التواصل',

      'count.paged': 'عرض <b>5</b> من {n} مشاريع — اسحب أو استخدم الأسهم لرؤية المزيد.',
      'count.results': '<b>{n}</b> من {total} مشروعاً — انقر أي بطاقة للمعاينة.',
      'count.select': 'وضع التحديد — اختر فيديوهاتك ثم اضغط <b>توليد الرابط</b> لعميلك.',
      'empty.title': 'لا مشاريع تطابق "{term}"',
      'empty.hint': 'جرّب منصة مثل TikTok أو Meta Ads، أو علامة مثل VIN أو Pulse، أو نمطاً مثل UGC أو spot TV.',
      'suggest.all': 'مشاريع مقترحة', 'suggest.matches': 'مشاريع مطابقة',
      'share.count': '<b>{n}</b> محدد',
      'share.generate': 'توليد الرابط', 'share.copy': 'نسخ', 'share.done': 'تم',
      'share.ready': 'الرابط جاهز — تم نسخه. أرسله إلى عميلك.',
      'share.ready.manual': 'الرابط جاهز — انسخه من الأعلى وأرسله إلى عميلك.',
      'share.copied': 'تم النسخ.', 'share.copyfail': 'فشل النسخ — حدّد الرابط وانسخه يدوياً.',
      'tile.play': 'تشغيل',
      'lightbox.unavailable': 'المعاينة غير متاحة'
    }
  };

  /* ---------------- Selector map (innerHTML) ---------------- */
  var MAP = [
    // Nav
    { sel: '[data-testid="nav-services-link"]', k: 'nav.services' },
    { sel: '[data-testid="nav-showreel-link"]', k: 'nav.work' },
    { sel: '[data-testid="nav-process-link"]', k: 'nav.process' },
    { sel: '[data-testid="nav-toolkit-link"]', k: 'nav.toolkit' },
    { sel: '[data-testid="nav-testimonials-link"]', k: 'nav.clients' },
    { sel: '[data-testid="nav-about-link"]', k: 'nav.about' },
    { sel: '[data-testid="nav-contact-link"]', k: 'nav.contact' },
    { sel: '[data-testid="nav-cta-button"] span', k: 'nav.hire' },
    // Mobile menu
    { sel: '[data-testid="mobile-services-link"]', k: 'mob.services' },
    { sel: '[data-testid="mobile-showreel-link"]', k: 'mob.work' },
    { sel: '[data-testid="mobile-process-link"]', k: 'mob.process' },
    { sel: '[data-testid="mobile-toolkit-link"]', k: 'mob.toolkit' },
    { sel: '[data-testid="mobile-testimonials-link"]', k: 'mob.clients' },
    { sel: '[data-testid="mobile-about-link"]', k: 'mob.about' },
    { sel: '[data-testid="mobile-contact-link"]', k: 'mob.contact' },
    { sel: '[data-testid="mobile-hire-button"] span', k: 'nav.hire' },
    // Hero
    { sel: '[data-testid="hero-section"] .badge', k: 'hero.badge' },
    { sel: '[data-testid="hero-title"] .line:nth-child(1)', k: 'hero.t1' },
    { sel: '[data-testid="hero-title"] .line:nth-child(2)', k: 'hero.t2' },
    { sel: '[data-testid="hero-title"] .line:nth-child(3)', k: 'hero.t3' },
    { sel: '[data-testid="hero-subtitle"]', k: 'hero.sub' },
    { sel: '[data-testid="hero-cta-primary"] span', k: 'hero.cta1' },
    { sel: '[data-testid="hero-cta-secondary"]', k: 'hero.cta2' },
    { sel: '.hero__stats li:nth-child(1) span', k: 'hero.stat1' },
    { sel: '.hero__stats li:nth-child(2) span', k: 'hero.stat2' },
    { sel: '.hero__stats li:nth-child(3) span', k: 'hero.stat3' },
    { sel: '.hero__stats li:nth-child(4) span', k: 'hero.stat4' },
    // Services
    { sel: '#services .section__head .eyebrow', k: 'svc.eyebrow' },
    { sel: '#services .section__head .section__title', k: 'svc.title' },
    { sel: '#services .section__head .section__lede', k: 'svc.lede' },
    { sel: '[data-testid="service-social-ads"] h3', k: 'svc1.t' },
    { sel: '[data-testid="service-social-ads"] p', k: 'svc1.d' },
    { sel: '[data-testid="service-social-ads"] li:nth-child(1)', k: 'svc1.l1' },
    { sel: '[data-testid="service-social-ads"] li:nth-child(2)', k: 'svc1.l2' },
    { sel: '[data-testid="service-social-ads"] li:nth-child(3)', k: 'svc1.l3' },
    { sel: '[data-testid="service-saas-demos"] h3', k: 'svc2.t' },
    { sel: '[data-testid="service-saas-demos"] p', k: 'svc2.d' },
    { sel: '[data-testid="service-saas-demos"] li:nth-child(1)', k: 'svc2.l1' },
    { sel: '[data-testid="service-saas-demos"] li:nth-child(2)', k: 'svc2.l2' },
    { sel: '[data-testid="service-saas-demos"] li:nth-child(3)', k: 'svc2.l3' },
    { sel: '[data-testid="service-ugc-editing"] h3', k: 'svc3.t' },
    { sel: '[data-testid="service-ugc-editing"] p', k: 'svc3.d' },
    { sel: '[data-testid="service-ugc-editing"] li:nth-child(1)', k: 'svc3.l1' },
    { sel: '[data-testid="service-ugc-editing"] li:nth-child(2)', k: 'svc3.l2' },
    { sel: '[data-testid="service-ugc-editing"] li:nth-child(3)', k: 'svc3.l3' },
    { sel: '[data-testid="service-motion-graphics"] h3', k: 'svc4.t' },
    { sel: '[data-testid="service-motion-graphics"] p', k: 'svc4.d' },
    { sel: '[data-testid="service-motion-graphics"] li:nth-child(1)', k: 'svc4.l1' },
    { sel: '[data-testid="service-motion-graphics"] li:nth-child(2)', k: 'svc4.l2' },
    { sel: '[data-testid="service-motion-graphics"] li:nth-child(3)', k: 'svc4.l3' },
    // Showreel
    { sel: '#showreel .section__head .eyebrow', k: 'reel.eyebrow' },
    { sel: '#showreel .section__head .section__title', k: 'reel.title' },
    { sel: '#showreel .section__head .section__lede', k: 'reel.lede' },
    { sel: '#shareToggle span', k: 'share.toggle' },
    { sel: '#selectionNotice span', k: 'notice.text' },
    { sel: '#exitSelection', k: 'exit.selection' },
    { sel: '#showreelPrev', k: 'pager.prev', aria: 'aria-label' },
    { sel: '#showreelNext', k: 'pager.next', aria: 'aria-label' },
    // Process
    { sel: '#process .section__head .eyebrow', k: 'proc.eyebrow' },
    { sel: '#process .section__head .section__title', k: 'proc.title' },
    { sel: '#process .section__head .section__lede', k: 'proc.lede' },
    { sel: '[data-testid="process-step-1"] h3', k: 'proc1.t' },
    { sel: '[data-testid="process-step-1"] p', k: 'proc1.d' },
    { sel: '[data-testid="process-step-2"] h3', k: 'proc2.t' },
    { sel: '[data-testid="process-step-2"] p', k: 'proc2.d' },
    { sel: '[data-testid="process-step-3"] h3', k: 'proc3.t' },
    { sel: '[data-testid="process-step-3"] p', k: 'proc3.d' },
    { sel: '[data-testid="process-step-4"] h3', k: 'proc4.t' },
    { sel: '[data-testid="process-step-4"] p', k: 'proc4.d' },
    // Toolkit
    { sel: '#toolkit .section__head .eyebrow', k: 'tool.eyebrow' },
    { sel: '#toolkit .section__head .section__title', k: 'tool.title' },
    { sel: '[data-testid="tool-card-premiere"] h4', k: 'tool1.t' },
    { sel: '[data-testid="tool-card-premiere"] p', k: 'tool1.d' },
    { sel: '[data-testid="tool-card-aftereffects"] h4', k: 'tool2.t' },
    { sel: '[data-testid="tool-card-aftereffects"] p', k: 'tool2.d' },
    { sel: '[data-testid="tool-card-capcut"] h4', k: 'tool3.t' },
    { sel: '[data-testid="tool-card-capcut"] p', k: 'tool3.d' },
    { sel: '[data-testid="tool-card-ps-ai"] h4', k: 'tool4.t' },
    { sel: '[data-testid="tool-card-ps-ai"] p', k: 'tool4.d' },
    // Testimonials
    { sel: '#testimonials .section__head .eyebrow', k: 'testi.eyebrow' },
    { sel: '#testimonials .section__head .section__title', k: 'testi.title' },
    { sel: '#testimonials .section__head .section__lede', k: 'testi.lede' },
    { sel: '.testimonials__strip div:nth-child(1) strong', k: 'strip.1v' },
    { sel: '.testimonials__strip div:nth-child(1) span', k: 'strip.1l' },
    { sel: '.testimonials__strip div:nth-child(2) strong', k: 'strip.2v' },
    { sel: '.testimonials__strip div:nth-child(2) span', k: 'strip.2l' },
    { sel: '.testimonials__strip div:nth-child(3) strong', k: 'strip.3v' },
    { sel: '.testimonials__strip div:nth-child(3) span', k: 'strip.3l' },
    { sel: '.testimonials__strip div:nth-child(4) strong', k: 'strip.4v' },
    { sel: '.testimonials__strip div:nth-child(4) span', k: 'strip.4l' },
    { sel: '[data-testid="testimonial-1"] blockquote', k: 'q1' },
    { sel: '[data-testid="testimonial-1"] figcaption span', k: 'r1' },
    { sel: '[data-testid="testimonial-2"] blockquote', k: 'q2' },
    { sel: '[data-testid="testimonial-2"] figcaption span', k: 'r2' },
    { sel: '[data-testid="testimonial-3"] blockquote', k: 'q3' },
    { sel: '[data-testid="testimonial-3"] figcaption span', k: 'r3' },
    { sel: '[data-testid="testimonial-4"] blockquote', k: 'q4' },
    { sel: '[data-testid="testimonial-4"] figcaption span', k: 'r4' },
    // About
    { sel: '#about .eyebrow', k: 'about.eyebrow' },
    { sel: '[data-testid="about-title"]', k: 'about.title' },
    { sel: '.about__text p:nth-child(1)', k: 'about.p1' },
    { sel: '.about__text p:nth-child(2)', k: 'about.p2' },
    { sel: '.about__text p:nth-child(3)', k: 'about.p3' },
    { sel: '[data-testid="about-services"] li:nth-child(1)', k: 'about.li1' },
    { sel: '[data-testid="about-services"] li:nth-child(2)', k: 'about.li2' },
    { sel: '[data-testid="about-services"] li:nth-child(3)', k: 'about.li3' },
    { sel: '[data-testid="about-services"] li:nth-child(4)', k: 'about.li4' },
    { sel: '.about__card-name', k: 'about.card.name' },
    { sel: '.about__card-tag', k: 'about.card.tag' },
    { sel: '.about__card-stats li:nth-child(1) strong', k: 'about.stat1v' },
    { sel: '.about__card-stats li:nth-child(1) span', k: 'about.stat1l' },
    { sel: '.about__card-stats li:nth-child(2) strong', k: 'about.stat2v' },
    { sel: '.about__card-stats li:nth-child(2) span', k: 'about.stat2l' },
    { sel: '.about__card-stats li:nth-child(3) strong', k: 'about.stat3v' },
    { sel: '.about__card-stats li:nth-child(3) span', k: 'about.stat3l' },
    // Contact
    { sel: '#contact .eyebrow', k: 'cta.eyebrow' },
    { sel: '[data-testid="cta-title"]', k: 'cta.title' },
    { sel: '#contact .cta__lede', k: 'cta.lede' },
    { sel: '[data-testid="cta-calendar-button"]', k: 'cta.book' },
    { sel: '[data-testid="cta-email-button"] span', k: 'cta.contact' },
    { sel: '.modal__eyebrow', k: 'modal.eyebrow' },
    { sel: '#contactModalTitle', k: 'modal.title' },
    { sel: 'label[for="cf-name"]', k: 'form.name' },
    { sel: 'label[for="cf-email"]', k: 'form.email' },
    { sel: 'label[for="cf-subject"]', k: 'form.subject' },
    { sel: 'label[for="cf-budget"]', k: 'form.budget' },
    { sel: 'label[for="cf-message"]', k: 'form.details' },
    { sel: '#cf-subject option:nth-child(1)', k: 'form.subject.ph' },
    { sel: '#cf-subject option:nth-child(2)', k: 'form.subject.1' },
    { sel: '#cf-subject option:nth-child(3)', k: 'form.subject.2' },
    { sel: '#cf-subject option:nth-child(4)', k: 'form.subject.3' },
    { sel: '#cf-subject option:nth-child(5)', k: 'form.subject.4' },
    { sel: '#cf-budget option:nth-child(1)', k: 'form.budget.ph' },
    { sel: '#cf-budget option:nth-child(2)', k: 'form.budget.1' },
    { sel: '#cf-budget option:nth-child(3)', k: 'form.budget.2' },
    { sel: '#cf-budget option:nth-child(4)', k: 'form.budget.3' },
    { sel: '#cf-budget option:nth-child(5)', k: 'form.budget.4' },
    { sel: '[data-testid="contact-submit"] span', k: 'form.submit' },
    // Footer & misc
    { sel: '.footer__inner span:last-child', k: 'footer.text' },
    { sel: '[data-testid="fab-hire"]', k: 'fab.aria', aria: 'aria-label' }
  ];

  /* ---------------- Placeholders ---------------- */
  var PH = [
    { sel: '#projectFilter', k: 'search.ph' },
    { sel: '#cf-message', k: 'form.message.ph' }
  ];

  /* ---------------- Engine ---------------- */
  var current = 'en';

  function detect() {
    try {
      var saved = localStorage.getItem('gsa_lang');
      if (saved && D[saved]) return saved;
    } catch (e) { }
    var nav = (navigator.language || 'en').toLowerCase();
    if (nav.indexOf('fr') === 0) return 'fr';
    if (nav.indexOf('es') === 0) return 'es';
    if (nav.indexOf('ar') === 0) return 'ar';
    return 'en';
  }

  function t(key, vars) {
    var s = (D[current] && D[current][key]) || D.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace('{' + k + '}', vars[k]);
      });
    }
    return s;
  }

  function apply(lang, skipEvent) {
    if (!D[lang]) lang = 'en';
    current = lang;
    try { localStorage.setItem('gsa_lang', lang); } catch (e) { }
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    MAP.forEach(function (m) {
      var el = document.querySelector(m.aria ? m.sel : m.sel);
      if (!el) return;
      if (m.aria) el.setAttribute(m.aria, t(m.k));
      else el.innerHTML = t(m.k, m.vars);
    });
    // Notice keeps its {n} — re-apply with current count
    var nc = document.getElementById('selectionCount');
    var noticeSpan = document.querySelector('#selectionNotice span');
    if (noticeSpan && nc) noticeSpan.innerHTML = t('notice.text', { n: nc.textContent });

    PH.forEach(function (m) {
      var el = document.querySelector(m.sel);
      if (el) el.setAttribute('placeholder', t(m.k));
    });

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });

    if (!skipEvent) {
      window.dispatchEvent(new CustomEvent('gsa:lang', { detail: { lang: lang } }));
    }
  }

  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.lang); });
  });

  window.GSA_I18N = { t: t, apply: apply, lang: function () { return current; } };

  apply(detect(), true);
})();
