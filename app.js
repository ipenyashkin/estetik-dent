(() => {
 const c=window.clinic, {esc,safeUrl,phone}=window.site;
 document.title=`${c.name} — стоматология · ${c.city} | Прототип`;
 document.querySelector('#hero-title').innerHTML=c.hero.title.map(esc).join('<br>');
 document.querySelector('.hero-description').textContent=c.hero.text;
 const hero=document.querySelector('#hero-photo'); hero.src=c.hero.image;hero.alt=c.hero.imageAlt;
 document.querySelector('#care-photo').src=c.careImage;
 document.querySelector('#strip-address').innerHTML=`${esc(c.city)}, ${esc(c.address)}<br><strong>${esc(c.entrance)}</strong>`;
 document.querySelector('#strip-hours').innerHTML=`${esc(c.hours)}<br><strong>Работаем без выходных</strong>`;
 const filterContainer=document.querySelector('.service-filters');
 filterContainer.innerHTML=c.filters.map(f=>`<button type="button" class="filter ${f.id==='all'?'active':''}" data-filter="${esc(f.id)}" aria-pressed="${f.id==='all'}">${esc(f.label)}</button>`).join('');
 const renderServices=id=>{const services=c.services.filter(s=>id==='all'||s.category===id);document.querySelector('.service-list').innerHTML=services.map(s=>`<a class="service-row" href="service.html?id=${encodeURIComponent(s.id)}"><div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></div><span class="service-more">Подробнее</span></a>`).join('');document.querySelector('#filter-status').textContent=`Направлений: ${services.length}`;};
 renderServices('all');
 filterContainer.addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;filterContainer.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});renderServices(button.dataset.filter)});
 document.querySelector('.principles').innerHTML=c.principles.map(p=>`<div class="principle"><span>${icon('check')}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></div>`).join('');
 document.querySelector('.profile-list').innerHTML=c.profiles.map(p=>`<a class="profile" href="service.html?id=${encodeURIComponent(p.service)}"><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><span class="profile-link">О направлении ${icon('northeast')}</span></a>`).join('');
 document.querySelector('.visit-steps').innerHTML=c.firstVisit.map((s,i)=>`<li><span class="step-number">0${i+1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('');
 document.querySelector('.faq-list').innerHTML=c.faq.map(f=>`<details><summary>${esc(f.q)}<span>${icon('plus')}</span></summary><p>${esc(f.a)}</p></details>`).join('');
 document.querySelector('.appointment-hours').textContent=c.hours;
 document.querySelector('#contacts-title').innerHTML='Рядом с вами.<br>'+esc(c.city)+'.';
 document.querySelector('.contact-address').textContent=`${c.city}, ${c.address}`;
 document.querySelector('.contact-entrance').textContent=c.entrance;
 document.querySelector('.contact-hours').textContent=c.hours;
 const mail=document.querySelector('.contact-email');mail.textContent=c.email;mail.href='mailto:'+c.email;
 document.querySelector('.route-link').href=safeUrl(c.mapUrl);
 document.querySelector('.map-link').href=safeUrl(c.mapUrl);
 document.querySelector('.map-address').textContent=c.address;
 // Remove the original clinic's embedded map when rebranding in the local editor.
 document.querySelector('.map-city').textContent=c.city;document.querySelector('.map-entrance').textContent=c.entrance;
 const form=document.querySelector('#booking-form'),success=document.querySelector('.booking-success');
 const service=document.querySelector('#booking-service');service.innerHTML='<option value="consultation">Пока не знаю — нужна консультация</option>'+c.services.map(s=>`<option value="${esc(s.id)}">${esc(s.title)}</option>`).join('');
 const requested=new URLSearchParams(location.search).get('service');if(c.services.some(s=>s.id===requested))service.value=requested;
 const now=new Date();let dates=[];
 for(let i=1;i<=2;i++){const date=new Date(now.getTime()+i*86400000);dates.push({value:date.toISOString().slice(0,10),label:date.toLocaleDateString('ru-RU',{day:'numeric',month:'short',timeZone:'Europe/Moscow'})});}
 document.querySelector('#date-options').innerHTML=dates.map((d,i)=>`<label><input type="radio" name="date" value="${d.value}" ${i===0?'checked':''}><span>${esc(d.label)}</span></label>`).join('')+'<label><input type="radio" name="date" value="any"><span>Другой день</span></label>';
 const nameInput=document.querySelector('#booking-name'),phoneInput=document.querySelector('#booking-phone'),consent=document.querySelector('#booking-consent');
 function error(input,id,text){input.setAttribute('aria-invalid',String(!!text));document.getElementById(id).textContent=text;}
 [nameInput,phoneInput].forEach(input=>input.addEventListener('input',()=>error(input,input===nameInput?'name-error':'phone-error','')));
 consent.addEventListener('change',()=>document.querySelector('#consent-error').textContent='');
 phoneInput.addEventListener('input',()=>{let digits=phoneInput.value.replace(/\D/g,'');if(digits.startsWith('8'))digits='7'+digits.slice(1);if(digits&&!digits.startsWith('7'))digits='7'+digits;digits=digits.slice(0,11);let out=digits?'+7':'';if(digits.length>1)out+=' ('+digits.slice(1,4);if(digits.length>=4)out+=')';if(digits.length>4)out+=' '+digits.slice(4,7);if(digits.length>7)out+='-'+digits.slice(7,9);if(digits.length>9)out+='-'+digits.slice(9,11);phoneInput.value=out;});
 form.addEventListener('submit',e=>{e.preventDefault();let invalid=[];if(nameInput.value.trim().length<2){error(nameInput,'name-error','Введите имя: минимум 2 символа.');invalid.push(nameInput)}if(phoneInput.value.replace(/\D/g,'').length!==11){error(phoneInput,'phone-error','Введите номер полностью: +7 и 10 цифр.');invalid.push(phoneInput)}if(!consent.checked){document.querySelector('#consent-error').textContent='Подтвердите, что понимаете демонстрационный режим.';invalid.push(consent)}if(invalid.length){invalid[0].focus();return;}const selected=service.options[service.selectedIndex].text;document.querySelector('#success-description').textContent=`${nameInput.value.trim()}, вы выбрали: ${selected.toLocaleLowerCase('ru-RU')}. В рабочей версии администратор согласует удобное время приёма.`;form.hidden=true;success.hidden=false;success.focus();form.reset();});
 document.querySelector('#reset-booking').addEventListener('click',()=>{success.hidden=true;form.hidden=false;nameInput.focus()});
 document.querySelector('.mobile-call').innerHTML=icon('phone')+'<span>Позвонить</span>';
 document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
})();
