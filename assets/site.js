const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});

const codeEditor = document.querySelector('[data-code-editor]');
if (codeEditor) {
  const code = codeEditor.querySelector('[data-code-typewriter]');
  const replay = codeEditor.querySelector('[data-code-replay]');
  const position = codeEditor.querySelector('[data-code-position]');
  const source = code.textContent.trim();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  let hasStarted = false;

  const highlightedSource = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"[^"\n]*"/g, (match) => `<span class="token-string">${match}</span>`)
    .replace(/^class/, '<span class="token-keyword">class</span>');

  const updatePosition = (text) => {
    const lines = text.split('\n');
    position.textContent = `Ln ${lines.length}, Col ${lines.at(-1).length + 1}`;
  };

  const finish = () => {
    code.innerHTML = highlightedSource;
    updatePosition(source);
    codeEditor.classList.add('typing-complete');
  };

  const typeCode = () => {
    window.clearTimeout(timer);
    codeEditor.classList.remove('typing-complete');
    code.textContent = '';
    updatePosition('');

    if (reducedMotion) {
      finish();
      return;
    }

    let index = 0;
    const typeNext = () => {
      index += 1;
      const current = source.slice(0, index);
      code.textContent = current;
      updatePosition(current);

      if (index < source.length) {
        const character = source[index - 1];
        const delay = character === '\n' ? 145 : /[\[\]{},;]/.test(character) ? 78 : 31 + (index % 4) * 7;
        timer = window.setTimeout(typeNext, delay);
      } else {
        timer = window.setTimeout(finish, 180);
      }
    };

    timer = window.setTimeout(typeNext, 420);
  };

  code.textContent = reducedMotion ? source : '';
  replay.addEventListener('click', typeCode);

  if (reducedMotion) {
    finish();
  } else if ('IntersectionObserver' in window) {
    const codeObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !hasStarted) {
        hasStarted = true;
        typeCode();
        codeObserver.disconnect();
      }
    }, { threshold: 0.35 });
    codeObserver.observe(codeEditor);
  } else {
    hasStarted = true;
    typeCode();
  }
}

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01 });
  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('visible'));
}
