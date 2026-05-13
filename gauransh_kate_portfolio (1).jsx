import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #050608; --surface: #0d0f14; --surface2: #13161e;
    --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.12);
    --text: #eef0f5; --muted: #6b7280; --muted2: #9ca3af;
    --accent: #6ee7b7; --accent-dim: rgba(110,231,183,0.12); --accent-glow: rgba(110,231,183,0.25);
    --blue: #60a5fa; --blue-dim: rgba(96,165,250,0.1);
    --purple: #a78bfa; --purple-dim: rgba(167,139,250,0.1);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.7; overflow-x: hidden; cursor: none; }

  /* CURSOR */
  .cursor { position: fixed; width: 10px; height: 10px; background: var(--accent); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); transition: width .2s, height .2s; }
  .cursor-ring { position: fixed; width: 36px; height: 36px; border: 1px solid rgba(110,231,183,0.4); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%,-50%); transition: width .35s, height .35s cubic-bezier(.17,.67,.3,1.2); }
  .cursor-hover .cursor { width: 16px; height: 16px; }
  .cursor-hover .cursor-ring { width: 52px; height: 52px; border-color: rgba(110,231,183,0.6); }

  /* CANVAS */
  #bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .5; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1.25rem 5vw; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid transparent; transition: border-color .3s, background .3s; }
  nav.scrolled { background: rgba(5,6,8,0.9); backdrop-filter: blur(20px); border-color: var(--border); }
  .logo { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; letter-spacing: -.03em; color: var(--accent); text-decoration: none; cursor: pointer; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: .85rem; letter-spacing: .06em; text-transform: uppercase; transition: color .2s; cursor: pointer; }
  .nav-links a:hover { color: var(--text); }
  /* HERO TOP BAR */
  .hero-topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 99; display: flex; justify-content: flex-end; align-items: center; gap: 1.5rem; padding: 1.25rem 5vw; pointer-events: none; }
  .hero-topbar a { pointer-events: all; display: inline-flex; align-items: center; gap: .45rem; font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color .2s; }
  .hero-topbar a:hover { color: var(--accent); }
  .topbar-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); display: inline-block; animation: breathe 2.5s ease infinite; }

  /* HERO */
  .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 7rem 5vw 0; position: relative; z-index: 1; }

  /* HERO STATS ROW */
  .hero-stats { display: flex; gap: 2.5rem; margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px solid var(--border); animation: fadeUp .7s .8s ease both; flex-wrap: wrap; }
  .hstat { display: flex; flex-direction: column; gap: .25rem; }
  .hstat-val { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 700; color: var(--text); line-height: 1; }
  .hstat-val span { color: var(--accent); }
  .hstat-label { font-size: .72rem; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; }
  .hero-divider { width: 1px; background: var(--border); align-self: stretch; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: .6rem; color: var(--accent); font-size: .78rem; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 2rem; animation: fadeUp .7s .2s ease both; }
  .hero-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: breathe 2.5s ease infinite; flex-shrink: 0; }
  @keyframes breathe { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: .4; } }
  .headline { font-family: 'Syne', sans-serif; font-size: clamp(3.5rem,9vw,7.5rem); font-weight: 800; line-height: .95; letter-spacing: -.04em; animation: fadeUp .7s .35s ease both; }
  .headline .ghost { color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.2); }
  .headline .accent-txt { color: var(--accent); }
  .hero-sub { font-size: clamp(1rem,2vw,1.2rem); color: var(--muted2); font-weight: 300; max-width: 520px; margin: 2rem 0 3rem; animation: fadeUp .7s .5s ease both; line-height: 1.8; }
  .hero-sub strong { color: var(--text); font-weight: 500; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; animation: fadeUp .7s .65s ease both; }
  .btn-main { display: inline-flex; align-items: center; gap: .6rem; background: var(--accent); color: #050608; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 700; padding: .9rem 2.2rem; border-radius: .5rem; text-decoration: none; transition: transform .15s, box-shadow .15s; cursor: pointer; border: none; }
  .btn-main:hover { transform: translateY(-3px); box-shadow: 0 12px 40px var(--accent-glow); }
  .btn-outline { display: inline-flex; align-items: center; gap: .6rem; background: transparent; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 400; padding: .9rem 2.2rem; border-radius: .5rem; text-decoration: none; border: 1px solid var(--border2); transition: background .2s, border-color .2s; cursor: pointer; }
  .btn-outline:hover { background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.22); }
  .hero-scroll { position: absolute; bottom: 2.5rem; left: 5vw; display: flex; align-items: center; gap: .75rem; color: var(--muted); font-size: .78rem; letter-spacing: .1em; text-transform: uppercase; animation: fadeUp .7s 1s ease both; }
  .scroll-line { width: 50px; height: 1px; background: linear-gradient(90deg,var(--accent),transparent); }
  .hero-badge { position: absolute; bottom: 2.5rem; right: 5vw; text-align: right; animation: fadeUp .7s 1s ease both; }
  .badge-label { font-size: .7rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; display: block; }
  .badge-val { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--text); line-height: 1; display: block; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }

  /* MARQUEE */
  .marquee-section { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: .9rem 0; overflow: hidden; position: relative; z-index: 1; background: var(--surface); }
  .marquee-track { display: flex; gap: 3rem; white-space: nowrap; animation: marquee 22s linear infinite; }
  .marquee-item { display: inline-flex; align-items: center; gap: .6rem; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .msep { color: var(--accent); }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* SECTIONS */
  section { padding: 8rem 5vw; position: relative; z-index: 1; }
  .tag { font-size: .72rem; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: .75rem; display: flex; align-items: center; gap: .5rem; }
  .tag::before { content: ''; display: block; width: 24px; height: 1px; background: var(--accent); }
  .s-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4.5vw,3.5rem); font-weight: 700; letter-spacing: -.03em; line-height: 1.05; margin-bottom: 1rem; }
  .s-desc { color: var(--muted2); max-width: 500px; font-weight: 300; margin-bottom: 4rem; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 6rem; align-items: start; }
  .about-body { color: var(--muted2); font-weight: 300; line-height: 1.9; font-size: 1.05rem; }
  .about-body p+p { margin-top: 1.25rem; }
  .about-body strong { color: var(--text); font-weight: 500; }
  .about-numbers { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 3rem; }
  .num-card { padding: 1.5rem 1.75rem; background: var(--surface2); border: 1px solid var(--border); border-radius: .875rem; transition: border-color .2s; }
  .num-card:hover { border-color: rgba(110,231,183,.3); }
  .num-big { font-family: 'Syne', sans-serif; font-size: 2.6rem; font-weight: 700; color: var(--accent); line-height: 1; }
  .num-label { font-size: .82rem; color: var(--muted); margin-top: .4rem; }
  .about-right { display: flex; flex-direction: column; gap: .875rem; }
  .info-pill { display: flex; align-items: center; gap: 1rem; padding: 1.1rem 1.4rem; background: var(--surface2); border: 1px solid var(--border); border-radius: .875rem; transition: border-color .2s, transform .2s; }
  .info-pill:hover { border-color: var(--border2); transform: translateX(5px); }
  .pill-icon { width: 38px; height: 38px; border-radius: .6rem; background: var(--accent-dim); border: 1px solid rgba(110,231,183,.2); display: flex; align-items: center; justify-content: center; font-size: .95rem; flex-shrink: 0; }
  .pill-k { font-size: .7rem; color: var(--muted); letter-spacing: .06em; text-transform: uppercase; }
  .pill-v { font-size: .92rem; color: var(--text); margin-top: .15rem; }

  /* SKILLS */
  .skills-bg { background: var(--surface); }
  .skills-layout { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
  .skill-box { padding: 1.75rem; background: var(--bg); border: 1px solid var(--border); border-radius: 1rem; transition: border-color .25s, transform .25s; }
  .skill-box:hover { border-color: rgba(110,231,183,.25); transform: translateY(-4px); }
  .skill-head { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }
  .skill-icon { width: 36px; height: 36px; border-radius: .5rem; display: flex; align-items: center; justify-content: center; font-size: .95rem; }
  .si-g { background: var(--accent-dim); } .si-b { background: var(--blue-dim); } .si-p { background: var(--purple-dim); }
  .skill-cat { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--muted2); }
  .chips { display: flex; flex-wrap: wrap; gap: .5rem; }
  .chip { padding: .32rem .9rem; border-radius: 2rem; font-size: .8rem; border: 1px solid var(--border2); color: var(--muted2); transition: color .2s, border-color .2s, background .2s; }
  .chip:hover { color: var(--text); border-color: rgba(255,255,255,.2); }
  .chip.hl { border-color: rgba(110,231,183,.3); color: var(--accent); background: var(--accent-dim); }

  /* PROJECTS */
  .projects-wrap { display: grid; gap: 1.5rem; }
  .project-card { display: grid; grid-template-columns: 1fr 1fr; background: var(--surface2); border: 1px solid var(--border); border-radius: 1.25rem; overflow: hidden; transition: border-color .25s, transform .25s; }
  .project-card:hover { border-color: rgba(110,231,183,.3); transform: translateY(-5px); }
  .project-card.flip { direction: rtl; }
  .project-card.flip > * { direction: ltr; }
  .proj-visual { background: var(--surface); padding: 3rem; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; min-height: 320px; }
  .proj-code-bg { position: absolute; inset: 0; padding: 1.5rem; overflow: hidden; opacity: .15; font-family: monospace; font-size: .7rem; color: var(--accent); line-height: 1.6; word-break: break-all; pointer-events: none; white-space: pre-wrap; }
  .proj-num-big { font-family: 'Syne', sans-serif; font-size: 7rem; font-weight: 800; color: transparent; -webkit-text-stroke: 1px rgba(110,231,183,.15); line-height: 1; z-index: 1; position: relative; user-select: none; }
  .proj-tag-float { position: absolute; top: 1.5rem; left: 1.5rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(110,231,183,.2); padding: .3rem .8rem; border-radius: 2rem; }
  .proj-info { padding: 3rem; }
  .proj-name { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 700; letter-spacing: -.03em; color: var(--text); margin-bottom: .4rem; }
  .proj-subtitle { font-size: .82rem; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1.5rem; }
  .proj-desc { color: var(--muted2); font-weight: 300; line-height: 1.8; font-size: .95rem; margin-bottom: 2rem; }
  .proj-bullets { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 2rem; }
  .proj-bullet { display: flex; align-items: flex-start; gap: .75rem; font-size: .88rem; color: var(--muted2); }
  .bullet-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: .56rem; }
  .proj-stack { display: flex; flex-wrap: wrap; gap: .5rem; }
  .stack-chip { font-size: .78rem; padding: .28rem .8rem; border-radius: .35rem; background: var(--blue-dim); border: 1px solid rgba(96,165,250,.2); color: #93c5fd; }

  /* EDUCATION */
  .edu-split { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
  .edu-timeline { display: flex; flex-direction: column; gap: 1.25rem; }
  .edu-item { padding: 1.75rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 1rem; transition: border-color .2s; }
  .edu-item:hover { border-color: var(--border2); }
  .edu-year { font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: .6rem; }
  .edu-deg { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--text); margin-bottom: .3rem; }
  .edu-inst { font-size: .88rem; color: var(--muted); margin-bottom: .75rem; }
  .edu-grade { display: inline-flex; align-items: center; gap: .4rem; font-size: .78rem; background: var(--accent-dim); border: 1px solid rgba(110,231,183,.2); color: var(--accent); padding: .28rem .75rem; border-radius: 2rem; }
  .cert-list { display: flex; flex-direction: column; gap: 1.25rem; }
  .cert-item { display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 1rem; transition: border-color .2s, transform .2s; }
  .cert-item:hover { border-color: var(--border2); transform: translateX(6px); }
  .cert-badge { width: 52px; height: 52px; border-radius: .875rem; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
  .cb-gold { background: rgba(251,191,36,.1); border: 1px solid rgba(251,191,36,.2); }
  .cb-green { background: var(--accent-dim); border: 1px solid rgba(110,231,183,.2); }
  .cert-name { font-size: .95rem; font-weight: 500; color: var(--text); line-height: 1.3; }
  .cert-iss { font-size: .8rem; color: var(--muted); margin-top: .25rem; }

  /* CONTACT */
  .contact-bg { background: var(--surface); }
  .contact-inner { max-width: 700px; }
  .contact-headline { font-family: 'Syne', sans-serif; font-size: clamp(2.5rem,5vw,4.5rem); font-weight: 700; letter-spacing: -.04em; line-height: 1; margin: 1rem 0 1.5rem; }
  .contact-headline em { color: var(--accent); font-style: normal; }
  .contact-tagline { color: var(--muted2); font-weight: 300; font-size: 1.05rem; margin-bottom: 3rem; max-width: 480px; }
  .contact-rows { display: flex; flex-direction: column; gap: .875rem; max-width: 520px; }
  .contact-row { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; background: var(--bg); border: 1px solid var(--border); border-radius: .875rem; text-decoration: none; color: var(--text); transition: border-color .2s, transform .2s; }
  .contact-row:hover { border-color: rgba(110,231,183,.35); transform: translateX(6px); }
  .cr-icon { width: 42px; height: 42px; border-radius: .6rem; background: var(--accent-dim); border: 1px solid rgba(110,231,183,.2); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .cr-label { font-size: .7rem; color: var(--muted); letter-spacing: .07em; text-transform: uppercase; }
  .cr-val { font-size: .95rem; color: var(--text); margin-top: .15rem; }
  .cr-arrow { margin-left: auto; color: var(--muted); transition: transform .2s, color .2s; }
  .contact-row:hover .cr-arrow { transform: translateX(4px); color: var(--accent); }

  footer { padding: 2rem 5vw; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; z-index: 1; position: relative; }
  .footer-logo { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--accent); font-size: 1.1rem; }
  .footer-copy, .footer-role { font-size: .8rem; color: var(--muted); }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
  .reveal.in { opacity: 1; transform: none; }
  .d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; } .d3 { transition-delay: .3s; } .d4 { transition-delay: .4s; }

  .why-hire { padding: 1.75rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 1rem; }
  .why-hire-label { font-size: .75rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; margin-bottom: .75rem; }
  .why-hire-text { color: var(--muted2); font-size: .9rem; line-height: 1.85; font-weight: 300; }
  .why-hire-text strong { color: var(--text); }

  @media (max-width: 900px) {
    nav { padding: 1rem 5vw; }
    .nav-links, .nav-cta { display: none; }
    section { padding: 5rem 5vw; }
    .about-grid, .edu-split { grid-template-columns: 1fr; gap: 3rem; }
    .skills-layout { grid-template-columns: 1fr 1fr; }
    .project-card { grid-template-columns: 1fr; }
    .project-card.flip { direction: ltr; }
    footer { flex-direction: column; gap: .75rem; text-align: center; }
  }
  @media (max-width: 600px) { .skills-layout { grid-template-columns: 1fr; } }
`;

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    class Particle {
      constructor() { this.reset(); }
      reset() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .28; this.vy = (Math.random() - .5) * .28; this.r = Math.random() * 1.3 + .4; this.a = Math.random() * .45 + .08; }
      update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(); }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(110,231,183,${this.a})`; ctx.fill(); }
    }
    const pts = Array.from({ length: 85 }, () => new Particle());
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => { p.update(); p.draw(); });
      ctx.strokeStyle = "rgba(110,231,183,0.035)"; ctx.lineWidth = .6;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 115) { ctx.globalAlpha = (115 - d) / 115 * .18; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} id="bg-canvas" />;
}

