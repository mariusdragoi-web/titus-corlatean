// Comportament comun pentru toate paginile: header, meniu, embed-uri, animații, formulare.

const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Dropdown „Carieră” — funcționează și la click/tastatură, nu doar la hover
document.querySelectorAll<HTMLButtonElement>('[data-drop]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
  });
  btn.parentElement?.addEventListener('mouseleave', () => btn.setAttribute('aria-expanded', 'false'));
});
document.addEventListener('click', (e) => {
  document.querySelectorAll<HTMLButtonElement>('[data-drop][aria-expanded="true"]').forEach((btn) => {
    if (!btn.parentElement?.contains(e.target as Node)) btn.setAttribute('aria-expanded', 'false');
  });
});

// Meniu mobil
const menu = document.querySelector<HTMLElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
const setMenu = (open: boolean) => {
  if (!menu) return;
  menu.hidden = !open;
  openBtn?.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  (open ? closeBtn : openBtn)?.focus();
};
openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (menu && !menu.hidden) setMenu(false);
  document.querySelectorAll('[data-drop]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
});

// Embed-uri Facebook/YouTube: se încarcă doar la click (fără cookie-uri terțe până atunci)
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.embed__btn');
  if (!btn) return;
  const box = btn.closest<HTMLElement>('.embed');
  const src = box?.dataset.src;
  if (!box || !src) return;
  const iframe = document.createElement('iframe');
  iframe.src = src.includes('youtube') ? src + (src.includes('?') ? '&' : '?') + 'autoplay=1' : src;
  iframe.title = 'Conținut video';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  box.classList.add('is-loaded');
  btn.replaceWith(iframe);
});

// Feed Facebook (Elfsight): scriptul se încarcă abia când secțiunea se apropie de ecran
const feed = document.querySelector<HTMLElement>('[data-elfsight]');
if (feed) {
  const load = () => {
    feed.innerHTML = `<div class="elfsight-app-${feed.dataset.elfsight}"></div>`;
    const s = document.createElement('script');
    s.src = 'https://static.elfsight.com/platform/platform.js';
    s.async = true;
    document.body.appendChild(s);
  };
  if ('IntersectionObserver' in window) {
    const fio = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { fio.disconnect(); load(); }
    }, { rootMargin: '800px 0px' });
    fio.observe(feed);
  } else load();
}

// ---------------- Mobil: text pliat, acordeoane, liste scurte ----------------
const mobile = window.matchMedia('(max-width: 760px)');

document.querySelectorAll<HTMLElement>('[data-clamp]').forEach((el) => {
  const label = el.dataset.clampLabel || 'Citește mai mult';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'more-btn';
  btn.textContent = label;
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const open = el.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Arată mai puțin' : label;
    if (!open) el.scrollIntoView({ block: 'nearest' });
  });
  el.after(btn);
  const check = () => {
    el.classList.remove('no-clamp');
    if (!mobile.matches || el.classList.contains('is-open')) return;
    // Textele doar puțin mai lungi decât zona pliată rămân întregi: nu merită un buton pentru 2–3 rânduri
    const fits = el.scrollHeight <= el.clientHeight * 1.6;
    el.classList.toggle('no-clamp', fits);
    btn.hidden = fits;
  };
  check();
  mobile.addEventListener('change', check);
  window.addEventListener('load', check);
});

document.querySelectorAll<HTMLElement>('.acc-item').forEach((item) => {
  const btn = item.querySelector<HTMLButtonElement>('.acc-btn');
  if (!btn) return;
  const sync = () => {
    if (mobile.matches) btn.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    else btn.removeAttribute('aria-expanded');
  };
  sync();
  mobile.addEventListener('change', sync);
  btn.addEventListener('click', () => {
    if (!mobile.matches) return;
    item.classList.toggle('is-open');
    sync();
  });
});

document.querySelectorAll<HTMLElement>('.m-more').forEach((list) => {
  const count = list.children.length;
  if (count <= 3) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'more-btn';
  btn.textContent = `Vezi toate (${count})`;
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('is-open');
    btn.textContent = open ? 'Arată mai puțin' : `Vezi toate (${count})`;
    if (!open) list.scrollIntoView({ block: 'nearest' });
  });
  list.after(btn);
});

