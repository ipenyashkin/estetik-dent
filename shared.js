(() => {
  const base = window.CLINIC_BASE;
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem('clinic-prototype-overrides') || '{}'); } catch {}
  const allowed = ['name','city','address','entrance','phone','extraPhone','email','hours','officialSite','mapUrl','reviewUrl'];
  const safe = Object.fromEntries(allowed.filter(k => typeof overrides[k] === 'string' && overrides[k].length < 250).map(k => [k,overrides[k]]));
  window.clinic = { ...base, ...safe, theme: {...base.theme, ...overrides.theme}, hero: {...base.hero, ...overrides.hero} };
  const c = window.clinic;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const safeUrl = s => { try { const u=new URL(s,location.href); return /^(https?:)$/.test(u.protocol) ? u.href : '#'; } catch {return '#';} };
  const phone = s => 'tel:' + String(s).replace(/[^+\d]/g,'');
  window.site = { esc, safeUrl, phone };
  const paths = {arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', northeast:'<path d="M6 18 18 6M6 6h12v12"/>',pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',phone:'<path d="m8 3-4 2c-3 5 10 18 15 15l2-4-5-3-2 2c-3-1-5-3-6-6l2-2-2-4Z"/>',check:'<path d="m5 12 4 4L19 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 11 3 3 5-5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'};
  window.icon = (name, cls='') => ['arrow','northeast','check','shield','plus'].includes(name) ? '' : `<svg class="icon ${cls}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.arrow}</svg>`;
  const mark = '<svg class="brand-mark" aria-hidden="true" viewBox="0 0 42 42" fill="none"><rect width="42" height="42" rx="12" fill="currentColor"/><path d="M11 17c0-4 5-5 10-1 5-4 10-3 10 1 0 7-5 13-10 13s-10-6-10-13Z" stroke="white" stroke-width="1.8"/><path d="M15 22c3 3 9 3 12 0" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const home = document.body.dataset.page === 'home';
  const anchor = id => (home?'':'index.html') + '#' + id;
  document.documentElement.style.setProperty('--forest', /^#[0-9a-f]{6}$/i.test(c.theme.primary) ? c.theme.primary : base.theme.primary);
  document.documentElement.style.setProperty('--sage', /^#[0-9a-f]{6}$/i.test(c.theme.surface) ? c.theme.surface : base.theme.surface);
  document.querySelectorAll('[data-header]').forEach(el => el.innerHTML = `
    <div class="utility"><div class="container utility-inner"><a href="${anchor('contacts')}">${icon('pin')} ${esc(c.city)}, ${esc(c.address)}</a><span>${icon('clock')} ${esc(c.hours)}</span><span class="utility-note">Для взрослых и детей</span></div></div>
    <div class="container nav-row"><a class="brand" href="index.html" aria-label="${esc(c.name)} — главная">${mark}<span>${esc(c.name)}<small>Стоматологическая клиника</small></span></a><nav aria-label="Основная навигация" id="main-nav"><a href="${anchor('services')}">Услуги</a><a href="${anchor('about')}">О клинике</a><a href="${anchor('specialists')}">Специалисты</a><a href="${anchor('first-visit')}">Первый визит</a><a href="${anchor('contacts')}">Контакты</a></nav><div class="nav-actions"><a class="nav-phone" href="${phone(c.phone)}">${esc(c.phone)}</a><a class="button compact" href="${anchor('appointment')}">Записаться ${icon('northeast')}</a><button class="menu-toggle" type="button" aria-label="Открыть меню" aria-controls="main-nav" aria-expanded="false">${icon('menu')}</button></div></div>`);
  document.querySelectorAll('[data-footer]').forEach(el => el.innerHTML = `
    <div class="container footer-main"><a class="brand footer-brand" href="index.html">${mark}<span>${esc(c.name)}<small>С заботой о вашей улыбке</small></span></a><div><p class="footer-label">Клиника</p><a href="${anchor('services')}">Направления лечения</a><a href="${anchor('about')}">О клинике</a><a href="${anchor('contacts')}">Как нас найти</a></div><div><p class="footer-label">Связаться</p><a href="${phone(c.phone)}">${esc(c.phone)}</a><a href="mailto:${esc(c.email)}">${esc(c.email)}</a><span>${esc(c.hours)}</span></div><div><p class="footer-label">Полезно знать</p><a href="${safeUrl(c.officialSite+'/about')}" target="_blank" rel="noopener">Официальная информация ${icon('northeast')}</a><button class="text-button" data-policy>О прототипе и персональных данных</button><a href="${safeUrl(c.reviewUrl)}" target="_blank" rel="noopener">Отзывы на Яндекс Картах ${icon('northeast')}</a></div></div>
    <div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${esc(c.name)}</span><span>Демонстрационный прототип · PENYASHKIN / STYLE</span><span>Фотографии носят иллюстративный характер</span></div>
    <div class="medical-notice">Имеются противопоказания. Необходима консультация специалиста.</div>`);
  document.querySelectorAll('[data-name]').forEach(el=>el.textContent=c.name);
  document.querySelectorAll('[data-phone]').forEach(el=>{el.textContent=c.phone;if(el.tagName==='A')el.href=phone(c.phone)});
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  const menu = document.querySelector('.menu-toggle');
  const closeMenu = ()=>{ menu?.setAttribute('aria-expanded','false');document.querySelector('header')?.classList.remove('menu-open') };
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('header').classList.toggle('menu-open',open)});
  document.querySelectorAll('#main-nav a').forEach(el=>el.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMenu()});
  const policy = document.createElement('dialog'); policy.className='policy-dialog';
  policy.innerHTML=`<button class="dialog-close" type="button" aria-label="Закрыть">${icon('close')}</button><h2>Это демонстрационный прототип</h2><p>Сайт показывает возможную новую версию сайта ${esc(c.name)}. Он создан студией PENYASHKIN / STYLE для обсуждения с клиникой.</p><p>Данные в форме не отправляются и не сохраняются. В этом прототипе нет аналитики, рекламных cookies и медицинских консультаций.</p><p>Для реальной записи свяжитесь с клиникой: <a href="${phone(c.phone)}">${esc(c.phone)}</a>.</p><p>Перед запуском рабочего сайта клиника утверждает содержание, документы, актуальный прайс и условия обработки персональных данных.</p><button class="button" data-close>Понятно</button>`;
  document.body.append(policy);
  document.querySelectorAll('[data-policy]').forEach(el=>el.addEventListener('click',()=>policy.showModal()));
  policy.querySelectorAll('[data-close],.dialog-close').forEach(el=>el.addEventListener('click',()=>policy.close()));
  policy.addEventListener('click',e=>{if(e.target===policy)policy.close()});
  const schema = {'@context':'https://schema.org','@type':'WebPage',name:c.name+' — демонстрационный прототип',description:'Демонстрационная концепция сайта стоматологии. Не официальный сайт клиники.',inLanguage:'ru'};
  const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify(schema);document.head.append(ld);
})();