function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, animId;
    const onMove = e => { mx = e.clientX; my = e.clientY; if (cursorRef.current) { cursorRef.current.style.left = mx + "px"; cursorRef.current.style.top = my + "px"; } };
    const lerp = () => { rx += (mx - rx) * .12; ry += (my - ry) * .12; if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; } animId = requestAnimationFrame(lerp); };
    document.addEventListener("mousemove", onMove);
    lerp();
    const els = document.querySelectorAll("a,button");
    const over = () => { document.body.classList.add("cursor-hover"); };
    const out = () => { document.body.classList.remove("cursor-hover"); };
    els.forEach(el => { el.addEventListener("mouseenter", over); el.addEventListener("mouseleave", out); });
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(animId); };
  }, []);
  return (<><div ref={cursorRef} className="cursor" /><div ref={ringRef} className="cursor-ring" /></>);
}

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useTypewriter(id, text, delay) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    let timer;
    const type = (d) => {
      timer = setTimeout(() => {
        let i = 0;
        const t = setInterval(() => {
          if (!el) { clearInterval(t); return; }
          el.textContent = text.slice(0, i++);
          if (i > text.length) { clearInterval(t); timer = setTimeout(() => type(0), 4000); }
        }, 22);
      }, d);
    };
    type(delay);
    return () => clearTimeout(timer);
  }, []);
}

