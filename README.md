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

Ambele formulare trimit la un webhook Make (adresa e în `src/config.ts` → `FORMS`). Scenariul este „Site titus-corlatean.ro — formulare v2 (Turnstile + confirmare abonare)”, în folderul Titus din Make:

- **Anti-robot:** fiecare formular are un widget [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) (cheia publică în `src/config.ts` → `TURNSTILE_SITEKEY`). Scenariul verifică tokenul la Cloudflare cu cheia secretă, care stă doar în modulul HTTP din Make; acceptă doar tokenuri rezolvate pe `titus-corlatean.ro` / `www.titus-corlatean.ro` (widget-ul e comun pentru mai multe domenii). Dacă verificarea pică, răspunde cu 403 și nu trimite nimic.
- **Contact:** mesajul pleacă pe e-mail la contact@titus-corlatean.ro, prin conexiunea Microsoft `titus1`. Butonul „Răspunde” scrie direct vizitatorului.
- **Newsletter (double opt-in):** cine bifează „Vreau să primesc noutăți” primește un e-mail cu un link spre `/confirmare-abonare?t=…`, valabil 48 de ore. Cererea stă în data store-ul „Titus — abonări neconfirmate”; abia după ce persoana apasă „Confirmă abonarea” adresa ajunge în „Titus — abonați newsletter”, cu e-mailul ca cheie, deci fără dubluri.

Câmpul ascuns `hp` prinde roboții simpli: dacă e completat, scenariul ignoră trimiterea.

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

## De făcut

### Când renunțăm la Make

Formularele depind în întregime de scenariul Make „formulare v2” (verificare Turnstile, e-mail la contact@, abonări). Înainte să închidem contul Make trebuie înlocuit. Varianta aleasă: **Microsoft Forms**.

1. Se creează în Forms (contul de pe titus-corlatean.ro) un formular cu Prenume, Nume, E-mail, Mesaj și bifa „Vreau să primesc noutăți și actualizări”.
2. Răspunsurile se strâng automat în Excel (OneDrive/SharePoint); notificarea pe e-mail se activează din setările formularului.
3. Pe site: formularele din `contact.astro` și `MessageSection.astro` se înlocuiesc cu formularul Forms încorporat; se scot Turnstile (`TURNSTILE_SITEKEY`, codul din `site.ts`), `FORMS` din `config.ts` și pagina `/confirmare-abonare`.
4. Se exportă înainte din Make data store-ul „Titus — abonați newsletter”, apoi se șterg scenariile, webhook-urile și data store-urile Titus din Make.

Compromis: formularul arată ca Microsoft Forms, nu ca restul site-ului, și dispare confirmarea abonării prin e-mail (nu mai facem newsletter, bifa rămâne doar o mențiune în Excel). Alternativa care păstrează designul: un serviciu de formulare (ex. Formspree), cu datele la ei.

### Securitate (din auditul din octombrie 2026)

- **SPF** (gazduire.net): `v=spf1 include:spf.protection.outlook.com ~all` în loc de `v=spf1 a mx ip4:185.165.184.2 ~all`. Acum mailurile reale trimise prin Microsoft 365 nu trec SPF.
- **DKIM**: activat în Microsoft 365 (Defender → Email authentication → DKIM) + cele două CNAME-uri `selector1` / `selector2` la gazduire.net.
- **DMARC**: după câteva zile fără probleme, `p=none` → `p=quarantine` → `p=reject`.
- **tituscorlatean.ro**: serverele DNS refuză interogările, deci redirecționarea nu funcționează; de refăcut zona, apoi `v=spf1 -all` și DMARC `p=reject`.
- **GitHub**: domeniile verificate la Pages (previne preluarea domeniului), branch protection pe `main`, 2FA pe cont.
