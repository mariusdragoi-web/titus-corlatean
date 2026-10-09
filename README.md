# titus-corlatean.ro

Site-ul senatorului Titus Corlățean, mutat de pe Squarespace pe un site static construit cu [Astro](https://astro.build).
Identitatea vizuală respectă *Brand Guidelines* (Grundi SRL): roșu `#A61111`, alb, negru, Montserrat + Lato.

## Pornire locală

```bash
npm install
npm run dev
```

Site-ul rulează la http://localhost:4321.

## Structură

| Ce | Unde |
| --- | --- |
| Pagini | `src/pages/` (numele fișierului = adresa, ex. `povestea-mea.astro` → `/povestea-mea`) |
| Articole de blog | `src/data/posts.json` |
| Newsletter (septembrie 2025) | `src/data/newsletter.json` |
| Întrebări frecvente | `src/data/faq.json` |
| Meniu, linkuri sociale, formulare | `src/config.ts` |
| Culori, fonturi, stiluri comune | `src/styles/global.css` |
| Poze | `public/images/` (WebP optimizat) |

Adresele paginilor sunt identice cu cele de pe vechiul site Squarespace, deci linkurile din Google și de pe Facebook rămân valabile. `/acasa` redirecționează spre `/`.

## Formulare (contact și newsletter)

Formularele trimit prin [Formspree](https://formspree.io), serviciu gratuit pentru site-uri statice:

1. Creează două formulare în Formspree (Contact și Newsletter).
2. Copiază ID-ul fiecăruia (partea de după `/f/`) în `src/config.ts` → `FORMS`.

Până atunci, formularele afișează un mesaj că nu sunt încă active.

## Publicare pe GitHub Pages

1. Creează un repository pe GitHub și urcă proiectul (`git push` pe ramura `main`).
2. În repository: **Settings → Pages → Source: GitHub Actions**.
3. Fiecare push pe `main` construiește și publică automat site-ul (`.github/workflows/deploy.yml`).
4. Domeniul: fișierul `public/CNAME` conține `www.titus-corlatean.ro`. La registrar, setează un record `CNAME` pentru `www` către `<utilizator>.github.io` și record-urile `A` pentru domeniul fără `www` către IP-urile GitHub Pages (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153). Apoi bifează **Enforce HTTPS**.

Pentru alt host (Netlify, Cloudflare Pages, Hostinger), se publică folderul `dist/` rezultat din `npm run build`.

## Foldere care nu intră în repository

`poze/`, `Branding/` și `_scrape/` (copia completă a site-ului vechi: HTML, texte și pozele la rezoluție originală) sunt excluse prin `.gitignore`. Rămân doar local, ca arhivă.
