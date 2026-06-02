/* 1. 頁面初始化與自訂滑鼠追蹤 */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const cursor = document.getElementById('cursor');
const cursorGlow = document.getElementById('cursorGlow');
const body = document.body;
let mx = 0, my = 0, gx = 0, gy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animGlow() {
  gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
  cursorGlow.style.left = gx + 'px'; cursorGlow.style.top = gy + 'px';
  requestAnimationFrame(animGlow);
})();

/* 2. 元素互動與解碼邏輯 */
function updateCursorListeners() {
  document.querySelectorAll('.game, .game-question, .ending-particle-mask').forEach(el => {
    el.addEventListener('mouseenter', function() {
      if (this.classList.contains('is-active')) return;
      body.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => body.classList.remove('hover-active')); 
  });
}
updateCursorListeners();

function decodeLine(id) {
  const wrapper = document.getElementById(id);
  if (wrapper) {
    wrapper.classList.add('decoded');
    body.classList.remove('hover-active'); 
  }
}

document.querySelectorAll('[data-parallax]').forEach(container => {
  container.addEventListener('click', function() {
    const img = this.querySelector('img'); if (img) img.classList.add('loaded');
    this.classList.add('is-active'); body.classList.remove('hover-active');
  });
});

/* 3. 下雪 */
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

const flakes = Array.from({ length: 35 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.2 + 0.8,
  d: Math.random() * 0.25 + 0.12
}));

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(180, 208, 224, 0.35)';
  ctx.beginPath();
  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i]; ctx.moveTo(f.x, f.y); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    f.y += f.d; f.x += Math.sin(f.y / 30) * 0.12;
    if (f.y > canvas.height) flakes[i] = { x: Math.random() * canvas.width, y: -10, r: f.r, d: f.d };
  }
  ctx.fill(); requestAnimationFrame(drawSnow);
}
drawSnow();

/* 4. 滾動淡入偵測 (IntersectionObserver) */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

/* 5. 開場文字時間軸與打字機動態 */
const introTimestamps = { 
  'line1': 500, 
  'line2-a': 2000, 'line2-b': 3500, 
  'line3-a': 5000, 'line3-b': 6500, 
  'line4-a': 8200, 'line4-b': 9600, 
  'line5': 14200, 
  'line6-a': 16000, 'line6-b': 17600, 'line6-c': 18800, 
  'scrollHint': 20000 
};

window.addEventListener('load', () => {
  Object.entries(introTimestamps).forEach(([id, delay]) => setTimeout(() => { const el = document.getElementById(id); if (el) el.classList.add('visible'); }, delay));
  
  const typewriterText = "還是我給你寫下的指令？"; 
  const typewriterEl = document.getElementById('line4-c');
  
  setTimeout(() => {
    typewriterEl.classList.add('typewriter-active'); 
    let index = 0;
    const typeTimer = setInterval(() => {
      if (index < 8) {
        typewriterEl.innerHTML = typewriterText.substring(0, index + 1);
      } else if (index === 8) {
        typewriterEl.classList.add('cursor-blue');
        typewriterEl.innerHTML = typewriterText.substring(0, 8) + `<span class="em-blue">${typewriterText.charAt(8)}</span>`;
      } else if (index === 9) {
        typewriterEl.innerHTML = typewriterText.substring(0, 8) + `<span class="em-blue">${typewriterText.substring(8, 10)}</span>`;
      } else {
        typewriterEl.classList.remove('cursor-blue');
        typewriterEl.innerHTML = typewriterText.substring(0, 8) + `<span class="em-blue">${typewriterText.substring(8, 10)}</span>` + typewriterText.charAt(10);
      }
      
      index++;
      if (index >= typewriterText.length) { 
        clearInterval(typeTimer); 
        setTimeout(() => typewriterEl.classList.remove('typewriter-active'), 1000); 
      }
    }, 150);
  }, 11500);
});
