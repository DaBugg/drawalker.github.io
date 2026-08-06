const menuButton = document.querySelector('.mobile');
const navLinks = document.querySelectorAll('.links a');

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
  }));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(element => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .1 });
  reveals.forEach(element => revealObserver.observe(element));
}

const filterButtons = document.querySelectorAll('[data-filter]');
const menuBlocks = document.querySelectorAll('.menu-block[data-cat]');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('dark', item === button));
    const category = button.dataset.filter;
    menuBlocks.forEach(block => {
      block.hidden = category !== 'all' && block.dataset.cat !== category;
    });
  });
});

let cartTotal = 0;
const cartCounts = document.querySelectorAll('.cart-count');
document.querySelectorAll('.add-cart').forEach(button => {
  button.addEventListener('click', () => {
    cartTotal += 1;
    cartCounts.forEach(count => { count.textContent = String(cartTotal); });
    const original = button.textContent;
    button.textContent = 'Added';
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 900);
  });
});

document.querySelectorAll('.newsletter').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const button = form.querySelector('button');
    button.textContent = 'Joined';
    button.disabled = true;
  });
});
