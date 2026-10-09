// Date structurate (schema.org) despre Titus Corlățean, comune pentru toate paginile.
// Motoarele de căutare și LLM-urile le citesc ca fapte: cine e, ce funcții a avut și în ce perioadă.
// Toate datele de aici apar și în textul site-ului (FAQ, paginile de carieră). Modifică-le împreună.
import { SITE, SOCIAL, PROFILES } from '../config';

export const PERSON_ID = `${SITE.url}/#person`;

type Section = 'parlament' | 'coe' | 'mae' | 'guvern';

interface Position {
  role: string;
  org: string;
  orgType?: string;
  orgUrl?: string;
  start: string;
  end?: string;
  section: Section;
}

const SENAT = { org: 'Senatul României', orgType: 'GovernmentOrganization', orgUrl: 'https://www.senat.ro' };
const APCE = { org: 'Adunarea Parlamentară a Consiliului Europei', orgType: 'GovernmentOrganization', orgUrl: 'https://pace.coe.int' };
const GUVERN = { org: 'Guvernul României', orgType: 'GovernmentOrganization', orgUrl: 'https://gov.ro' };
const MAE = { org: 'Ministerul Afacerilor Externe', orgType: 'GovernmentOrganization', orgUrl: 'https://www.mae.ro' };

const POSITIONS: Position[] = [
  // Parlamentul României
  { role: 'Senator', ...SENAT, start: '2008-12', section: 'parlament' },
  { role: 'Președinte interimar al Senatului României', ...SENAT, start: '2020-02', end: '2020-04', section: 'parlament' },
  { role: 'Vicepreședinte al Biroului Permanent al Senatului', ...SENAT, start: '2019', end: '2020', section: 'parlament' },
  { role: 'Președinte al Comisiei pentru politică externă a Senatului', ...SENAT, start: '2008', end: '2012', section: 'parlament' },
  { role: 'Președinte al Comisiei pentru politică externă a Senatului', ...SENAT, start: '2020', section: 'parlament' },
  { role: 'Vicepreședinte al Comisiei speciale comune pentru aderarea României la OCDE', org: 'Parlamentul României', orgType: 'GovernmentOrganization', start: '2025', section: 'parlament' },
  { role: 'Președinte al Comisiei speciale comune pentru aderarea României la spațiul Schengen', org: 'Parlamentul României', orgType: 'GovernmentOrganization', start: '2008', end: '2016', section: 'parlament' },
  { role: 'Deputat de Brașov', org: 'Camera Deputaților', orgType: 'GovernmentOrganization', orgUrl: 'https://www.cdep.ro', start: '2004', end: '2007', section: 'parlament' },
  { role: 'Membru al Parlamentului European', org: 'Parlamentul European', orgType: 'GovernmentOrganization', orgUrl: 'https://www.europarl.europa.eu', start: '2007', end: '2008', section: 'parlament' },
  // Consiliul Europei
  { role: 'Membru al delegației României', ...APCE, start: '2009', end: '2012', section: 'coe' },
  { role: 'Membru al delegației României', ...APCE, start: '2017', section: 'coe' },
  { role: 'Vicepreședinte al Adunării Parlamentare a Consiliului Europei', ...APCE, start: '2017', end: '2019', section: 'coe' },
  { role: 'Președinte al Comisiei pentru alegerea judecătorilor la Curtea Europeană a Drepturilor Omului', ...APCE, start: '2022', end: '2024', section: 'coe' },
  { role: 'Raportor pentru tragerea la răspundere a Federației Ruse pentru războiul de agresiune împotriva Ucrainei', ...APCE, start: '2025', section: 'coe' },
  { role: 'Vicepreședinte al Grupului Socialiștilor, Democraților și Verzilor (SOC)', ...APCE, start: '2026', section: 'coe' },
  // Ministerul Afacerilor Externe
  { role: 'Ministrul Afacerilor Externe', ...MAE, start: '2012-08', end: '2014-11', section: 'mae' },
  // Guvern și începuturile carierei
  { role: 'Ministrul Justiției', org: 'Ministerul Justiției', orgType: 'GovernmentOrganization', orgUrl: 'https://www.just.ro', start: '2012-05', end: '2012-08', section: 'guvern' },
  { role: 'Secretar de stat, Departamentul pentru românii de pretutindeni', ...GUVERN, start: '2003-07', end: '2004-12', section: 'guvern' },
  { role: 'Consilier pentru politică externă al prim-ministrului', ...GUVERN, start: '2001-10', end: '2003-06', section: 'guvern' },
  { role: 'Co-agent al Guvernului României la Curtea Europeană a Drepturilor Omului', ...GUVERN, start: '1997-08', end: '2001-08', section: 'guvern' },
  { role: 'Diplomat', ...MAE, start: '1994', end: '2001', section: 'guvern' },
];

const role = (p: Position) => ({
  '@type': 'Role',
  roleName: p.role,
  startDate: p.start,
  ...(p.end ? { endDate: p.end } : {}),
  memberOf: { '@type': p.orgType ?? 'Organization', name: p.org, ...(p.orgUrl ? { url: p.orgUrl } : {}) },
});

/** Persoana, cu funcțiile din secțiunile cerute (implicit toate). */
export function personLd(sections?: Section[]) {
  const positions = sections ? POSITIONS.filter((p) => sections.includes(p.section)) : POSITIONS;
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    url: SITE.url,
    image: new URL('/images/portret-oficial-2.webp', SITE.url).href,
    jobTitle: 'Senator al României',
    description: 'Senator în Parlamentul României, jurist și diplomat de carieră. A fost ministru al Afacerilor Externe (2012–2014), ministru al Justiției (2012), deputat, europarlamentar și președinte interimar al Senatului (2020).',
    birthDate: '1968-01-11',
    birthPlace: { '@type': 'Place', name: 'Medgidia, județul Constanța, România' },
    nationality: { '@type': 'Country', name: 'România' },
    spouse: { '@type': 'Person', name: 'Mădălina Corlățean' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universitatea din București' },
      { '@type': 'EducationalOrganization', name: 'Colegiul Național de Apărare' },
    ],
    affiliation: [
      { '@type': 'PoliticalParty', name: 'Partidul Social Democrat' },
      { '@type': 'CollegeOrUniversity', name: 'Universitatea Națională de Apărare „Carol I”' },
    ],
    knowsAbout: ['Drept internațional public', 'Drepturile omului', 'Politică externă', 'Consiliul Europei', 'Aderarea României la OCDE', 'Diaspora românească'],
    memberOf: positions.map(role),
    email: `mailto:${SITE.email}`,
    sameAs: [SOCIAL.facebook, SOCIAL.tiktok, SOCIAL.x, ...PROFILES],
  };
}

/** Pagină despre o etapă a carierei: spune explicit că pagina e despre Titus Corlățean. */
export function profilePageLd(path: string, name: string, sections?: Section[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: new URL(path, SITE.url).href,
    name,
    inLanguage: 'ro-RO',
    about: { '@id': PERSON_ID },
    mainEntity: personLd(sections),
  };
}
