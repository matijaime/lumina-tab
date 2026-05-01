/* ============================================
   LUMINA — Advanced New Tab Logic
   ============================================ */

// CSP-safe math parser (no eval / new Function)
function safeEval(expr) {
  const tokens = expr.replace(/\s+/g, '').match(/[\d.]+|[+\-*/()]/g);
  if (!tokens) return null;
  let pos = 0;
  function peek() { return tokens[pos]; }
  function consume() { return tokens[pos++]; }
  function parseExpr() {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }
  function parseTerm() {
    let left = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parseFactor();
      if (op === '/' && right === 0) return null;
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }
  function parseFactor() {
    if (peek() === '(') {
      consume();
      const val = parseExpr();
      consume(); // ')'
      return val;
    }
    const n = parseFloat(consume());
    return isNaN(n) ? null : n;
  }
  try { return parseExpr(); } catch(e) { return null; }
}

(function () {
  'use strict';

  // ── Dom Elements ──
  const clockEl     = document.getElementById('clock');
  const dateEl      = document.getElementById('date');
  const greetingEl  = document.getElementById('greeting');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherTemp = document.getElementById('weatherTemp');
  const searchWrapper = document.getElementById('searchWrapper');
  const searchInput   = document.getElementById('searchInput');
  const searchResult  = document.getElementById('searchResult');
  const gearBtn       = document.getElementById('gear');
  
  // Settings Modals
  const settingsWrapper = document.getElementById('settingsWrapper');
  const closeSettingsBtn = document.getElementById('closeSettings');
  const settingsName = document.getElementById('settingsName');
  const settings24h = document.getElementById('settings24h');
  const settingsBlur = document.getElementById('settingsBlur');
  const settingsBg = document.getElementById('settingsBg');
  const resetBgBtn = document.getElementById('resetBgBtn');
  const bgStyleEl = document.getElementById('bg');
  const weatherFx = document.getElementById('weather-fx');

  // Dock Config
  const dockEl = document.getElementById('dock');
  const dockContext = document.getElementById('dockContext');
  const dockEditUrl = document.getElementById('dockEditUrl');
  const dockEditName = document.getElementById('dockEditName');
  const dockSaveBtn = document.getElementById('dockSaveBtn');
  const dockRemoveBtn = document.getElementById('dockRemoveBtn');
  
  let dockData = [];
  let editingDockIndex = -1;

  // ── Load Settings ──
  const storedName = localStorage.getItem('lum_name') || 'Matias';
  const is24h = localStorage.getItem('lum_24h') === 'true';
  const customBg = localStorage.getItem('lum_bg');
  const customBlur = localStorage.getItem('lum_blur') || '10';

  settingsName.value = storedName;
  settings24h.checked = is24h;
  settingsBlur.value = customBlur;
  
  // Set initial blur
  document.documentElement.style.setProperty('--blur-bg', `${customBlur}px`);

  if(customBg) {
    bgStyleEl.style.backgroundImage = `url(${customBg})`;
  }

  // ── Smooth load: preload bg, then reveal ──
  function revealPage() {
    if (!document.body.classList.contains('ready')) {
      document.body.classList.add('ready');
    }
  }

  // Preload background image, then reveal
  const bgSrc = customBg || 'fondo.jpg';
  const preload = new Image();
  preload.onload = revealPage;
  preload.onerror = revealPage; // reveal even if image fails
  preload.src = bgSrc;
  // Safety fallback — reveal after 800ms no matter what
  setTimeout(revealPage, 800);

  // ── Clock & Date ──
  const DAYS   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  function tick() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    
    // Greeting
    let greeting = '';
    if (h >= 5 && h < 12)       greeting = 'Buenos días';
    else if (h >= 12 && h < 18) greeting = 'Buenas tardes';
    else                        greeting = 'Buenas noches';
    
    greetingEl.textContent = `${greeting}, ${localStorage.getItem('lum_name') || 'Matias'}`;

    if(!settings24h.checked && h > 12) h -= 12;
    if(!settings24h.checked && h === 0) h = 12;

    clockEl.textContent = `${h}:${m}`;
    dateEl.textContent  = `${DAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;
  }
  
  function syncClock() {
    tick();
    const d = new Date();
    const msToNextMin = 60000 - (d.getSeconds() * 1000 + d.getMilliseconds());
    setTimeout(syncClock, msToNextMin);
  }
  syncClock();

  // ── Search (Spotlight) + Calculator & Bangs ──
  function openSearch() {
    searchWrapper.classList.add('active');
    setTimeout(() => searchInput.focus(), 80);
  }

  function closeSearch() {
    searchWrapper.classList.remove('active');
    searchInput.value = '';
    searchResult.classList.add('hidden');
    searchInput.blur();
  }

  gearBtn.addEventListener('click', () => settingsWrapper.classList.add('active'));

  // Modals Backdrop close
  searchWrapper.addEventListener('click', (e) => { if (e.target === searchWrapper) closeSearch(); });
  settingsWrapper.addEventListener('click', (e) => { if (e.target === settingsWrapper) settingsWrapper.classList.remove('active'); });

  // Key bindings
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); return;}
    if (e.key === 'Escape') {
      closeSearch();
      settingsWrapper.classList.remove('active');
      dockContext.classList.remove('active');
    }
    if (!searchWrapper.classList.contains('active') && !settingsWrapper.classList.contains('active') && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
      openSearch();
    }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if(query.match(/^[\d\s\+\-\*\/\(\)\.]+$/) && query.length > 2) {
      try {
        // CSP-safe math evaluator using recursive descent parser
        const res = safeEval(query);
        if(res !== null && !isNaN(res) && isFinite(res)) {
          searchResult.textContent = '= ' + res;
          searchResult.classList.remove('hidden');
          return;
        }
      } catch(e) {}
    }
    searchResult.classList.add('hidden');
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      let q = searchInput.value.trim();
      
      // Bangs
      if(q.startsWith('y ')) window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(q.slice(2))}`;
      else if(q.startsWith('g ')) window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q.slice(2))}`;
      else if(q.startsWith('x ')) window.location.href = `https://twitter.com/search?q=${encodeURIComponent(q.slice(2))}`;
      // Math Execute
      else if(!searchResult.classList.contains('hidden')) searchInput.value = searchResult.textContent.replace('= ','');
      // URL or normal search
      else if (/^(https?:\/\/|www\.)/.test(q) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(q)) window.location.href = q.startsWith('http') ? q : 'https://' + q;
      else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    }
  });

  // ── Settings Saving ──
  settingsBlur.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--blur-bg', `${e.target.value}px`);
  });

  closeSettingsBtn.addEventListener('click', () => {
    localStorage.setItem('lum_name', settingsName.value);
    localStorage.setItem('lum_24h', settings24h.checked);
    localStorage.setItem('lum_blur', settingsBlur.value);
    tick();
    settingsWrapper.classList.remove('active');
  });

  settingsBg.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target.result;
        try {
          localStorage.setItem('lum_bg', b64);
          bgStyleEl.style.backgroundImage = `url(${b64})`;
        } catch(e) { alert("El archivo es demasiado grande para guardarse en caché. Intenta con una imagen más pequeña/ligera."); }
      };
      reader.readAsDataURL(file);
    }
  });

  resetBgBtn.addEventListener('click', () => {
    localStorage.removeItem('lum_bg');
    location.reload(); 
  });

  // ── Dynamic Dock ──
  function loadDock() {
    const defaultDock = [
      { url: 'https://youtube.com', title: 'YouTube' },
      { url: 'https://instagram.com', title: 'Instagram' },
      { url: 'https://web.whatsapp.com', title: 'WhatsApp' },
      { url: 'https://gemini.google.com/app?hl=es_419', title: 'Gemini' },
      { url: 'https://twitter.com', title: 'X' },
      { url: 'https://github.com', title: 'GitHub' }
    ];
    dockData = JSON.parse(localStorage.getItem('lum_dock')) || defaultDock;
    renderDock();
  }

  function renderDock() {
    dockEl.innerHTML = '';
    dockData.forEach((item, idx) => {
      const a = document.createElement('a');
      a.href = item.url;
      a.className = 'dock-item';
      a.setAttribute('data-tip', item.title);
      // use basic google favicon resolver
      let domain = '';
      try { domain = new URL(item.url).hostname; } catch(e){}
      a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" alt="${item.title}">`;
      
      a.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openDockContext(e.clientX, e.clientY, idx);
      });
      dockEl.appendChild(a);
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
    dockEl.appendChild(addBtn);
    
    // Cache dock items for performance
    window._dockItemsCache = dockEl.querySelectorAll('.dock-item');
  }

  function openDockContext(x, y, idx) {
    editingDockIndex = idx;
    if(idx >= 0) {
      dockEditUrl.value = dockData[idx].url;
      dockEditName.value = dockData[idx].title;
      dockRemoveBtn.style.display = 'block';
    } else {
      dockEditUrl.value = 'https://';
      dockEditName.value = 'Nueva App';
      dockRemoveBtn.style.display = 'none';
    }
    dockContext.style.left = `${Math.min(x, window.innerWidth - 250)}px`;
    dockContext.style.top = `${y - 180}px`;
    dockContext.classList.add('active');
  }

  dockSaveBtn.addEventListener('click', () => {
    let u = dockEditUrl.value;
    if(!u.startsWith('http')) u = 'https://' + u;
    const item = { url: u, title: dockEditName.value };
    
    if(editingDockIndex >= 0) {
      dockData[editingDockIndex] = item;
    } else {
      dockData.push(item);
    }
    localStorage.setItem('lum_dock', JSON.stringify(dockData));
    dockContext.classList.remove('active');
    renderDock();
  });

  dockRemoveBtn.addEventListener('click', () => {
    dockData.splice(editingDockIndex, 1);
    localStorage.setItem('lum_dock', JSON.stringify(dockData));
    dockContext.classList.remove('active');
    renderDock();
  });

  document.addEventListener('click', (e) => {
    if(!dockContext.contains(e.target) && !e.target.closest('.dock-item')) dockContext.classList.remove('active');
  });

  loadDock();
  
  // Dock magnification (subtle) - Optimized with rAF
  let dockTicking = false;
  dockEl.addEventListener('mousemove', (e) => {
    if (!dockTicking) {
      window.requestAnimationFrame(() => {
        const clientX = e.clientX;
        if (window._dockItemsCache) {
          window._dockItemsCache.forEach(item => {
            const rect = item.getBoundingClientRect();
            const cx   = rect.left + rect.width / 2;
            const dist = Math.abs(clientX - cx);
            const max  = 100;
            if (dist < max) {
              const s = 1 + (1 - dist / max) * 0.2;
              const y = -(1 - dist / max) * 8;
              item.style.transform = `translateY(${y}px) scale(${s})`;
            } else {
              item.style.transform = '';
            }
          });
        }
        dockTicking = false;
      });
      dockTicking = true;
    }
  });

  dockEl.addEventListener('mouseleave', () => {
    if (window._dockItemsCache) {
      window._dockItemsCache.forEach(i => i.style.transform = '');
    }
  });

  // ── Google-style Top Bar ──
  const gmailLink = document.getElementById('gmailLink');
  const imagesLink = document.getElementById('imagesLink');
  const appsBtn = document.getElementById('appsBtn');
  const appsDropdown = document.getElementById('appsDropdown');
  const avatarBtn = document.getElementById('avatarBtn');
  const avatarDropdown = document.getElementById('avatarDropdown');
  const avatar = document.getElementById('avatar');
  const userEmail = document.getElementById('userEmail');
  const googleAccountLink = document.getElementById('googleAccountLink');
  const appItems = document.querySelectorAll('.app-item');

  // Google Apps URLs
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

  // Initialize top bar links
  gmailLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://mail.google.com' });
  });

  imagesLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://google.com/imghp' });
  });

  googleAccountLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://myaccount.google.com' });
  });

  // Apps grid click handlers
  appItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const app = item.getAttribute('data-app');
      if (googleApps[app]) {
        chrome.tabs.create({ url: googleApps[app] });
      }
      appsDropdown.classList.remove('active');
    });
  });

  // Dropdown toggles
  appsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    appsDropdown.classList.toggle('active');
    if (appsDropdown.classList.contains('active')) {
      avatarDropdown.classList.remove('active');
    }
  });

  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarDropdown.classList.toggle('active');
    if (avatarDropdown.classList.contains('active')) {
      appsDropdown.classList.remove('active');
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!appsDropdown.contains(e.target) && !appsBtn.contains(e.target)) {
      appsDropdown.classList.remove('active');
    }
    if (!avatarDropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
      avatarDropdown.classList.remove('active');
    }
  });

  // Get user profile info
  function initializeUserProfile() {
    chrome.identity.getProfileUserInfo({ accountStatus: 'SYNC' }, (userInfo) => {
      if (userInfo && userInfo.email) {
        userEmail.textContent = userInfo.email;
        // Display first letter of email
        const firstLetter = userInfo.email.charAt(0).toUpperCase();
        avatar.textContent = firstLetter;

        // Try to get profile photo using auth token
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (token && !chrome.runtime.lastError) {
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: 'Bearer ' + token }
            })
              .then(response => {
                if (!response.ok) throw new Error('API error');
                return response.json();
              })
              .then(data => {
                if (data.picture) {
                  avatar.style.backgroundImage = `url(${data.picture})`;
                  avatar.textContent = ''; // Remove letter if we have a photo
                }
              })
              .catch(err => {
                console.log('Photo fetch error:', err);
              });
          } else {
            console.log('Token error:', chrome.runtime.lastError);
          }
        });
      }
    });
  }

  // Initialize user profile on load
  initializeUserProfile();

  // ── Font Picker System ──
  const fontPickerWrapper = document.getElementById('fontPickerWrapper');
  const closeFontPicker = document.getElementById('closeFontPicker');
  const openFontPickerBtn = document.getElementById('openFontPicker');
  const clockPreview = document.getElementById('clockPreview');
  const greetingPreview = document.getElementById('greetingPreview');
  const clockFontsGrid = document.getElementById('clockFontsGrid');
  const greetingFontsGrid = document.getElementById('greetingFontsGrid');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const clockFonts = [
    'Oswald', 'Bebas Neue', 'Playfair Display', 'DM Serif Display',
    'Cormorant Garamond', 'Righteous', 'Abril Fatface', 'Josefin Sans',
    'Cinzel', 'Major Mono Display'
  ];

  const greetingFonts = [
    'Lora', 'Raleway', 'Nunito', 'Quicksand', 'Jost', 'Outfit',
    'DM Sans', 'Syne', 'Figtree', 'Plus Jakarta Sans'
  ];

  let selectedClockFont = localStorage.getItem('lum_font_clock') || 'Oswald';
  let selectedGreetingFont = localStorage.getItem('lum_font_greeting') || 'Raleway';

  // Apply fonts to DOM (fonts are loaded locally via fonts.css)
  function applyFonts() {
    document.documentElement.style.setProperty('--font-clock', `'${selectedClockFont}', sans-serif`);
    document.documentElement.style.setProperty('--font-greeting', `'${selectedGreetingFont}', sans-serif`);
    clockEl.style.fontFamily = `'${selectedClockFont}', sans-serif`;
    greetingEl.style.fontFamily = `'${selectedGreetingFont}', sans-serif`;
    dateEl.style.fontFamily = `'${selectedGreetingFont}', sans-serif`;
  }

  // Apply saved fonts on load
  applyFonts();

  // Render font cards
  function renderFontCards(fonts, gridElement, selectedFont, type) {
    gridElement.innerHTML = '';
    fonts.forEach(fontName => {
      const card = document.createElement('div');
      card.className = 'font-card';
      if (fontName === selectedFont) card.classList.add('selected');

      card.innerHTML = `
        <span class="font-card-name">${fontName}</span>
        <div class="font-card-preview" style="font-family: '${fontName}', sans-serif;">
          ${type === 'clock' ? '13:59' : 'Buenas'}
        </div>
      `;

      card.addEventListener('click', () => {
        selectFont(fontName, type, card, gridElement);
      });

      gridElement.appendChild(card);
    });
  }

  // Select font
  function selectFont(fontName, type, cardEl, gridElement) {
    // Remove previous selection
    gridElement.querySelectorAll('.font-card').forEach(c => c.classList.remove('selected'));

    // Add selection to clicked card
    cardEl.classList.add('selected');

    // Update preview
    if (type === 'clock') {
      clockPreview.style.fontFamily = `'${fontName}', sans-serif`;
      selectedClockFont = fontName;
    } else {
      greetingPreview.style.fontFamily = `'${fontName}', sans-serif`;
      selectedGreetingFont = fontName;
    }
  }

  // Open/Close font picker
  openFontPickerBtn.addEventListener('click', () => {
    fontPickerWrapper.classList.add('active');
    renderFontCards(clockFonts, clockFontsGrid, selectedClockFont, 'clock');
    renderFontCards(greetingFonts, greetingFontsGrid, selectedGreetingFont, 'greeting');
  });

  closeFontPicker.addEventListener('click', () => {
    fontPickerWrapper.classList.remove('active');
    // Save fonts
    localStorage.setItem('lum_font_clock', selectedClockFont);
    localStorage.setItem('lum_font_greeting', selectedGreetingFont);
    applyFonts();
  });

  // Close on backdrop click
  fontPickerWrapper.addEventListener('click', (e) => {
    if (e.target === fontPickerWrapper) {
      closeFontPicker.click();
    }
  });

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      // Update active button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active content
      tabContents.forEach(content => content.classList.remove('active'));
      if (tabName === 'clock') {
        document.getElementById('clockTab').classList.add('active');
      } else {
        document.getElementById('greetingTab').classList.add('active');
      }
    });
  });

  // ── Weather (wttr.in) & FX ──
  const WEATHER_EMOJIS = {
    '113':'☀️','116':'⛅','119':'☁️','122':'☁️','143':'🌫️','176':'🌧️','179':'🌨️','200':'⛈️','227':'🌨️','230':'❄️','248':'🌫️','263':'🌧️','266':'🌧️','293':'🌧️','296':'🌧️','299':'🌧️','302':'🌧️','305':'🌧️','308':'🌧️','353':'🌧️','356':'🌧️','359':'🌧️','386':'⛈️','389':'⛈️','392':'⛈️','395':'❄️'
  };

  async function fetchWeather() {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'fetch', url: 'https://wttr.in/?format=j1' });
      if (!res || !res.ok) throw new Error(res?.error || 'fetch failed');
      const d = res.data;
      const c = d.current_condition[0];
      weatherTemp.textContent = `${c.temp_C}°`;
      weatherIcon.textContent = WEATHER_EMOJIS[c.weatherCode] || '🌤️';
      localStorage.setItem('lum_w', JSON.stringify({ t: c.temp_C, c: c.weatherCode, ts: Date.now() }));
      applyWeatherFx(c.weatherCode);
    } catch {
      const saved = localStorage.getItem('lum_w');
      if (saved) {
        const d = JSON.parse(saved);
        weatherTemp.textContent = `${d.t}°`;
        weatherIcon.textContent = WEATHER_EMOJIS[d.c] || '🌤️';
        applyWeatherFx(d.c);
      }
    }
  }

  function applyWeatherFx(codeStr) {
    const c = parseInt(codeStr);
    weatherFx.innerHTML = ''; // clear previous
    // Sunny arrays (113)
    if(c === 113) {
      const h = new Date().getHours();
      // Stars for clear night
      if(h >= 19 || h <= 5) {
        for(let i=0; i<50; i++) {
          const star = document.createElement('div');
          star.className = 'star';
          star.style.left = `${Math.random() * 100}vw`;
          star.style.top = `${Math.random() * 70}vh`; // upper 70%
          star.style.animationDuration = `${2 + Math.random() * 3}s`;
          star.style.animationDelay = `${Math.random() * 2}s`;
          weatherFx.appendChild(star);
        }
      } else { // Sunbeams for clear day
        weatherFx.innerHTML = `<div class="sunbeam"></div>`;
      }
    }
    // Rain arrays (176,200,263+)
    else if([176,200,263,266,293,296,299,302,305,308,353,356,359,386,389].includes(c)) {
      for(let i=0; i<18; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        weatherFx.appendChild(drop);
      }
    }
  }

  const cached = localStorage.getItem('lum_w');
  if (cached) {
    const d = JSON.parse(cached);
    weatherTemp.textContent = `${d.t}°`;
    weatherIcon.textContent = WEATHER_EMOJIS[d.c] || '🌤️';
    applyWeatherFx(d.c);
    if (Date.now() - d.ts > 20 * 60000) fetchWeather();
  } else {
    fetchWeather();
  }
  setInterval(fetchWeather, 20 * 60000);

})();
