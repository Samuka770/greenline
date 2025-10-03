import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import '../styles/global.css';
import '../styles/footer-greenline.css';

function useNavEffects() {
  const location = useLocation();
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const barRef = useRef(null);
  const navWrapRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    const moveIndicator = (el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const parentRect = nav.getBoundingClientRect();
      const w = Math.max(24, rect.width * 0.6);
      const x = rect.left - parentRect.left + (rect.width - w) / 2;
      indicator.style.opacity = 1;
      indicator.style.width = `${w}px`;
      indicator.style.transform = `translateX(${x}px)`;
    };

    const links = Array.from(nav.querySelectorAll('.nav-link'));
    // active link based on location
    const active = links.find((a) => a.getAttribute('data-active') !== null) || links[0];
    moveIndicator(active);

    function onEnter(e) {
      moveIndicator(e.currentTarget);
    }
    function onMouseMove(e) {
      e.currentTarget.style.setProperty('--x', `${e.offsetX}px`);
      e.currentTarget.style.setProperty('--y', `${e.offsetY}px`);
    }

    links.forEach((link) => {
      link.addEventListener('mouseenter', onEnter);
      link.addEventListener('focus', onEnter);
      link.addEventListener('mousemove', onMouseMove);
    });
    const onResize = () => moveIndicator(active);
    window.addEventListener('resize', onResize);
    return () => {
      links.forEach((link) => {
        link.removeEventListener('mouseenter', onEnter);
        link.removeEventListener('focus', onEnter);
        link.removeEventListener('mousemove', onMouseMove);
      });
      window.removeEventListener('resize', onResize);
    };
  }, [location]);

  useEffect(() => {
    const bar = barRef.current;
    const navWrap = navWrapRef.current;
    if (!bar) return;
    let lastScrollY = window.scrollY;
    const deltaHide = 2;
    const deltaShow = 12;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        bar.classList.remove('hidden');
        bar.classList.remove('showing');
      } else {
        if (currentScrollY > lastScrollY + deltaHide && currentScrollY > 65) {
          bar.classList.add('hidden');
          bar.classList.remove('showing');
          navWrap?.classList.add('collapsed');
        } else if (currentScrollY < lastScrollY - deltaShow) {
          bar.classList.remove('hidden');
          bar.classList.add('showing');
          navWrap?.classList.remove('collapsed');
        }
      }
      if (currentScrollY > 8) bar.classList.add('scrolled');
      else bar.classList.remove('scrolled');
      if (!bar.classList.contains('hidden')) navWrap?.classList.remove('collapsed');
      lastScrollY = currentScrollY;
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setNavHeightVar = () => {
      const h = Math.round(bar.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--nav-h', `${h}px`);
    };
    window.addEventListener('load', setNavHeightVar);
    window.addEventListener('resize', setNavHeightVar);
    setNavHeightVar();
    return () => {
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('load', setNavHeightVar);
      window.removeEventListener('resize', setNavHeightVar);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      },
      { threshold: 0.1 }
    );
    const targets = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-fade, .stagger'
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location]);

  return { navRef, indicatorRef, barRef, navWrapRef };
}

export default function RootLayout() {
  const { navRef, indicatorRef, barRef, navWrapRef } = useNavEffects();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <div>
      <div className="nav-wrap" ref={navWrapRef}>
        <div className="navbar" id="navbar" ref={barRef}>
          <a className="brand" href="/">
            <img className="logo-nav" src="./src/img/logo-nav.png" alt="Logo Greenline" />
          </a>
          <nav className="desktop" id="deskNav" ref={navRef}>
            <NavLink className="nav-link" to="/" data-active={isActive('/') ? '' : null}>
              <span className="ink"></span>
              Início
            </NavLink>
            <NavLink
              className="nav-link"
              to="/projetos"
              data-active={isActive('/projetos') ? '' : null}
            >
              <span className="ink"></span>
              Projetos
            </NavLink>
            <NavLink
              className="nav-link"
              to="/credito-de-carbono"
              data-active={isActive('/credito-de-carbono') ? '' : null}
            >
              <span className="ink"></span>
              Crédito de Carbono
            </NavLink>
            <NavLink className="nav-link" to="/sobre" data-active={isActive('/sobre') ? '' : null}>
              <span className="ink"></span>
              Sobre
            </NavLink>
            <NavLink className="nav-link" to="/contato" data-active={isActive('/contato') ? '' : null}>
              <span className="ink"></span>
              Contato
            </NavLink>
            <div className="indicator" id="indicator" ref={indicatorRef} role="presentation" />
          </nav>
          <button
            className="hamb"
            id="hamb"
            aria-expanded="false"
            aria-controls="mobMenu"
            title="Menu"
            onClick={() => {
              const mob = document.getElementById('mobMenu');
              const btn = document.getElementById('hamb');
              const open = mob?.classList.toggle('open');
              if (btn) btn.setAttribute('aria-expanded', String(!!open));
            }}
          >
            ☰
          </button>
        </div>
        <div className="mobile" id="mobMenu">
          <nav>
            <NavLink className="nav-link" to="/" data-active={isActive('/') ? '' : null}>
              Início
            </NavLink>
            <a
              className="nav-link"
              href="https://www.greenlineadm.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Análises
            </a>
            <NavLink
              className="nav-link"
              to="/credito-de-carbono"
              data-active={isActive('/credito-de-carbono') ? '' : null}
            >
              Crédito de Carbono
            </NavLink>
            <NavLink className="nav-link" to="/sobre" data-active={isActive('/sobre') ? '' : null}>
              Sobre
            </NavLink>
            <NavLink className="nav-link" to="/contato" data-active={isActive('/contato') ? '' : null}>
              Contato
            </NavLink>
          </nav>
        </div>
      </div>

      <Outlet />

      <footer className="site-footer reveal" role="contentinfo">
        <nav className="footer-links" aria-label="Links do rodapé">
          <a href="/">Início</a>
          <a href="/credito-de-carbono">Crédito de Carbono</a>
          <a href="/sobre">Sobre</a>
          <a href="/contato">Contato</a>
        </nav>
        <div className="footer-copyright">© 2025 Greenline Associates</div>
      </footer>
    </div>
  );
}
