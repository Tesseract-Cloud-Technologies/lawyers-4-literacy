/* main.js */
(function() {
  'use strict';

  // --- Demo bar dismiss ---
  const demoBar = document.getElementById('demoBar');
  const dismissBtn = document.getElementById('dismissDemoBar');
  if (dismissBtn && demoBar) {
    if (localStorage.getItem('l4lDemoDismissed') === 'true') demoBar.style.display = 'none';
    dismissBtn.addEventListener('click', () => {
      demoBar.style.display = 'none';
      localStorage.setItem('l4lDemoDismissed', 'true');
    });
  }

  // --- Counters (count up when visible) ---
  const counters = document.querySelectorAll('.counter-value');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString();
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // --- Campaign donation progress (index page) ---
  const bar = document.getElementById('campaignBar');
  const amountRaisedEl = document.getElementById('amountRaised');
  const donationImpact = document.getElementById('donationImpact');
  const chips = document.querySelectorAll('.btn-chip');
  const pledgeModalEl = document.getElementById('pledgeModal');
  const pledgeModal = pledgeModalEl ? new bootstrap.Modal(pledgeModalEl) : null;
  const pledgeAmountInput = document.getElementById('pledgeAmount');
  const pledgeForm = document.getElementById('pledgeForm');
  const pledgeSuccess = document.getElementById('pledgeSuccess');
  const pledgeWhatsapp = document.getElementById('pledgeWhatsapp');

  const baseRaised = 12500;
  const goal = 50000;
  const booksPerK100 = 10;
  let currentRaised = baseRaised;

  function updateProgress(raised) {
    const pct = Math.min(100, (raised / goal) * 100);
    if (bar) bar.style.width = pct + '%';
    if (amountRaisedEl) amountRaisedEl.textContent = 'K' + raised.toLocaleString();
    if (bar) bar.parentElement.setAttribute('aria-valuenow', Math.round(pct));
  }

  if (bar) updateProgress(currentRaised);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const amount = chip.dataset.amount;
      if (amount === 'custom') {
        if (pledgeAmountInput) pledgeAmountInput.value = '';
        if (pledgeModal) pledgeModal.show();
        return;
      }
      const amt = parseInt(amount, 10);
      if (donationImpact) {
        const books = Math.round((amt / 100) * booksPerK100);
        donationImpact.textContent = `K${amt} funds ${books} books (sample ratio)`;
      }
      // Animate bar up by a sample pledge
      currentRaised = Math.min(goal, currentRaised + amt);
      updateProgress(currentRaised);
      if (pledgeAmountInput) pledgeAmountInput.value = 'K' + amt;
      if (pledgeModal) pledgeModal.show();
    });
  });

  if (pledgeForm) {
    pledgeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pledgeName')?.value || 'Friend';
      const email = document.getElementById('pledgeEmail')?.value || '';
      const amount = pledgeAmountInput?.value || 'K50';
      const text = `Hello Lawyers 4 Literacy! I'd like to pledge ${amount}. Name: ${name}. Email: ${email}. (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (pledgeWhatsapp) pledgeWhatsapp.href = url;
      pledgeForm.classList.add('d-none');
      if (pledgeSuccess) pledgeSuccess.classList.remove('d-none');
      pledgeForm.reset();
      // Reset after modal closes
      setTimeout(() => {
        pledgeForm.classList.remove('d-none');
        if (pledgeSuccess) pledgeSuccess.classList.add('d-none');
      }, 6000);
    });
  }

  // --- Inline pledge form (get-involved) ---
  const pledgeFormInline = document.getElementById('pledgeFormInline');
  const pledgeSuccessInline = document.getElementById('pledgeSuccessInline');
  const pledgeWhatsappInline = document.getElementById('pledgeWhatsappInline');
  if (pledgeFormInline) {
    pledgeFormInline.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pledgeNameInline')?.value || 'Friend';
      const email = document.getElementById('pledgeEmailInline')?.value || '';
      const amount = document.getElementById('pledgeAmountInline')?.value || '100';
      const text = `Hello Lawyers 4 Literacy! I'd like to pledge K${amount}. Name: ${name}. Email: ${email}. (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (pledgeWhatsappInline) pledgeWhatsappInline.href = url;
      pledgeFormInline.classList.add('d-none');
      if (pledgeSuccessInline) pledgeSuccessInline.classList.remove('d-none');
    });
  }

  // --- Contact form (contact.html) ---
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactWhatsapp = document.getElementById('contactWhatsapp');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      const name = document.getElementById('contactName')?.value || 'Friend';
      const email = document.getElementById('contactEmail')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const text = `Hello Lawyers 4 Literacy! My name is ${name}. Email: ${email}. Message: ${message} (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (contactWhatsapp) contactWhatsapp.href = url;
      contactForm.classList.add('d-none');
      if (contactSuccess) contactSuccess.classList.remove('d-none');
    });
  }

  // --- Scroll reveal for progress bar (fills on scroll) ---
  const progressEl = document.querySelector('.campaign-progress');
  if (progressEl && bar) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bar.style.width = Math.min(100, (currentRaised / goal) * 100) + '%';
        }
      });
    }, { threshold: 0.3 });
    barObserver.observe(progressEl);
  }

})();