/* ============================================
   LUMINA — Optimized New Tab Logic
   ============================================ */

function safeEval(expr) {
  const tokens = expr.replace(/\s+/g, '').match(/[\d.]+|[+\-*/()]/g);
  if (!tokens) return null;
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];
  const parseExpr = () => {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  };
  const parseTerm = () => {
    let left = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parseFactor();
      if (op === '/' && right === 0) return null;
      left = op === '*' ? left * right : left / right;
    }
    return left;
  };
  const parseFactor = () => {
    if (peek() === '(') {
      consume();
      const val = parseExpr();
      consume();
      return val;
    }
    const n = parseFloat(consume());
    return isNaN(n) ? null : n;
  };
  try { return parseExpr(); } catch(e) { return null; }
}

(function () {
  'use strict';

  // ── Storage Manager (preserves data on updates) ──
  const store = {
    get: (key, def) => {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? val : def;
      } catch (e) { return def; }
    },
    set: (key, val) => {
      try { localStorage.setItem(key, val); } catch (e) {}
    },
    getJSON: (key, def) => {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : def;
      } catch (e) { return def; }
    },
    setJSON: (key, val) => {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }
  };

  // ── DOM Elements (consolidated) ──
  const el = {
    clock: document.getElementById('clock'),
    date: document.getElementById('date'),
    greeting: document.getElementById('greeting'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherTemp: document.getElementById('weatherTemp'),
    searchWrapper: document.getElementById('searchWrapper'),
    searchInput: document.getElementById('searchInput'),
    searchResult: document.getElementById('searchResult'),
    gear: document.getElementById('gear'),
    settingsWrapper: document.getElementById('settingsWrapper'),
    closeSettings: document.getElementById('closeSettings'),
    settingsName: document.getElementById('settingsName'),
    settings24h: document.getElementById('settings24h'),
    settingsBlur: document.getElementById('settingsBlur'),
    settingsBg: document.getElementById('settingsBg'),
    resetBgBtn: document.getElementById('resetBgBtn'),
    bg: document.getElementById('bg'),
    weatherFx: document.getElementById('weather-fx'),
    dock: document.getElementById('dock'),
    dockContext: document.getElementById('dockContext'),
    dockEditUrl: document.getElementById('dockEditUrl'),
    dockEditName: document.getElementById('dockEditName'),
    dockSaveBtn: document.getElementById('dockSaveBtn'),
    dockRemoveBtn: document.getElementById('dockRemoveBtn'),
    gmailLink: document.getElementById('gmailLink'),
    imagesLink: document.getElementById('imagesLink'),
    appsBtn: document.getElementById('appsBtn'),
    appsDropdown: document.getElementById('appsDropdown'),
    avatarBtn: document.getElementById('avatarBtn'),
    avatarDropdown: document.getElementById('avatarDropdown'),
    avatar: document.getElementById('avatar'),
    userEmail: document.getElementById('userEmail'),
    googleAccountLink: document.getElementById('googleAccountLink'),
    fontPickerWrapper: document.getElementById('fontPickerWrapper'),
    closeFontPicker: document.getElementById('closeFontPicker'),
    openFontPicker: document.getElementById('openFontPicker'),
    clockPreview: document.getElementById('clockPreview'),
    greetingPreview: document.getElementById('greetingPreview'),
    clockFontsGrid: document.getElementById('clockFontsGrid'),
    greetingFontsGrid: document.getElementById('greetingFontsGrid')
  };

  // ── Initialize Settings ──
  const settings = {
    name: store.get('lum_name', 'Matias'),
    is24h: store.get('lum_24h', 'false') === 'true',
    blur: store.get('lum_blur', '10'),
    bg: store.get('lum_bg', '')
  };

  el.settingsName.value = settings.name;
  el.settings24h.checked = settings.is24h;
  el.settingsBlur.value = settings.blur;
  document.documentElement.style.setProperty('--blur-bg', `${settings.blur}px`);
  if (settings.bg) el.bg.style.backgroundImage = `url(${settings.bg})`;

  // ── Page Load ──
  const bgSrc = settings.bg || 'fondo.jpg';
  const preload = new Image();
  preload.onload = preload.onerror = () => {
    if (!document.body.classList.contains('ready')) document.body.classList.add('ready');
  };
  preload.src = bgSrc;
  setTimeout(() => document.body.classList.add('ready'), 800);

  // ── Clock & Date ──
  const DAYS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');

    let greeting = '';
    if (h >= 5 && h < 12) greeting = 'Buenos días';
    else if (h >= 12 && h < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';

    el.greeting.textContent = `${greeting}, ${settings.name}`;
    if (!settings.is24h && h > 12) h -= 12;
    if (!settings.is24h && h === 0) h = 12;

    el.clock.textContent = `${h}:${m}`;
    el.date.textContent = `${DAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;
  }

  function syncClock() {
    updateClock();
    const d = new Date();
    const msToNextMin = 60000 - (d.getSeconds() * 1000 + d.getMilliseconds());
    setTimeout(syncClock, msToNextMin);
  }
  syncClock();

  // ── Search ──
  const toggleSearch = (show) => {
    if (show) {
      el.searchWrapper.classList.add('active');
      setTimeout(() => el.searchInput.focus(), 80);
    } else {
      el.searchWrapper.classList.remove('active');
      el.searchInput.value = '';
      el.searchResult.classList.add('hidden');
      el.searchInput.blur();
    }
  };

  el.gear.addEventListener('click', () => el.settingsWrapper.classList.add('active'));
  el.searchWrapper.addEventListener('click', (e) => {
    if (e.target === el.searchWrapper) toggleSearch(false);
  });
  el.settingsWrapper.addEventListener('click', (e) => {
    if (e.target === el.settingsWrapper) el.settingsWrapper.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearch(true);
      return;
    }
    if (e.key === 'Escape') {
      toggleSearch(false);
      el.settingsWrapper.classList.remove('active');
      el.dockContext.classList.remove('active');
      el.appsDropdown.classList.remove('active');
      el.avatarDropdown.classList.remove('active');
    }
    if (!el.searchWrapper.classList.contains('active') && !el.settingsWrapper.classList.contains('active') &&
        e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
      toggleSearch(true);
    }
  });

  el.searchInput.addEventListener('input', () => {
    const query = el.searchInput.value.trim();
    if(query.match(/^[\d\s\+\-\*\/\(\)\.]+$/) && query.length > 2) {
      const res = safeEval(query);
      if(res !== null && !isNaN(res) && isFinite(res)) {
        el.searchResult.textContent = '= ' + res;
        el.searchResult.classList.remove('hidden');
        return;
      }
    }
    el.searchResult.classList.add('hidden');
  });

  el.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && el.searchInput.value.trim()) {
      let q = el.searchInput.value.trim();
      if(q.startsWith('y ')) window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(q.slice(2))}`;
      else if(q.startsWith('g ')) window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q.slice(2))}`;
      else if(q.startsWith('x ')) window.location.href = `https://twitter.com/search?q=${encodeURIComponent(q.slice(2))}`;
      else if(!el.searchResult.classList.contains('hidden')) el.searchInput.value = el.searchResult.textContent.replace('= ','');
      else if (/^(https?:\/\/|www\.)/.test(q) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(q)) window.location.href = q.startsWith('http') ? q : 'https://' + q;
      else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    }
  });

  // ── Settings ──
  el.settingsBlur.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--blur-bg', `${e.target.value}px`);
  });

  el.closeSettings.addEventListener('click', () => {
    store.set('lum_name', el.settingsName.value);
    store.set('lum_24h', el.settings24h.checked);
    store.set('lum_blur', el.settingsBlur.value);
    settings.name = el.settingsName.value;
    settings.is24h = el.settings24h.checked;
    settings.blur = el.settingsBlur.value;
    updateClock();
    el.settingsWrapper.classList.remove('active');
  });

  el.settingsBg.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          store.set('lum_bg', ev.target.result);
          el.bg.style.backgroundImage = `url(${ev.target.result})`;
        } catch(e) {
          alert("El archivo es demasiado grande. Intenta con una imagen más pequeña.");
        }
      };
      reader.readAsDataURL(file);
    }
  });

  el.resetBgBtn.addEventListener('click', () => {
    store.set('lum_bg', '');
    location.reload();
  });

  // ── Dock ──
  let dockData = [];
  let editingDockIndex = -1;

  const defaultDock = [
    { url: 'https://youtube.com', title: 'YouTube' },
    { url: 'https://instagram.com', title: 'Instagram' },
    { url: 'https://web.whatsapp.com', title: 'WhatsApp' },
    { url: 'https://gemini.google.com/app?hl=es_419', title: 'Gemini' },
    { url: 'https://twitter.com', title: 'X' },
    { url: 'https://github.com', title: 'GitHub' }
  ];

  function loadDock() {
    dockData = store.getJSON('lum_dock', defaultDock);
    renderDock();
  }

  function renderDock() {
    el.dock.innerHTML = '';
    dockData.forEach((item, idx) => {
      const a = document.createElement('a');
      a.href = item.url;
      a.className = 'dock-item';
      a.setAttribute('data-tip', item.title);
      try { a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=64" alt="${item.title}">`; }
      catch(e) { a.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64" alt="${item.title}">`; }

      a.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openDockContext(e.clientX, e.clientY, idx);
      });
      el.dock.appendChild(a);
    });

    const addBtn = document.createElement('a');
    addBtn.className = 'dock-item dock-add-btn';
    addBtn.setAttribute('data-tip', 'Añadir Atajo');
    addBtn.style.cursor = 'pointer';
    addBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`;
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDockContext(e.clientX, e.clientY, -1);
    });
    el.dock.appendChild(addBtn);
  }

  function openDockContext(x, y, idx) {
    editingDockIndex = idx;
    if(idx >= 0) {
      el.dockEditUrl.value = dockData[idx].url;
      el.dockEditName.value = dockData[idx].title;
      el.dockRemoveBtn.style.display = 'block';
    } else {
      el.dockEditUrl.value = 'https://';
      el.dockEditName.value = 'Nueva App';
      el.dockRemoveBtn.style.display = 'none';
    }
    el.dockContext.style.left = `${Math.min(x, window.innerWidth - 250)}px`;
    el.dockContext.style.top = `${y - 180}px`;
    el.dockContext.classList.add('active');
  }

  el.dockSaveBtn.addEventListener('click', () => {
    let u = el.dockEditUrl.value;
    if(!u.startsWith('http')) u = 'https://' + u;
    const item = { url: u, title: el.dockEditName.value };
    if(editingDockIndex >= 0) dockData[editingDockIndex] = item;
    else dockData.push(item);
    store.setJSON('lum_dock', dockData);
    el.dockContext.classList.remove('active');
    renderDock();
  });

  el.dockRemoveBtn.addEventListener('click', () => {
    dockData.splice(editingDockIndex, 1);
    store.setJSON('lum_dock', dockData);
    el.dockContext.classList.remove('active');
    renderDock();
  });

  document.addEventListener('click', (e) => {
    if(!el.dockContext.contains(e.target) && !e.target.closest('.dock-item')) el.dockContext.classList.remove('active');
  });

  loadDock();

  // ── Dock Magnification ──
  let dockTicking = false;
  el.dock.addEventListener('mousemove', (e) => {
    if (!dockTicking) {
      window.requestAnimationFrame(() => {
        const items = el.dock.querySelectorAll('.dock-item:not(.dock-add-btn)');
        items.forEach(item => {
          const rect = item.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const dist = Math.abs(e.clientX - cx);
          if (dist < 100) {
            const s = 1 + (1 - dist / 100) * 0.2;
            const y = -(1 - dist / 100) * 8;
            item.style.transform = `translateY(${y}px) scale(${s})`;
          } else {
            item.style.transform = '';
          }
        });
        dockTicking = false;
      });
      dockTicking = true;
    }
  });

  el.dock.addEventListener('mouseleave', () => {
    el.dock.querySelectorAll('.dock-item').forEach(i => i.style.transform = '');
  });

  // ── Top Bar ──
  const googleApps = {
    drive: 'https://drive.google.com',
    maps: 'https://maps.google.com',
    youtube: 'https://youtube.com',
    calendar: 'https://calendar.google.com',
    meet: 'https://meet.google.com',
    docs: 'https://docs.google.com',
    sheets: 'https://sheets.google.com',
    slides: 'https://slides.google.com',
    photos: 'https://photos.google.com'
  };

  [el.gmailLink, el.imagesLink, el.googleAccountLink].forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link === el.gmailLink ? 'https://mail.google.com' :
                  link === el.imagesLink ? 'https://google.com/imghp' :
                  'https://myaccount.google.com';
      chrome.tabs.create({ url });
    });
  });

  document.querySelectorAll('.app-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const app = item.getAttribute('data-app');
      if (googleApps[app]) chrome.tabs.create({ url: googleApps[app] });
      el.appsDropdown.classList.remove('active');
    });
  });

  const toggleDropdown = (btn, dropdown, other) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
      if (dropdown.classList.contains('active')) other.classList.remove('active');
    });
  };

  toggleDropdown(el.appsBtn, el.appsDropdown, el.avatarDropdown);
  toggleDropdown(el.avatarBtn, el.avatarDropdown, el.appsDropdown);

  document.addEventListener('click', (e) => {
    if (!el.appsDropdown.contains(e.target) && !el.appsBtn.contains(e.target)) el.appsDropdown.classList.remove('active');
    if (!el.avatarDropdown.contains(e.target) && !el.avatarBtn.contains(e.target)) el.avatarDropdown.classList.remove('active');
  });

  function initUserProfile() {
    chrome.identity.getProfileUserInfo({ accountStatus: 'SYNC' }, (userInfo) => {
      if (userInfo && userInfo.email) {
        el.userEmail.textContent = userInfo.email;
        el.avatar.textContent = userInfo.email.charAt(0).toUpperCase();
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (token && !chrome.runtime.lastError) {
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: 'Bearer ' + token }
            })
              .then(r => r.ok ? r.json() : null)
              .then(data => {
                if (data?.picture) {
                  el.avatar.style.backgroundImage = `url(${data.picture})`;
                  el.avatar.textContent = '';
                }
              })
              .catch(() => {});
          }
        });
      }
    });
  }
  initUserProfile();

  // ── Fonts ──
  const clockFonts = ['Oswald', 'Bebas Neue', 'Playfair Display', 'DM Serif Display', 'Cormorant Garamond', 'Righteous', 'Abril Fatface', 'Josefin Sans', 'Cinzel', 'Major Mono Display'];
  const greetingFonts = ['Lora', 'Raleway', 'Nunito', 'Quicksand', 'Jost', 'Outfit', 'DM Sans', 'Syne', 'Figtree', 'Plus Jakarta Sans'];

  let selectedClockFont = store.get('lum_font_clock', 'Oswald');
  let selectedGreetingFont = store.get('lum_font_greeting', 'Raleway');

  function applyFonts() {
    document.documentElement.style.setProperty('--font-clock', `'${selectedClockFont}', sans-serif`);
    document.documentElement.style.setProperty('--font-greeting', `'${selectedGreetingFont}', sans-serif`);
    el.clock.style.fontFamily = `'${selectedClockFont}', sans-serif`;
    el.greeting.style.fontFamily = `'${selectedGreetingFont}', sans-serif`;
    el.date.style.fontFamily = `'${selectedGreetingFont}', sans-serif`;
  }
  applyFonts();

  function renderFontCards(fonts, gridElement, selectedFont, type) {
    gridElement.innerHTML = '';
    fonts.forEach(fontName => {
      const card = document.createElement('div');
      card.className = 'font-card' + (fontName === selectedFont ? ' selected' : '');
      card.innerHTML = `<span class="font-card-name">${fontName}</span><div class="font-card-preview" style="font-family: '${fontName}', sans-serif;">${type === 'clock' ? '13:59' : 'Buenas'}</div>`;
      card.addEventListener('click', () => selectFont(fontName, type, card, gridElement));
      gridElement.appendChild(card);
    });
  }

  function selectFont(fontName, type, cardEl, gridElement) {
    gridElement.querySelectorAll('.font-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');
    if (type === 'clock') {
      el.clockPreview.style.fontFamily = `'${fontName}', sans-serif`;
      selectedClockFont = fontName;
    } else {
      el.greetingPreview.style.fontFamily = `'${fontName}', sans-serif`;
      selectedGreetingFont = fontName;
    }
  }

  el.openFontPicker.addEventListener('click', () => {
    el.fontPickerWrapper.classList.add('active');
    renderFontCards(clockFonts, el.clockFontsGrid, selectedClockFont, 'clock');
    renderFontCards(greetingFonts, el.greetingFontsGrid, selectedGreetingFont, 'greeting');
  });

  el.closeFontPicker.addEventListener('click', () => {
    el.fontPickerWrapper.classList.remove('active');
    store.set('lum_font_clock', selectedClockFont);
    store.set('lum_font_greeting', selectedGreetingFont);
    applyFonts();
  });

  el.fontPickerWrapper.addEventListener('click', (e) => {
    if (e.target === el.fontPickerWrapper) el.closeFontPicker.click();
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabName = btn.getAttribute('data-tab');
      document.getElementById(tabName + 'Tab').classList.add('active');
    });
  });

  // ── Weather ──
  const WEATHER_EMOJIS = {'113':'☀️','116':'⛅','119':'☁️','122':'☁️','143':'🌫️','176':'🌧️','179':'🌨️','200':'⛈️','227':'🌨️','230':'❄️','248':'🌫️','263':'🌧️','266':'🌧️','293':'🌧️','296':'🌧️','299':'🌧️','302':'🌧️','305':'🌧️','308':'🌧️','353':'🌧️','356':'🌧️','359':'🌧️','386':'⛈️','389':'⛈️','392':'⛈️','395':'❄️'};

  async function fetchWeather() {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'fetch', url: 'https://wttr.in/?format=j1' });
      if (!res || !res.ok) throw new Error(res?.error || 'fetch failed');
      const c = res.data.current_condition[0];
      el.weatherTemp.textContent = `${c.temp_C}°`;
      el.weatherIcon.textContent = WEATHER_EMOJIS[c.weatherCode] || '🌤️';
      store.setJSON('lum_w', { t: c.temp_C, c: c.weatherCode, ts: Date.now() });
      applyWeatherFx(c.weatherCode);
    } catch {
      const saved = store.getJSON('lum_w', null);
      if (saved) {
        el.weatherTemp.textContent = `${saved.t}°`;
        el.weatherIcon.textContent = WEATHER_EMOJIS[saved.c] || '🌤️';
        applyWeatherFx(saved.c);
      }
    }
  }

  function applyWeatherFx(codeStr) {
    const c = parseInt(codeStr);
    el.weatherFx.innerHTML = '';
    if(c === 113) {
      const h = new Date().getHours();
      if(h >= 19 || h <= 5) {
        for(let i=0; i<50; i++) {
          const star = document.createElement('div');
          star.className = 'star';
          star.style.left = `${Math.random() * 100}vw`;
          star.style.top = `${Math.random() * 70}vh`;
          star.style.animationDuration = `${2 + Math.random() * 3}s`;
          star.style.animationDelay = `${Math.random() * 2}s`;
          el.weatherFx.appendChild(star);
        }
      } else {
        el.weatherFx.innerHTML = `<div class="sunbeam"></div>`;
      }
    } else if([176,200,263,266,293,296,299,302,305,308,353,356,359,386,389].includes(c)) {
      for(let i=0; i<18; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        el.weatherFx.appendChild(drop);
      }
    }
  }

  const cached = store.getJSON('lum_w', null);
  if (cached) {
    el.weatherTemp.textContent = `${cached.t}°`;
    el.weatherIcon.textContent = WEATHER_EMOJIS[cached.c] || '🌤️';
    applyWeatherFx(cached.c);
    if (Date.now() - cached.ts > 20 * 60000) fetchWeather();
  } else {
    fetchWeather();
  }
  setInterval(fetchWeather, 20 * 60000);

})();
