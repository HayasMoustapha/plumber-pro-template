# 🔧 Plumber Pro Template v2.0 — Site premium pour plombier

Template de site web statique **premium** (HTML/CSS/JS vanilla, aucune dépendance,
aucune build) pour plombier / entreprise de plomberie. Optimisé pour la revente
sur **Gumroad**.

**Design** : bleu/blanc/rouge — **Mobile-first** — **SEO local** (schema.org `Plumber`, `FAQPage`, `BreadcrumbList`)

### ✨ Ce qui fait la différence (v2.0)

- 🎨 **3 thèmes de couleurs** intégrés avec switcher de démonstration (Océan, Navy, Crimson)
- 🖱️ **Slider avant/après** interactif pour le portfolio de chantiers
- 📅 **Widget de prise de rendez-vous** (14 jours + créneaux) dans le formulaire de devis
- 📞 **Barre d'appel mobile fixe** — le numéro est toujours à un clic (conversion 24h/24)
- 🖼️ **Icônes SVG cohérentes** (sprite inline, aucune dépendance, colorables via CSS)
- 🎬 **Micro-interactions premium** : boutons à reflet, cartes qui se soulèvent, liserés dorés, compteurs animés, hero en lévitation
- 🧭 **Fil d'Ariane** + **barre de progression de lecture**
- ⭐ **Carrousel de témoignages** (auto-play, swipe tactile, clavier)
- ♿ **Accessibilité** : focus visibles, `prefers-reduced-motion`, ARIA complet

---

## 📦 Contenu du pack

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero illustré, bandeau confiance, process, avant/après, carrousel d'avis |
| `services.html` | 6 services, tarifs indicatifs, FAQ (rich snippets Google) |
| `urgences.html` | Page urgence rouge 24h/24, bons réflexes, tarifs nuit |
| `devis.html` | Formulaire + widget de prise de rendez-vous |
| `contact.html` | Coordonnées, formulaire, emplacement carte |
| `css/style.css` | Design complet (3 thèmes + variables en tête de fichier) |
| `js/main.js` | Toutes les interactions (thèmes, booking, sliders, carrousels, formulaires) |
| `assets/favicon.svg` | Icône de navigateur |
| `assets/screenshots/` | Emplacements des captures d'écran |
| `robots.txt` / `sitemap.xml` | SEO technique |
| `LICENSE.txt` | Licence usage personnel / client unique |
| `README.md` | Ce fichier |

---

## 🚀 Installation

Site 100 % statique — aucune installation.

**Option A — Ouvrir directement** : dézippez puis double-cliquez sur `index.html`.

**Option B — Serveur local (recommandé)**
```bash
cd plumber-pro-template
python -m http.server 8080
# puis ouvrez http://localhost:8080
```

**Option C — Mise en ligne** : glisser-déposer sur **Netlify Drop**, **Vercel**,
**Cloudflare Pages**, ou FTP classique (OVH, o2switch…).

---

## 🎨 Personnalisation

### 1. Les 3 thèmes de couleurs

