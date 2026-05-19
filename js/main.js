document.addEventListener("DOMContentLoaded", () => {
  /* ===== 우클릭 메뉴 방지 ===== */
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  /* ===== 히어로 위 GNB 상태 전환 ===== */
  const gnb = document.querySelector(".gnb");
  const hero = document.querySelector(".hero, .intro-hero");
  if (gnb && hero) {
    let ticking = false;
    const updateGnbState = () => {
      const headerHeight = gnb.offsetHeight;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      gnb.classList.toggle("gnb--over-hero", window.scrollY + headerHeight < heroBottom);
      ticking = false;
    };
    const requestGnbUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateGnbState);
    };

    updateGnbState();
    window.addEventListener("scroll", requestGnbUpdate, { passive: true });
    window.addEventListener("resize", requestGnbUpdate);
  }

  /* ===== 가로 슬라이드: 마우스 드래그 스크롤 ===== */
  document.querySelectorAll(".product-viewport, .intro-feature-rail").forEach((viewport) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    viewport.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add("is-dragging");
    });
    window.addEventListener("mouseup", () => {
      isDown = false;
      viewport.classList.remove("is-dragging");
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      viewport.scrollLeft = startScroll - (e.pageX - startX);
    });

    viewport.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        viewport.scrollLeft += e.deltaX;
      },
      { passive: true }
    );
  });

  /* ===== Windows / Mac OS 토글 (그룹별 독립 동작) ===== */
  document.querySelectorAll(".toggle-btn").forEach((group) => {
    const labels = group.querySelectorAll(".toggle-label");
    labels.forEach((label) => {
      label.addEventListener("click", () => {
        labels.forEach((l) => l.classList.remove("is-active"));
        label.classList.add("is-active");

        /* 상품 구성 전환 */
        const productsOs = label.dataset.productsOs;
        if (productsOs) {
          const slide = group.closest(".set-section")?.querySelector(".product-slide");
          const viewport = slide?.querySelector(".product-viewport");
          slide?.classList.toggle("is-mac", productsOs === "mac");
          if (viewport) viewport.scrollLeft = 0;
        }

        /* PC 스펙표 전환 */
        const os = label.dataset.os;
        if (os) {
          const wrap = group
            .closest(".pc-spec")
            ?.querySelector(".pc-spec__tablewrap");
          if (wrap) {
            wrap.querySelectorAll(".spec-table").forEach((t) => t.classList.remove("is-active"));
            const target = wrap.querySelector(
              os === "mac" ? ".spec-table--mac" : ".spec-table--win"
            );
            if (target) target.classList.add("is-active");
          }
        }
      });
    });
  });

  /* ===== FAQ 아코디언 ===== */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    const panel = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
    });
  });

  /* ===== Marquee 무한 루프 (트랙 자식 1회 복제) ===== */
  document.querySelectorAll(".marquee__track").forEach((track) => {
    const items = Array.from(track.children);
    items.forEach((item) => track.appendChild(item.cloneNode(true)));
  });

  /* ===== 스크롤 등장 애니메이션 ===== */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          /* 같은 부모 내 .reveal 형제 순서로 약한 stagger */
          const siblings = Array.from(el.parentElement.children).filter((c) =>
            c.classList.contains("reveal")
          );
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(idx, 3) * 0.08 + "s";
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
