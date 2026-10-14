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

Ambele formulare trimit la un webhook Make (adresa e în `src/config.ts` → `FORMS`). Scenariul este „Site titus-corlatean.ro — formulare (contact + newsletter)”, în folderul Titus din Make:

- **Contact:** mesajul pleacă pe e-mail la contact@titus-corlatean.ro, prin conexiunea Microsoft `titus1`. Butonul „Răspunde” scrie direct vizitatorului.
- **Newsletter:** abonatul (și cel care bifează „Vreau să primesc noutăți” pe pagina Contact) ajunge în data store-ul „Titus — abonați newsletter”, cu adresa de e-mail ca cheie, deci fără dubluri.

Câmpul ascuns `hp` prinde roboții: dacă e completat, scenariul ignoră trimiterea.

## Publicare pe GitHub Pages

Repository: [mariusdragoi-web/titus-corlatean](https://github.com/mariusdragoi-web/titus-corlatean). Fiecare push pe `main` construiește și publică automat site-ul (`.github/workflows/deploy.yml`, Settings → Pages → Source: GitHub Actions). Domeniul `www.titus-corlatean.ro` e setat în Settings → Pages.

DNS (la gazduire.net):

| Domeniu | Tip | Valoare |
| --- | --- | --- |
| `titus-corlatean.ro` | `A` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| `www.titus-corlatean.ro` | `CNAME` | `mariusdragoi-web.github.io` |

Înregistrările `MX`, `TXT` (Google, Microsoft 365, SPF) și cele pentru email nu se ating.

### Al doilea domeniu: tituscorlatean.ro

`tituscorlatean.ro` și `www.tituscorlatean.ro` redirecționează spre `www.titus-corlatean.ro`, păstrând calea. Redirecționarea e un mini-site separat: [mariusdragoi-web/tituscorlatean-redirect](https://github.com/mariusdragoi-web/tituscorlatean-redirect), cu aceleași înregistrări DNS (`A` spre cele 4 IP-uri GitHub, `CNAME www` spre `mariusdragoi-web.github.io`).

Pentru alt host (Netlify, Cloudflare Pages, Hostinger), se publică folderul `dist/` rezultat din `npm run build`.

## Foldere care nu intră în repository

`poze/`, `Branding/` și `_scrape/` (copia completă a site-ului vechi: HTML, texte și pozele la rezoluție originală) sunt excluse prin `.gitignore`. Rămân doar local, ca arhivă.
