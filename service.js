(() => {
 const c=window.clinic,{esc,phone}=window.site;
 const service=c.services.find(s=>s.id===new URLSearchParams(location.search).get('id'));
 const target=document.querySelector('#service-content');
 if(!service){document.title='Направление не найдено — '+c.name;target.innerHTML='<div class="missing-service"><h1>Выберите направление.</h1><p>Эта страница не найдена. Все услуги доступны на главной.</p><a href="index.html#services" class="button">К направлениям лечения '+icon('arrow')+'</a></div>';return;}
 document.title=`${service.title} — ${c.name} | Прототип`;
 document.querySelector('meta[name="description"]').content=service.description+' '+c.name+'. Демонстрационный прототип.';
 target.innerHTML=`<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a>${icon('arrow')}<a href="index.html#services">Услуги</a>${icon('arrow')}<span aria-current="page">${esc(service.title)}</span></nav>
 <section class="service-hero"><div><h1>${esc(service.title)}</h1><p class="service-lead">${esc(service.detail)}</p><a class="button" href="index.html?service=${encodeURIComponent(service.id)}#appointment">Записаться на консультацию ${icon('northeast')}</a></div><aside class="service-aside"><h3>Начните с разговора<br>со специалистом.</h3><p>Возможность лечения, его объём и стоимость определяются после осмотра. Актуальный прайс уточните в клинике.</p><a href="${phone(c.phone)}">${esc(c.phone)}</a></aside></section>
 <section class="service-body"><div><h2>Что можно обсудить<br>на приёме</h2><p>Расскажите о своей задаче и задайте вопросы. Врач поможет понять варианты и объяснит, какие шаги могут понадобиться именно вам.</p></div><ul>${service.items.map(i=>`<li>${icon('check')} ${esc(i)}</li>`).join('')}</ul></section>
 <section class="service-next"><div><h2>Не уверены, что выбрать?</h2><p>Администратор поможет сориентироваться и подобрать профиль специалиста.</p></div><a class="button" href="${phone(c.phone)}">Позвонить в клинику ${icon('phone')}</a></section>`;
})();
