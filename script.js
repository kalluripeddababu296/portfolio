// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Typed role line (only present on the home page) =====
const typeLineEl = document.getElementById('typeLine');
if (typeLineEl){
  const roles = [
    'AI / ML Engineer',
    'Full Stack Developer',
    'Freelance Problem Solver',
    'Generative AI Builder'
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];

    if (!deleting){
      charIndex++;
      typeLineEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typeLineEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }
  typeLoop();
}

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.section-head, .about-body, .skills-grid, .tech-strip, .projects-grid .project-card, .contact-grid'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// ===== Contact form — sends the message directly, no mail client redirect =====
// Uses FormSubmit's AJAX endpoint to deliver the email straight to the inbox.
// One-time setup: the first message sent to a new address triggers a
// confirmation email from FormSubmit that must be approved before delivery
// starts working automatically.
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const CONTACT_EMAIL = 'peddababukalluri@gmail.com';

if (contactForm){
  const submitBtn = document.getElementById('contactSubmit');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    submitBtn.disabled = true;
    formNote.textContent = 'Sending your message...';

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _template: 'table'
        })
      });

      if (!res.ok) throw new Error('Request failed');

      formNote.textContent = "Message sent — I'll get back to you soon.";
      contactForm.reset();
    } catch (err){
      formNote.textContent = `Couldn't send automatically — please email ${CONTACT_EMAIL} directly.`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
