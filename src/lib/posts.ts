import raw from '../data/posts.json';

// Rezumatele preluate de pe site-ul vechi sunt tăiate uneori în mijlocul cuvântului: tăiem la ultimul cuvânt întreg și punem „…”
const tidySummary = (t: string) => {
  t = t.trim();
  if (!t || /[.!?…”"»)]$/.test(t)) return t;
  const cut = t.lastIndexOf(' ');
  return (cut > 40 ? t.slice(0, cut) : t).replace(/[,;:–-]+$/, '') + '…';
};

export interface Post {
  slug: string;
  title: string;
  date: string;
  image: string | null;
  description: string;
  summary: string;
  html: string;
}

export const posts: Post[] = (raw as Omit<Post, 'summary'>[] & { excerpt: string }[])
  .map((p: any) => ({
    ...p,
    title: p.title.trim(),
    summary: tidySummary(p.description || p.excerpt || ''),
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

const MONTHS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
