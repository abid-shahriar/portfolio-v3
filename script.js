/* ========================================
  ABID SHAHRIAR — PORTFOLIO JS
  Parallax Effects · Particles · Scroll Reveal · Typewriter
======================================== */

(function () {
  'use strict';

  // Native browser scrolling — removed Lenis smooth-scroll integration

  // ─── PARTICLE SYSTEM (Visible & Elegant) ──────
  class ParticleSystem {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: -1000, y: -1000 };
      this.connectionDistance = 135;
      this.particleCount = 0;
      this.animationId = null;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.resize();
      this.createParticles();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx.scale(this.dpr, this.dpr);

      const area = this.width * this.height;
      this.particleCount = Math.min(Math.floor(area / 15000), 75);
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2.0 + 0.8,
          // Brighter starting opacity range
          opacity: Math.random() * 0.45 + 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.005
        });
      }
    }

    bindEvents() {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.createParticles();
        }, 200);
      });

      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });

      // Performance Optimization: Pause canvas animations when tab is backgrounded
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
          }
        } else {
          if (!this.animationId) {
            this.animate();
          }
        }
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.pulse += p.pulseSpeed;
        const pulseFactor = Math.sin(p.pulse) * 0.2 + 0.8;

        // Organic continuous drift (Brownian motion)
        p.vx += (Math.random() - 0.5) * 0.008;
        p.vy += (Math.random() - 0.5) * 0.008;

        // Gentle mouse repulsion
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const force = ((130 - dist) / 130) * 0.08;
          p.vx += (dx / (dist || 1)) * force * 0.05;
          p.vy += (dy / (dist || 1)) * force * 0.05;
        }

        // Keep speed within a steady, subtle range (no stopping)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const minSpeed = 0.15;
        const maxSpeed = 0.35;
        if (speed < minSpeed) {
          p.vx = (p.vx / (speed || 1)) * minSpeed;
          p.vy = (p.vy / (speed || 1)) * minSpeed;
        } else if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.height + 10;
        if (p.y > this.height + 10) p.y = -10;

        // Solid, bright blue particles for visibility on #1a1c23 background
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity * pulseFactor})`;
        this.ctx.fill();

        // Connect lines
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < this.connectionDistance) {
            // Increased line opacity for clarity
            const alpha = (1 - cdist / this.connectionDistance) * 0.22;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            this.ctx.lineWidth = 0.55;
            this.ctx.stroke();
          }
        }
      }

      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  // ─── PARALLAX SCROLL EFFECTS ─────────────────
  class ParallaxEngine {
    constructor() {
      this.parallaxElements = document.querySelectorAll('.parallax');
      if (!this.parallaxElements.length) return;

      this.bindEvents();
    }

    bindEvents() {
      // Throttle scroll-driven transforms with requestAnimationFrame
      let ticking = false;
      const update = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        this.parallaxElements.forEach((el) => {
          const speed = parseFloat(el.dataset.speed) || -0.05;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      };

      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true }
      );

      // Run once to set initial positions
      update();
    }
  }

  // ─── SCROLL REVEAL (Intersection Observer) ──
  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
      );
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.03, rootMargin: '0px 0px -10px 0px' }
      );
      this.elements.forEach((el) => this.observer.observe(el));
    }
  }

  // ─── TYPING EFFECT ────────────────────
  class TypeWriter {
    constructor(element, words, waitTime = 2000) {
      this.element = element;
      if (!this.element) return;
      this.words = words;
      this.waitTime = waitTime;
      this.wordIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.type();
    }

    type() {
      const currentWord = this.words[this.wordIndex];

      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }

      this.element.textContent = currentWord.substring(0, this.charIndex);

      let typeSpeed = this.isDeleting ? 30 : 60;

      if (!this.isDeleting && this.charIndex === currentWord.length) {
        typeSpeed = this.waitTime;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        typeSpeed = 300;
      }

      setTimeout(() => this.type(), typeSpeed);
    }
  }

  // ─── INITIALIZE ───────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Canvas particles
    new ParticleSystem('particles-canvas');

    // Parallax background line movements
    new ParallaxEngine();

    // Scroll reveal
    new ScrollReveal();

    // Typewriter
    new TypeWriter(
      document.querySelector('.typewriter'),
      [
        'Full-Stack Dev',
        'TypeScript Expert',
        'React Specialist',
        'AI-Powered Developer',
        'Performance Optimizer'
      ],
      2000
    );
  });
})();