// Cuprinsuri cu scroll propriu: estompare jos doar cât mai e ceva de derulat
document.querySelectorAll<HTMLElement>('[data-scroll-fade]').forEach((el) => {
  const sync = () => el.classList.toggle('has-more', el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  sync();
  el.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
});

// Prima pagină, desktop: când scroll-ul se oprește aproape de începutul unei secțiuni, o aliniem sub header.
// Prag mic, ca pagina să nu tragă niciodată înapoi la pașii obișnuiți de rotiță.
if (document.documentElement.classList.contains('snap')) {
  const desktop = window.matchMedia('(min-width: 761px)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll<HTMLElement>('main > section[id]:not(#acasa)')];
  const MAGNET = 72;
  const align = () => {
    if (!desktop.matches || calm.matches) return;
    const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    let best: number | null = null;
    for (const el of targets) {
      const d = el.getBoundingClientRect().top - line;
      if (Math.abs(d) > 2 && Math.abs(d) < MAGNET && (best === null || Math.abs(d) < Math.abs(best))) best = d;
    }
    if (best !== null) window.scrollBy({ top: best, behavior: 'smooth' });
  };
  if ('onscrollend' in window) window.addEventListener('scrollend', align);
  else {
    let t: number | undefined;
    window.addEventListener('scroll', () => { clearTimeout(t); t = window.setTimeout(align, 160); }, { passive: true });
  }
}

// Apariție la scroll
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// Cloudflare Turnstile (verificarea anti-robot a formularelor): scriptul se încarcă abia când un formular se apropie de ecran
type Turnstile = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  getResponse(id: string): string | undefined;
  reset(id: string): void;
};
const w = window as Window & { turnstile?: Turnstile; onTurnstile?: () => void };
let turnstileReady: Promise<Turnstile> | undefined;
const loadTurnstile = () =>
  (turnstileReady ??= new Promise<Turnstile>((resolve, reject) => {
    w.onTurnstile = () => (w.turnstile ? resolve(w.turnstile) : reject());
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstile';
    s.async = true;
    s.onerror = () => { turnstileReady = undefined; s.remove(); reject(); };
    document.head.appendChild(s);
  }));

// Formulare (webhook Make, vezi FORMS în config.ts)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const status = form.querySelector<HTMLElement>('.form-status');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const say = (msg: string, kind: 'ok' | 'error') => {
    if (!status) return;
    status.textContent = msg;
    status.className = `form-status is-${kind}`;
  };

  // Widget-ul Turnstile al formularului. Tokenul vine asincron; la trimitere îl așteptăm câteva secunde dacă nu e gata.
  const box = form.querySelector<HTMLElement>('[data-turnstile]');
  let widget: string | undefined;
  let mounted: Promise<void> | undefined;
  let onToken: ((token: string) => void) | undefined;
  const mount = () =>
    (mounted ??= loadTurnstile()
      .then((ts) => {
        widget = ts.render(box!, {
          sitekey: box!.dataset.turnstile,
          'response-field-name': 'ts',
          theme: box!.dataset.theme || 'auto',
          size: 'flexible',
          language: 'ro',
          appearance: 'interaction-only',
          callback: (token: string) => { onToken?.(token); onToken = undefined; },
        });
      })
      .catch(() => { mounted = undefined; }));
  const token = async () => {
    if (!box) return '';
    await mount();
    if (!widget || !w.turnstile) return '';
    const ready = w.turnstile.getResponse(widget);
    if (ready) return ready;
    return new Promise<string>((resolve) => {
      onToken = resolve;
      setTimeout(() => resolve(w.turnstile?.getResponse(widget!) || ''), 12000);
    });
  };
  if (box) {
    if ('IntersectionObserver' in window) {
      const tio = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { tio.disconnect(); mount(); }
      }, { rootMargin: '600px 0px' });
      tio.observe(form);
    }
    form.addEventListener('focusin', () => mount(), { once: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstBad: HTMLInputElement | HTMLTextAreaElement | null = null;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]').forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !EMAIL_RE.test(f.value.trim()));
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      say('Completează câmpurile marcate și verifică adresa de e-mail.', 'error');
      (firstBad as HTMLElement).focus();
      return;
    }

    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      say('Formularul nu este încă activ. Între timp, ne poți scrie la contact@titus-corlatean.ro.', 'error');
      return;
    }

    button?.setAttribute('disabled', '');
    try {
      const ts = await token();
      if (box && !ts) {
        say('Verificarea anti-robot nu s-a putut încărca. Reîncarcă pagina sau scrie-ne la contact@titus-corlatean.ro.', 'error');
        return;
      }
      // Trimis ca formular simplu (urlencoded), ca browserul să nu mai facă o cerere CORS preliminară
      const data = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
      data.set('formular', form.dataset.form || '');
      if (ts) data.set('ts', ts);
      const subscribed = data.get('abonare_newsletter') === 'da';
      const res = await fetch(endpoint, { method: 'POST', body: data });
      if (res.status === 403) {
        say('Verificarea anti-robot a eșuat. Reîncarcă pagina și încearcă din nou.', 'error');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      say((subscribed && form.dataset.successSubscribe) || form.dataset.success || 'Mesajul a fost trimis. Mulțumesc.', 'ok');
    } catch {
      say('Mesajul nu a putut fi trimis. Încearcă din nou peste câteva minute.', 'error');
    } finally {
      // Un token Turnstile se poate folosi o singură dată
      if (widget) w.turnstile?.reset(widget);
      button?.removeAttribute('disabled');
    }
  });

  form.querySelectorAll('[required]').forEach((f) =>
    f.addEventListener('input', () => f.removeAttribute('aria-invalid'))
  );
});
