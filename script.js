/* ──────────────────────────────────────────
   1. NAVBAR
────────────────────────────────────────── */
const mainNav   = document.getElementById('mainNav');
const navLinks  = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

function toggleNav() {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
}

function closeNav() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (!mainNav.contains(e.target)) closeNav();
});

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const divisionPanels = document.querySelectorAll(".division-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetCategory = button.getAttribute("data-target");

      // 1. Ubah status tombol aktif
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 2. Filter divisi yang sesuai
      divisionPanels.forEach((panel) => {
        const panelCategory = panel.getAttribute("data-category");

        if (panelCategory === targetCategory) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });
});

/* ──────────────────────────────────────────
   2. SCROLL REVEAL
────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // hanya sekali
        }
    });
},{
    threshold:0.15
});

document.querySelectorAll(".reveal").forEach(el=>{
    revealObserver.observe(el);
});


/* ──────────────────────────────────────────
   3. STATS COUNTER ANIMATION
────────────────────────────────────────── */
const counterEls = document.querySelectorAll('.stat-number[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = 1800;
  const step     = Math.ceil(duration / target) || 1;
  let   current  = 0;

  el.textContent = prefix + '0' + suffix;

  const timer = setInterval(() => {
    current += Math.max(1, Math.round(target / 60));
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      } else {
        const el = entry.target;
        el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
      }
    });
  },
  { threshold: 0.5 }
);

counterEls.forEach((el) => counterObserver.observe(el));


/* ──────────────────────────────────────────
   4. NEWS SLIDER
────────────────────────────────────────── */
const newsCards = Array.from(document.querySelectorAll('#newsTrack .news-card'));
const dotsWrap  = document.getElementById('newsDots');
let   newsIdx   = 0;
let   newsAuto;

function buildDots() {
  newsCards.forEach((_, i) => {
    const dot     = document.createElement('div');
    dot.className = 'news-dot' + (i === 0 ? ' active' : '');
    dot.onclick   = () => goNews(i);
    dotsWrap.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('.news-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === newsIdx);
  });
}

function goNews(idx) {
  newsIdx = ((idx % newsCards.length) + newsCards.length) % newsCards.length;
  const prevIdx = (newsIdx - 1 + newsCards.length) % newsCards.length;
  const nextIdx = (newsIdx + 1) % newsCards.length;

  newsCards.forEach((card, i) => {
    card.className = 'news-card';
    if (i === newsIdx)      card.classList.add('active');
    else if (i === prevIdx) card.classList.add('prev');
    else if (i === nextIdx) card.classList.add('next');
  });
  updateDots();
}

function startNewsAuto() {
  newsAuto = setInterval(() => goNews(newsIdx + 1), 4000);
}

buildDots();
goNews(0);
startNewsAuto();

/* Drag / swipe */
const newsSlider = document.getElementById('newsSlider');
let   startX = 0, isDragging = false;

if (newsSlider) {
  newsSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX     = e.clientX;
    clearInterval(newsAuto);
  });
  newsSlider.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 50) goNews(newsIdx + (delta < 0 ? 1 : -1));
    startNewsAuto();
  });
  newsSlider.addEventListener('mouseleave', () => { isDragging = false; });

  newsSlider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(newsAuto);
  }, { passive: true });
  newsSlider.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) goNews(newsIdx + (delta < 0 ? 1 : -1));
    startNewsAuto();
  });
}


document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const divisionPanels = document.querySelectorAll(".division-panel");

  // Fungsi khusus untuk menggeser slider ke foto/kartu pertama tepat di tengah
  function centerFirstCard(panel) {
    const slider = panel.querySelector('.division-members');
    if (slider) {
      // Menggeser scroll kembali ke posisi awal (tengah)
      slider.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  // Posisikan foto ke tengah saat pertama kali web dibuka
  const activePanel = document.querySelector(".division-panel.active");
  if (activePanel) {
    setTimeout(() => centerFirstCard(activePanel), 100);
  }

  // Posisikan foto ke tengah setiap kali tombol tab divisi diklik
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetCategory = button.getAttribute("data-target");

      // 1. Ubah status tombol aktif
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 2. Filter divisi dan posisikan foto di tengah
      divisionPanels.forEach((panel) => {
        const panelCategory = panel.getAttribute("data-category");

        if (panelCategory === targetCategory) {
          panel.classList.add("active");
          // Beri sedikit delay agar animasi transisi panel selesai baru di-scroll ke tengah
          setTimeout(() => centerFirstCard(panel), 100);
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });
});


/* ──────────────────────────────────────────
   9. CONTACT FORM
────────────────────────────────────────── */
function sendMessage() {
  const name  = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const msg   = document.getElementById('formMsg').value.trim();

  if (!name || !email || !msg) {
    Swal.fire({
      icon               : 'warning',
      title              : 'Oops!',
      text               : 'Mohon lengkapi semua field.',
      confirmButtonColor : '#38bdf8',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon               : 'warning',
      title              : 'Email tidak valid',
      text               : 'Mohon masukkan format email yang benar.',
      confirmButtonColor : '#38bdf8',
    });
    return;
  }

  const templateParams = {
    from_name  : name,
    from_email : email,
    message    : msg,
  };

  Swal.fire({
    title             : 'Mengirim pesan...',
    allowOutsideClick : false,
    didOpen           : () => Swal.showLoading(),
  });

  emailjs
    .send(
      'web_iagi',
      'template_fxzq2n8',
      templateParams
    )
    .then(() => {
      Swal.fire({
        icon               : 'success',
        title              : 'Pesan Terkirim!',
        text               : `Terima kasih, ${name}. Kami akan segera merespons.`,
        confirmButtonColor : '#0f172a',
      });

      document.getElementById('formName').value  = '';
      document.getElementById('formEmail').value = '';
      document.getElementById('formMsg').value   = '';
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      Swal.fire({
        icon               : 'error',
        title              : 'Gagal Mengirim',
        text               : 'Terjadi kesalahan. Silakan coba lagi.',
        confirmButtonColor : '#38bdf8',
      });
    });
}

function openNewsModal(gambar, isiHTML, tagline) {
  const modal = document.getElementById('articleModal');
  const modalImg = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');
  const modalTagline = document.getElementById('modalTagline');

  if (gambar && gambar.trim() !== '') {
    modalImg.src = gambar;
    modalImg.style.display = 'block';
  } else {
    modalImg.style.display = 'none';
  }

  modalText.innerHTML = isiHTML;
  modalTagline.innerText = tagline || '';

  const currentURL = encodeURIComponent(window.location.href);
  document.getElementById('shareFB').href = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
  document.getElementById('shareTW').href = `https://twitter.com/intent/tweet?url=${currentURL}`;
  document.getElementById('shareWA').href = `https://api.whatsapp.com/send?text=${currentURL}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}