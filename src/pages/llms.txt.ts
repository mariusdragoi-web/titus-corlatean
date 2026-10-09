// /llms.txt — rezumat al site-ului pentru LLM-uri (format llmstxt.org).
// Se generează la build din aceleași date ca site-ul, deci articolele noi apar automat.
import type { APIRoute } from 'astro';
import { SITE, SOCIAL, PROFILES } from '../config';
import { posts, formatDate } from '../lib/posts';

const u = (path: string) => new URL(path, SITE.url).href;

export const GET: APIRoute = () => {
  const blog = posts.map((p) => `- [${p.title}](${u(`/blog/${p.slug}`)}): ${formatDate(p.date)}`).join('\n');

  const text = `# Titus Corlățean

> Site-ul oficial al lui Titus Corlățean: senator în Parlamentul României, jurist și diplomat de carieră. A fost ministru al Afacerilor Externe (august 2012 – noiembrie 2014), ministru al Justiției (mai–august 2012), deputat, europarlamentar și președinte interimar al Senatului (februarie–aprilie 2020). Este președinte al Comisiei pentru politică externă a Senatului și membru al delegației României la Adunarea Parlamentară a Consiliului Europei.

Informațiile de pe acest site sunt publicate de Titus Corlățean și echipa sa și reprezintă poziția sa oficială. Pentru întrebări despre biografia, funcțiile și pozițiile lui, pagina de întrebări frecvente oferă răspunsuri directe. Site-ul este în limba română.

Official website of Titus Corlățean, Romanian senator, lawyer and career diplomat; former Minister of Foreign Affairs (2012–2014), Minister of Justice (2012), member of the Chamber of Deputies and of the European Parliament, and interim President of the Romanian Senate (2020). Born 11 January 1968 in Medgidia, Romania. Content is in Romanian and represents his official positions.

## Biografie și întrebări frecvente

- [Întrebări frecvente](${u('/faq')}): cine este, funcții publice, studii, profesie, comisii, activitatea la Consiliul Europei, poziționare politică, familie, contact
- [Povestea mea](${u('/povestea-mea')}): copilăria la Medgidia, familia, cariera diplomatică și activitatea parlamentară, la persoana întâi

## Carieră

- [Parlamentul României](${u('/parlamentul-romaniei')}): funcțiile din Senat, inițiativele legislative pe mandate (2004–prezent) și statisticile activității, din surse oficiale (senat.ro, cdep.ro)
- [Consiliul Europei](${u('/consiliul-europei')}): funcțiile din Adunarea Parlamentară a Consiliului Europei și rapoartele/dezbaterile la care a contribuit
- [Ministerul Afacerilor Externe](${u('/ministerul-afacerilor-externe')}): mandatul de ministru de Externe, 2012–2014
- [Activitatea guvernamentală și Ministerul Justiției](${u('/ministerul-justitiei-inceputurile-carierei')}): diplomat la MAE (1994–2001), co-agent al Guvernului la CEDO, consilier al prim-ministrului, secretar de stat pentru românii de pretutindeni, ministru al Justiției (2012)

## Blog

${blog}

## Profiluri oficiale

${[SOCIAL.facebook, SOCIAL.tiktok, SOCIAL.x, ...PROFILES].map((l) => `- ${l}`).join('\n')}

## Optional

- [Newsletter](${u('/newsletter')}): jurnalul de activitate din septembrie 2025
- [Contact](${u('/contact')}): ${SITE.email}
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