const marqueeItems = ["Java","Spring Boot","REST APIs","React","PostgreSQL","AWS S3","Spring AI","Multithreading","OOP","Git","Agile / Scrum"];

const skills = [
  { icon: "☕", cls: "si-g", cat: "Languages", chips: [["Java Core",true],["Java 8",true],["SQL",true],["JavaScript",false]] },
  { icon: "⚙️", cls: "si-b", cat: "Backend", chips: [["Spring Boot",true],["REST APIs",true],["Spring AI",false],["JDBC",false],["AWS S3",false]] },
  { icon: "🖥️", cls: "si-p", cat: "Frontend", chips: [["React",true],["HTML5",false],["CSS3",false]] },
  { icon: "🗄️", cls: "si-b", cat: "Databases", chips: [["Oracle",true],["PostgreSQL",true]] },
  { icon: "🔧", cls: "si-g", cat: "Tools & Practices", chips: [["Git",true],["Agile / Scrum",false],["Debugging",false],["Performance Opt.",false]] },
  { icon: "🧠", cls: "si-p", cat: "Concepts", chips: [["OOP",true],["Multithreading",true],["Collections",false],["Memory Mgmt.",false]] },
];

const code1 = `@PostMapping("/upload")\npublic ResponseEntity<String> uploadDoc(\n  @RequestParam MultipartFile file,\n  @RequestParam PrintOptions opts) {\n  validateOptions(opts);\n  String url = s3Service.upload(file);\n  double cost = pricingService\n    .calculate(opts);\n  return ResponseEntity.ok(url);\n}`;
const code2 = `@RestController\n@RequestMapping("/api/transcribe")\npublic class TranscribeController {\n  @Autowired\n  private SpringAIService aiService;\n\n  @PostMapping\n  public ResponseEntity<String>\n  transcribe(@RequestParam\n  MultipartFile audio) {\n    String result =\n      aiService.transcribe(audio);\n    return ResponseEntity.ok(result);\n  }\n}`;

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  useReveal();
  useTypewriter("code1", code1, 1000);
  useTypewriter("code2", code2, 1800);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <style>{style}</style>
      <CustomCursor />
      <ParticleCanvas />

      <nav className={scrolled ? "scrolled" : ""}>
        <span className="logo" onClick={() => scrollTo("home")}>GK.</span>
        <ul className="nav-links">
          {["about","skills","projects","education","contact"].map(s => (
            <li key={s}><a onClick={() => scrollTo(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</a></li>
          ))}
        </ul>
      </nav>

      {/* TOPBAR — social links, right side */}
      <div className="hero-topbar">
        <span className="topbar-dot" />
        <a href="mailto:gauranshkate.it@gmail.com">✉ Email</a>
        <a href="https://github.com/gauranshkate" target="_blank" rel="noreferrer">↗ GitHub</a>
        <a href="https://linkedin.com/in/gauranshkate" target="_blank" rel="noreferrer">↗ LinkedIn</a>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-eyebrow"><span className="hero-dot" />Available for full-time roles &nbsp;·&nbsp; Hyderabad, IN</div>
        <h1 className="headline">
          <span style={{ display: "block" }}>Gauransh</span>
          <span className="ghost" style={{ display: "block" }}>Kate<span className="accent-txt">.</span></span>
        </h1>
        <p className="hero-sub">
          <strong>Java Full Stack Developer</strong> — crafting scalable backend systems<br />
          and clean, efficient software with Spring Boot, REST APIs &amp; React.
        </p>
        <div className="hero-actions">
          <button className="btn-main" onClick={() => scrollTo("projects")}>Explore Work →</button>
          <button className="btn-outline" onClick={() => scrollTo("contact")}>Let's Talk</button>
        </div>

        {/* STATS ROW — fills the empty space below CTA */}
        <div className="hero-stats">
          <div className="hstat"><div className="hstat-val">2<span>+</span></div><div className="hstat-label">Projects Shipped</div></div>
          <div className="hero-divider" />
          <div className="hstat"><div className="hstat-val">6<span>+</span></div><div className="hstat-label">Technologies</div></div>
          <div className="hero-divider" />
          <div className="hstat"><div className="hstat-val">2</div><div className="hstat-label">Certifications</div></div>
          <div className="hero-divider" />
          <div className="hstat"><div className="hstat-val">'25</div><div className="hstat-label">B.E. Graduate</div></div>
          <div className="hero-divider" />
          <div className="hstat"><div className="hstat-val" style={{fontSize:"1rem",color:"var(--accent)",fontFamily:"'DM Sans',sans-serif",fontWeight:400,letterSpacing:".01em",lineHeight:1.5}}>Open to<br/>opportunities</div><div className="hstat-label">Status</div></div>
        </div>

        <div className="hero-scroll"><div className="scroll-line" />Scroll to explore</div>
        <div className="hero-badge">
          <span className="badge-label">B.E. · IT · Pune</span>
          <span className="badge-val">2025</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">{item} <span className="msep">✦</span></span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="about-grid">
          <div>
            <div className="tag reveal">About me</div>
            <h2 className="s-title reveal d1">Building things<br />that <em style={{ color: "var(--accent)" }}>work</em>.</h2>
            <div className="about-body reveal d2">
              <p>I'm a <strong>Java Full Stack Developer</strong> based in Hyderabad, with a B.E. in Information Technology from Pune. I completed intensive training at Naresh IT — Core Java, Spring Boot, REST APIs, React — with deep focus on Java memory management, execution flow, and production-ready code.</p>
              <p>I believe great software lives at the intersection of <strong>clean architecture, performance awareness, and relentless debugging</strong>. I'm eager to join a team where I can grow fast and ship real impact.</p>
            </div>
            <div className="about-numbers reveal d3">
              {[["2","Full-stack projects"],["6+","Technologies mastered"],["2","Certifications"],["'25","B.E. Graduate"]].map(([n,l]) => (
                <div key={l} className="num-card"><div className="num-big">{n}</div><div className="num-label">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="about-right reveal d2">
            {[["📍","Location","Hyderabad, Telangana"],["🎓","Degree","B.E. Information Technology · 2025"],["🏫","College","SKNCOE, Pune · CGPA 6.97"],["💻","Training","Java Full Stack · Naresh IT, Hyderabad"],["✉️","Email","gauranshkate.it@gmail.com"],["📱","Phone","+91 88153 83700"],["🔍","Status","Open to full-time opportunities"]].map(([icon, k, v]) => (
              <div key={k} className="info-pill">
                <div className="pill-icon">{icon}</div>
                <div>
                  <div className="pill-k">{k}</div>
                  <div className="pill-v" style={k === "Status" ? { color: "var(--accent)" } : {}}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="skills-bg">
        <div className="tag reveal">Skills</div>
        <h2 className="s-title reveal d1">Tech Stack</h2>
        <p className="s-desc reveal d2">Everything I work with — from backend APIs to frontend interfaces.</p>
        <div className="skills-layout">
          {skills.map((s, i) => (
            <div key={s.cat} className={`skill-box reveal d${i % 4}`}>
              <div className="skill-head">
                <div className={`skill-icon ${s.cls}`}>{s.icon}</div>
                <div className="skill-cat">{s.cat}</div>
              </div>
              <div className="chips">
                {s.chips.map(([name, hl]) => (
                  <span key={name} className={`chip${hl ? " hl" : ""}`}>{name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="tag reveal">Work</div>
        <h2 className="s-title reveal d1">Featured Projects</h2>
        <p className="s-desc reveal d2">Full-stack applications built from scratch with real-world requirements.</p>
        <div className="projects-wrap">
          {/* Project 1 */}
          <div className="project-card reveal">
            <div className="proj-visual">
              <pre className="proj-code-bg" id="code1" />
              <div className="proj-num-big">01</div>
              <div className="proj-tag-float">Full Stack · Cloud</div>
            </div>
            <div className="proj-info">
              <div className="proj-name">Redink</div>
              <div className="proj-subtitle">Document Printing &amp; Delivery App</div>
              <p className="proj-desc">A complete document management platform that digitises print-on-demand workflows — from file upload to delivery coordination — with smart pricing logic and admin controls.</p>
              <div className="proj-bullets">
                {["Dynamic cost calculator (color, sides, punch) with backend validations eliminating pricing errors","Secure AWS S3 file upload flow with signed URLs and admin dashboard cutting coordination delays","Clean REST API architecture with Spring Boot for scalable, maintainable backend code"].map(b => (
                  <div key={b} className="proj-bullet"><div className="bullet-dot" /><span>{b}</span></div>
                ))}
              </div>
              <div className="proj-stack">
                {["Java","Spring Boot","SQL","AWS S3","REST API"].map(t => <span key={t} className="stack-chip">{t}</span>)}
              </div>
            </div>
          </div>
          {/* Project 2 */}
          <div className="project-card flip reveal d1">
            <div className="proj-visual">
              <pre className="proj-code-bg" id="code2" />
              <div className="proj-num-big">02</div>
              <div className="proj-tag-float">AI · Speech Tech</div>
            </div>
            <div className="proj-info">
              <div className="proj-name">AI Transcriber</div>
              <div className="proj-subtitle">Speech-to-Text Platform</div>
              <p className="proj-desc">An intelligent audio transcription service that converts spoken audio to accurate text, backed by Spring AI with a responsive upload interface and clean REST endpoints.</p>
              <div className="proj-bullets">
                {["Audio transcription service via Spring AI and REST APIs achieving high accuracy on diverse inputs","Responsive UI for audio upload and live transcript display with improved usability flow","Modular backend enabling easy swapping of AI transcription providers"].map(b => (
                  <div key={b} className="proj-bullet"><div className="bullet-dot" /><span>{b}</span></div>
                ))}
              </div>
              <div className="proj-stack">
                {["Java","Spring Boot","Spring AI","SQL","REST API"].map(t => <span key={t} className="stack-chip">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <div className="tag reveal">Background</div>
        <h2 className="s-title reveal d1">Education &amp; Certifications</h2>
        <div className="edu-split">
          <div className="edu-timeline reveal d1">
            {[
              { years: "2021 – 2025", deg: "B.E. in Information Technology", inst: "Smt. Kashibai Navale College of Engineering, Pune", grade: "🎓 CGPA 6.97 / 10" },
              { years: "2020", deg: "Higher Secondary (12th)", inst: "St. Xavier's International School, Burhanpur (M.P.)", grade: "📊 76.4%" },
              { years: "Sep – Nov 2025", deg: "Java Full Stack Developer Training", inst: "Naresh IT, Hyderabad", grade: "✅ Core Java · Spring Boot · React · REST APIs" },
            ].map(e => (
              <div key={e.years} className="edu-item">
                <div className="edu-year">{e.years}</div>
                <div className="edu-deg">{e.deg}</div>
                <div className="edu-inst">{e.inst}</div>
                <span className="edu-grade">{e.grade}</span>
              </div>
            ))}
          </div>
          <div className="cert-list reveal d2">
            {[
              { badge: "🏆", cls: "cb-gold", name: "Java Full Stack Development Certification", iss: "Naresh IT, Hyderabad · 2025" },
              { badge: "✅", cls: "cb-green", name: "Java Programming Certification", iss: "HackerRank · 2025" },
            ].map(c => (
              <div key={c.name} className="cert-item">
                <div className={`cert-badge ${c.cls}`}>{c.badge}</div>
                <div>
                  <div className="cert-name">{c.name}</div>
                  <div className="cert-iss">{c.iss}</div>
                </div>
              </div>
            ))}
            <div className="why-hire">
              <div className="why-hire-label">Why hire me</div>
              <div className="why-hire-text">I'm a <strong>fast learner</strong> with a solid Java &amp; backend foundation. I care about <strong>code quality, performance, and debugging</strong>. Ready to contribute from day one and grow with a great team.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-bg">
        <div className="contact-inner">
          <div className="tag reveal">Contact</div>
          <h2 className="contact-headline reveal d1">Let's build<br />something <em>great</em>.</h2>
          <p className="contact-tagline reveal d2">I'm actively seeking a full-time Java Full Stack Developer role. Reach out — I respond fast.</p>
          <div className="contact-rows reveal d3">
            <a href="mailto:gauranshkate.it@gmail.com" className="contact-row">
              <div className="cr-icon">✉️</div>
              <div><div className="cr-label">Email</div><div className="cr-val">gauranshkate.it@gmail.com</div></div>
              <span className="cr-arrow">→</span>
            </a>
            <a href="tel:+918815383700" className="contact-row">
              <div className="cr-icon">📞</div>
              <div><div className="cr-label">Phone</div><div className="cr-val">+91 88153 83700</div></div>
              <span className="cr-arrow">→</span>
            </a>
            <div className="contact-row" style={{ cursor: "default" }}>
              <div className="cr-icon">📍</div>
              <div><div className="cr-label">Location</div><div className="cr-val">Hyderabad, Telangana</div></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">GK.</div>
        <div className="footer-copy">© 2025 Gauransh Kate</div>
        <div className="footer-role">Java Full Stack Developer</div>
      </footer>
    </>
  );
}