Le site intègre **trois palettes complètes** commutables en un clic (pastilles dans
l'en-tête, visibles ≥ 1200 px). Le choix du client est **mémorisé** (localStorage).

| Thème | Ambiance | Primary | Secondary |
|---|---|---|---|
| `ocean` *(défaut)* | Bleu/blanc/rouge classique | `#1e40af` | `#dc2626` |
| `navy` | Bleu nuit élégant | `#0f3460` | `#e94560` |
| `crimson` | Charbon & rouge, impact | `#334155` | `#e11d48` |

**Changer le thème par défaut** : dans chaque page HTML, modifiez
`<html lang="fr" data-theme="ocean">` → `navy` ou `crimson`.

**Créer votre propre palette** : dans `css/style.css`, dupliquez un bloc
`[data-theme="..."]` et ajustez les 8 variables de couleurs + le dégradé hero.
Le switcher peut alors être supprimé (la pastille sélectionne le thème, le client
final n'en a pas besoin).

> 💡 **Argument de vente Gumroad** : montrez le switcher dans votre vidéo de démo —
> « 3 designs en 1 » justifie un prix plus élevé.

### 2. Téléphone, e-mail, adresse

Recherchez `À PERSONNALISER` dans les fichiers HTML (Ctrl+F). Conventions :

- **Téléphone** : format international sans espace dans `href` (`tel:+33478123456`),
  format lisible dans le texte (`04 78 12 34 56`). Présent dans : header, menu mobile,
  **barre d'appel mobile**, bandeaux d'urgence, footer, JSON-LD.
- **E-mail** : `contact@exemple-plombier.fr` (liens `mailto:` + footer).
- **Adresse** : footer, page Contact, JSON-LD.

### 3. SEO local (title, description, données structurées)

Chaque page a un bloc `<!-- SEO LOCAL — À PERSONNALISER -->` :

- `title` : *Métier + Ville* — max 60 caractères.
- `description` : 150-160 caractères avec téléphone et argument fort.
- **JSON-LD** présent :
  - `index.html` → fiche entreprise complète (`schema.org/Plumber` : nom, tel,
    adresse, horaires, note). **Remplacez tout.**
  - `services.html` → `FAQPage` (génère les extraits enrichis Google).
  - toutes les pages → `BreadcrumbList` (fil d'Ariane dans les résultats).
- Remplacez `exemple-plombier.fr` dans les `canonical`, `og:url` et `sitemap.xml`.

### 4. Logo et nom

- **Nom** : cherchez `Dubois` (header + footer de chaque page).
- **Icône logo** : `<svg class="icon"><use href="#i-wrench"/></svg>` dans `.logo-icon`.
  Remplacez par votre image si besoin.
- **Favicon** : `assets/favicon.svg`.

### 5. Contenus

- **Services** : cartes `<article class="service-card">` (icône = `<use href="#i-...">`,
  voir la liste des symboles dans le sprite en haut de chaque page).
- **Tarifs** : cartes `<article class="pricing-card">`.
- **Avant/Après** : chaque comparatif `.before-after` contient deux couches —
  remplacez les SVG d'exemple par vos photos :
  ```html
  <div class="ba-before"><img src="assets/img/avant-1.jpg" alt="Avant travaux"></div>
  <div class="ba-after"><img src="assets/img/apres-1.jpg" alt="Après travaux"></div>
  ```
- **Témoignages** : cartes `.testimonial-card` dans le carrousel (ajoutez-en autant,
  le JS crée les dots automatiquement à condition d'ajouter les `<button class="testimonial-dot">`).
- **Villes** : liste `.coverage-grid` sur l'accueil.

### 6. Formulaire — recevoir les demandes par e-mail

Par défaut les formulaires **n'envoient rien** (démo : message de succès local).

**Formspree (recommandé, gratuit jusqu'à 50 envois/mois)**
1. Compte sur [formspree.io](https://formspree.io) → créez un formulaire → copiez l'ID.
2. Dans `devis.html` et `contact.html` :
   ```html
   <form action="https://formspree.io/f/VOTRE_ID" method="POST">
   ```
   (supprimez `data-demo-form novalidate`). Le champ caché `rendez_vous` du widget
   de booking partira automatiquement avec l'envoi.

### 7. Carte Google Maps

Dans `contact.html`, remplacez le placeholder par l'iframe fourni par
Google Maps → **Partager → Intégrer une carte**.

### 8. Désactiver le switcher de thèmes (site livré au client final)

Supprimez le bloc `<div class="theme-switcher">…</div>` dans les 5 pages.
Le thème reste celui de `<html data-theme="...">`. Le JS le gère sans erreur.

---

## 📸 Captures d'écran (placeholders)

> **À compléter avant publication sur Gumroad.**

Chrome → `F12` → `Ctrl+Shift+P` → « Capture full size screenshot » →
enregistrez dans `assets/screenshots/` :

| Fichier attendu | Page | Largeur |
|---|---|---|
| `home-desktop.png` | Accueil | 1440 px |
| `home-mobile.png` | Accueil | 390 px |
| `services-desktop.png` | Services | 1440 px |
| `urgences-desktop.png` | Urgences | 1440 px |
| `devis-desktop.png` | Devis | 1440 px |
| `contact-desktop.png` | Contact | 1440 px |

**Conseil listing Gumroad** : prenez les captures en thème `ocean`, puis 2 captures
bonus en `navy` et `crimson` pour montrer les 3 designs. Ajoutez une couverture
1280 × 720 px (mockup + « 3 thèmes • Prise de RDV • SEO local »).

---

## ✅ Checklist avant livraison client

- [ ] Téléphone remplacé partout (`tel:` + texte + barre mobile)
- [ ] E-mail et adresse remplacés
- [ ] Nom d'entreprise (header, footer, `<title>`, JSON-LD)
- [ ] Thème par défaut choisi (`data-theme` dans les 5 pages)
- [ ] Switcher de thèmes supprimé (site client final)
- [ ] Vrai domaine (`canonical`, `og:url`, `sitemap.xml`)
- [ ] Formulaire branché (Formspree ou autre)
- [ ] Photos réelles dans les sliders avant/après
- [ ] Carte Google Maps insérée
- [ ] Test mobile (menu burger, barre d'appel, widget booking)

---

## 🛠️ Notes techniques

- **Aucune dépendance** : tout fonctionne hors ligne (les polices Google sont un
  amélioration progressive — le site reste lisible sans réseau).
- **localStorage** : le thème mémorisé utilise `localStorage` avec repli silencieux
  si l'API est indisponible (navigation privée stricte).
- **`prefers-reduced-motion`** : toutes les animations sont désactivées pour les
  utilisateurs sensibles au mouvement.
- **Compatibilité** : navigateurs modernes (Chrome, Edge, Firefox, Safari).

## 📄 Licence

Voir `LICENSE.txt` — licence commerciale **usage personnel ou client unique** :
interdiction de revendre, redistribuer ou mettre en ligne le template comme template.
