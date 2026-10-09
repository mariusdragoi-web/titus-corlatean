// Setări globale ale site-ului. Modifică aici, nu în pagini.

export const SITE = {
  name: 'Titus Corlățean',
  titleSuffix: 'Senator Titus Corlățean',
  url: 'https://www.titus-corlatean.ro',
  email: 'contact@titus-corlatean.ro',
};

export const SOCIAL = {
  facebook: 'https://www.facebook.com/titus.corlatean.official/',
  tiktok: 'https://www.tiktok.com/@tituscorlatean',
  x: 'https://twitter.com/Tianu',
};

// Profiluri oficiale și enciclopedice. Merg doar în datele structurate pentru Google
// (prima pagină), nu se afișează pe site. Ajută Google să lege site-ul de persoană.
export const PROFILES = [
  'https://ro.wikipedia.org/wiki/Titus_Corl%C4%83%C8%9Bean',
  'https://en.wikipedia.org/wiki/Titus_Corl%C4%83%C8%9Bean',
  'https://www.wikidata.org/wiki/Q58167',
  'https://www.senat.ro/FisaSenator.aspx?ParlamentarID=7aebffad-47e6-4c7e-bdfb-34360e888703',
  'https://pace.coe.int/en/members/6456/corlatean',
  'https://www.juridice.ro/author/titus-corlatean',
];

// Formulare (Formspree, https://formspree.io). Creează câte un formular gratuit
// și pune aici ID-ul (partea de după /f/ din adresa formularului, ex. "xqazbcde").
// Cât timp sunt goale, formularele afișează un mesaj că nu sunt încă active.
export const FORMS = {
  contact: '',
  newsletter: '',
};

// Widget-ul Elfsight cu feed-ul paginii de Facebook (secțiunea „Activitate recentă” de pe prima pagină)
export const ELFSIGHT_FEED = '3bb0b266-ccaa-4e19-9c3d-ee6cc1e321ef';

export const NAV = [
  { label: 'Acasă', href: '/' },
  { label: 'Povestea mea', href: '/povestea-mea' },
  {
    label: 'Carieră',
    children: [
      { label: 'Parlamentul României', href: '/parlamentul-romaniei' },
      { label: 'Consiliul Europei', href: '/consiliul-europei' },
      { label: 'Ministerul Afacerilor Externe', href: '/ministerul-afacerilor-externe' },
      { label: 'Ministerul Justiției și începuturile carierei', href: '/ministerul-justitiei-inceputurile-carierei' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_LINKS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Politică de confidențialitate', href: '/politica-de-confidenialitate' },
];

export const CAREER = [
  { label: 'Parlamentul României', href: '/parlamentul-romaniei', image: '/images/parlamentul-romaniei.webp', pos: '55% 40%', years: 'Senator din 2008' },
  { label: 'Consiliul Europei', href: '/consiliul-europei', image: '/images/coe-plen-1.webp', pos: '64% 18%', years: '2009–2012, din 2017' },
  { label: 'Ministerul Afacerilor Externe', href: '/ministerul-afacerilor-externe', image: '/images/titus-onu.webp', pos: '50% 30%', years: '2012–2014' },
  { label: 'Ministerul Justiției și începuturile carierei', href: '/ministerul-justitiei-inceputurile-carierei', image: '/images/foto-scaun.webp', pos: '50% 15%', years: '1994–2012' },
];
