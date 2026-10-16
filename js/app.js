/**
 * ==========================================================================
 * 동신대학교 교수학습지원센터(CTL) 공식 스마트 홍보 앱
 * 인터랙티브 클라이언트 애플리케이션 스크립트 (App Controller)
 * ==========================================================================
 */

(function () {
  "use strict";

  // 기본 스토리지 키
  const STORAGE_KEY = "DSU_CTL_APP_STATE_V2";

  // 초기 기본 상태
  const defaultState = {
    userName: "김동신",
    userDept: "컴퓨터공학과 2학년",
    userStudentId: "202418042",
    points: 450,
    bookmarks: ["prog-01", "prog-02"],
    applications: [
      {
        id: "app-prev-1",
        programId: "prog-05",
        programTitle: "메타인지 기반 '기적의 학점 4.5' 시험대비 학습법 특강",
        appliedAt: "2026.03.14 11:20",
        status: "접수완료",
        mileage: 50
      }
    ],
    quizAnswered: false,
    quizScoreGained: false,
    redeemedRewards: [],
    theme: "light",
    viewMode: "mode-phone",
    unreadNotices: 2
  };

  // 앱 전역 상태
  let appState = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("로컬 스토리지 로드 실패, 기본값 사용", e);
    }
    return Object.assign({}, defaultState);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn("로컬 스토리지 저장 실패", e);
    }
    updateHeaderAndUserUI();
  }

  // ==========================================================================
  // [1] 오디오 사운드 효과 (Web Audio API 기반 자체 합성음 - 무지연/무외부파일)
  // ==========================================================================
  const SoundFX = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },
    playSuccess() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = "sine";
        osc2.type = "triangle";

        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6

        osc2.frequency.setValueAtTime(261.63, now); // C4
        osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.55);
        osc2.stop(now + 0.55);
      } catch (e) {
        // 무음 처리
      }
    },
    playClick() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch (e) {}
    }
  };

  // ==========================================================================
  // [2] 축하 컨페티 파티클 시스템 (Canvas Confetti)
  // ==========================================================================
  const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,

    init() {
      this.canvas = document.getElementById("confetti-canvas");
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());
      }
    },

    resize() {
      if (!this.canvas) return;
      const container = document.getElementById("app-container");
      if (container) {
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
      }
    },

    fire(count = 70) {
      this.resize();
      SoundFX.playSuccess();
      const colors = ["#2563eb", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#fbbf24"];
      const w = this.canvas.width;
      const h = this.canvas.height;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: w * 0.5 + (Math.random() - 0.5) * 80,
          y: h * 0.4,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 12 - 4,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          gravity: 0.35,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01
        });
      }

      if (!this.animId) {
        this.loop();
      }
    },

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  };

  // ==========================================================================
  // [3] 토스트 알림 메시지 시스템
  // ==========================================================================
  function showToast(message, icon = "✨") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span style="font-size:1.1rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3100);
  }

  // ==========================================================================
  // [4] 헤더 및 상태바, 사용자 UI 업데이트
  // ==========================================================================
  function updateHeaderAndUserUI() {
    // 포인트 업데이트
    const userDisplayPoints = document.getElementById("user-display-points");
    const tabMileageNumber = document.getElementById("tab-mileage-number");
    const mileageTierProgress = document.getElementById("mileage-tier-progress");

    if (userDisplayPoints) userDisplayPoints.textContent = appState.points;
    if (tabMileageNumber) tabMileageNumber.textContent = appState.points;

    // 다음 티어 계산 (목표 500P 기준)
    if (mileageTierProgress) {
      const pct = Math.min(100, Math.round((appState.points / 500) * 100));
      mileageTierProgress.style.width = pct + "%";
    }

    // 알림 뱃지 카운트
    const noticeBadge = document.getElementById("notice-badge-count");
    if (noticeBadge) {
      noticeBadge.textContent = appState.unreadNotices;
      noticeBadge.style.display = appState.unreadNotices > 0 ? "flex" : "none";
    }

    // 테마 적용
    document.documentElement.setAttribute("data-theme", appState.theme);
    const sunIcon = document.getElementById("theme-icon-sun");
    if (sunIcon) {
      if (appState.theme === "dark") {
        sunIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      } else {
        sunIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
      }
    }

    // 뷰 모드 적용
    document.body.className = appState.viewMode;
    const btnPhone = document.getElementById("btn-mode-phone");
    const btnWeb = document.getElementById("btn-mode-web");
    if (btnPhone && btnWeb) {
      btnPhone.classList.toggle("active", appState.viewMode === "mode-phone");
      btnWeb.classList.toggle("active", appState.viewMode === "mode-web");
    }
  }

  // 실시간 스마트폰 시계
  function updateLiveClock() {
    const timeEl = document.getElementById("live-phone-time");
    if (!timeEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    timeEl.textContent = `${hours}:${minutes}`;
  }

  // ==========================================================================
  // [5] 탭 전환 네비게이션 제어
  // ==========================================================================
  function switchTab(targetPaneId) {
    SoundFX.playClick();
    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(pane => pane.classList.remove("active"));

    const targetPane = document.getElementById(targetPaneId);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    const navButtons = document.querySelectorAll(".nav-tab-item");
    navButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-target") === targetPaneId);
    });

    const scrollContainer = document.getElementById("app-content");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }

    // 탭별 전용 리프레시
    if (targetPaneId === "pane-mileage") {
      renderMyApplications();
      renderQuiz();
    } else if (targetPaneId === "pane-programs") {
      renderPrograms();
    }
  }

  // ==========================================================================
  // [6] 히어로 슬라이더 자동 회전 및 제어
  // ==========================================================================
  let sliderTimer = null;
  let currentSlideIndex = 0;

  function initHeroSlider() {
    const slider = document.getElementById("hero-slider");
    const dots = document.querySelectorAll(".dot-indicator");
    if (!slider || dots.length === 0) return;

    function goToSlide(index) {
      currentSlideIndex = index;
      slider.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToSlide(idx);
        restartTimer();
      });
    });

    // 슬라이드 클릭 시 해당 프로그램 모달 바로 오픈
    const slides = document.querySelectorAll(".hero-slide");
    slides.forEach(slide => {
      slide.addEventListener("click", () => {
        const progId = slide.getAttribute("data-program-id");
        if (progId) openProgramDetailModal(progId);
      });
    });

    function nextSlide() {
      const nextIdx = (currentSlideIndex + 1) % dots.length;
      goToSlide(nextIdx);
    }

    function restartTimer() {
      if (sliderTimer) clearInterval(sliderTimer);
      sliderTimer = setInterval(nextSlide, 4500);
    }

    restartTimer();

    slider.addEventListener("mouseenter", () => clearInterval(sliderTimer));
    slider.addEventListener("mouseleave", restartTimer);
  }

  // ==========================================================================
  // [7] 홈 탭 컴포넌트 렌더링 (인기 프로그램 / 우수 후기 / 공지사항)
  // ==========================================================================
  function renderHomeComponents() {
    // 1. 인기 프로그램 수평 덱
    const popularDeck = document.getElementById("home-popular-deck");
    if (popularDeck && window.CTL_DATA) {
      const topProgs = window.CTL_DATA.programs.slice(0, 4);
      popularDeck.innerHTML = topProgs.map(p => `
        <div class="mini-program-card" onclick="window.openProgramDetail('${p.id}')">
          <div class="mini-card-thumb">
            <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
            <span class="mini-badge ${p.status === 'urgent' ? 'urgent' : ''}">${p.statusText}</span>
          </div>
          <div class="mini-card-body">
            <div style="font-size:0.7rem; font-weight:700; color:var(--dsu-blue); margin-bottom:2px;">${p.categoryName}</div>
            <div class="mini-card-title">${p.title}</div>
            <div class="mini-card-footer">
              <span class="mileage-tag">🌟 +${p.mileage}P</span>
              <span style="color:var(--text-muted); font-size:0.7rem;">정원 ${p.currentEnrolled}/${p.capacity}</span>
            </div>
          </div>
        </div>
      `).join("");
    }

    // 2. 생생 우수 후기 스크롤러
    const reviewsDeck = document.getElementById("home-reviews-deck");
    if (reviewsDeck && window.CTL_DATA) {
      reviewsDeck.innerHTML = window.CTL_DATA.reviews.map(r => `
        <div class="review-card">
          <div>
            <div class="review-header">
              <div class="reviewer-meta">
                <div class="reviewer-avatar-circle" style="background:${r.avatarBg}">
                  ${r.studentName.charAt(0)}
                </div>
                <div>
                  <div class="reviewer-name">${r.studentName}</div>
                  <div class="reviewer-dept">${r.department}</div>
                </div>
              </div>
              <div class="review-rating">${"★".repeat(r.rating)}</div>
            </div>
            <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); margin-bottom:4px;">참여: ${r.programName}</div>
            <div class="review-highlight">"${r.highlight}"</div>
            <div class="review-comment">${r.comment}</div>
          </div>
          <div style="font-size:0.68rem; color:var(--text-subtle); text-align:right; margin-top:8px;">${r.date}</div>
        </div>
      `).join("");
    }

    // 3. 최신 공지사항 피드
    const noticeList = document.getElementById("home-notice-list");
    if (noticeList && window.CTL_DATA) {
      noticeList.innerHTML = window.CTL_DATA.notices.map(n => `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:9px 0; border-bottom:1px solid var(--border-light); cursor:pointer;" onclick="window.openNoticeModal('${n.id}')">
          <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
            <span style="font-size:0.68rem; font-weight:800; background:var(--dsu-blue-soft); color:var(--dsu-blue); padding:2px 8px; border-radius:var(--radius-pill); white-space:nowrap;">${n.tag}</span>
            <span style="font-size:0.82rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${n.title}</span>
          </div>
          <span style="font-size:0.72rem; color:var(--text-subtle); white-space:nowrap;">${n.date}</span>
        </div>
      `).join("");
    }
  }

  // ==========================================================================
  // [8] 프로그램 탭 렌더링 & 실시간 검색 & 카테고리 필터
  // ==========================================================================
  let currentCategory = "all";
  let searchQuery = "";

  function renderPrograms() {
    const list = document.getElementById("main-programs-list");
    if (!list || !window.CTL_DATA) return;

    const filtered = window.CTL_DATA.programs.filter(p => {
      const matchCat = currentCategory === "all" || p.category === currentCategory;
      const matchQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      list.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; color:var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:12px;">🔍</div>
          <div style="font-weight:700; font-size:1rem; margin-bottom:6px;">검색 조건에 맞는 프로그램이 없습니다.</div>
          <div style="font-size:0.8rem;">검색어나 카테고리 필터를 변경해 보세요.</div>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(p => {
      const isBookmarked = appState.bookmarks.includes(p.id);
      const isApplied = appState.applications.some(a => a.programId === p.id);
      const pct = Math.min(100, Math.round((p.currentEnrolled / p.capacity) * 100));

      return `
        <article class="program-card" data-id="${p.id}">
          <div class="card-header-image">
            <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
            <div class="card-status-badges">
              <span class="badge ${p.status === 'urgent' ? 'badge-urgent' : p.status === 'open' ? 'badge-open' : 'badge-upcoming'}">
                ${p.statusText}
              </span>
              <span class="badge" style="background:rgba(0,0,0,0.6); color:#ffffff;">${p.categoryName}</span>
            </div>
            <button type="button" class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="window.toggleBookmark('${p.id}', event)" title="찜하기">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </button>
          </div>

          <div class="card-content">
            <div>
              <div class="card-category">DONGSHIN CTL 비교과</div>
              <h4 class="card-title">${p.title}</h4>
              <p class="card-subtitle">${p.subtitle}</p>

              <div class="card-meta-list">
                <div class="card-meta-row">
                  <span>📅</span> <span><strong>신청기간:</strong> ${p.period}</span>
                </div>
                <div class="card-meta-row">
                  <span>🎯</span> <span><strong>활동일정:</strong> ${p.activityPeriod}</span>
                </div>
                <div class="card-meta-row">
                  <span>🧑‍🏫</span> <span><strong>지도/강사:</strong> ${p.instructor}</span>
                </div>
              </div>

              <!-- 모집 인원 게이지 바 -->
              <div class="capacity-progress-wrap">
                <div class="capacity-labels">
                  <span style="color:var(--text-muted);">신청 현황</span>
                  <span><strong>${p.currentEnrolled}</strong> / ${p.capacity}명 (${pct}%)</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${pct}%;"></div>
                </div>
              </div>
            </div>

            <div class="card-actions-row">
              <div class="card-mileage-badge">
                <span>🌟</span>
                <span>+${p.mileage}P 지급</span>
              </div>
              <button type="button" class="btn-detail" onclick="window.openProgramDetail('${p.id}')">
                ${isApplied ? '신청 완료 (확인)' : '상세보기 & 신청'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================================================
  // [9] 프로그램 상세 & 원클릭 모의 신청 모달
  // ==========================================================================
  function openProgramDetailModal(programId) {
    SoundFX.playClick();
    const prog = window.CTL_DATA.programs.find(p => p.id === programId);
    if (!prog) return;

    const modal = document.getElementById("common-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    const isApplied = appState.applications.some(a => a.programId === prog.id);
    const isBookmarked = appState.bookmarks.includes(prog.id);

    modalTitle.textContent = prog.title;
    modalContent.innerHTML = `
      <div style="margin-bottom:16px;">
        <img src="${prog.thumbnail}" alt="${prog.title}" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius-md); margin-bottom:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <span class="badge ${prog.status === 'urgent' ? 'badge-urgent' : 'badge-open'}">${prog.statusText}</span>
          <span style="font-weight:800; color:var(--dsu-amber); font-size:0.95rem;">🌟 드림마일리지 +${prog.mileage}P</span>
        </div>
        <p style="font-size:0.86rem; line-height:1.55; color:var(--text-main); margin-bottom:14px;">
          ${prog.description}
        </p>

        <!-- 세부 교육 내용 -->
        <div style="background:var(--bg-card-subtle); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; margin-bottom:14px;">
          <h5 style="font-weight:800; margin-bottom:8px; color:var(--dsu-blue);">📋 주요 커리큘럼 및 진행 단계</h5>
          <ul style="padding-left:18px; font-size:0.8rem; line-height:1.6; color:var(--text-main);">
            ${prog.curriculum.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>

        <!-- 참여 혜택 -->
        <div style="background:var(--dsu-blue-soft); border:1px solid rgba(37,99,235,0.25); border-radius:var(--radius-md); padding:14px; margin-bottom:16px;">
          <h5 style="font-weight:800; margin-bottom:8px; color:var(--dsu-blue);">🎁 참여 학생 특별 혜택</h5>
          <ul style="padding-left:18px; font-size:0.8rem; line-height:1.6; color:var(--text-main);">
            ${prog.benefits.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>

        <!-- 신청 폼 -->
        <div style="border-top:1px solid var(--border-light); padding-top:16px;">
          <h5 style="font-weight:800; margin-bottom:12px; font-size:0.95rem;">
            ${isApplied ? '✅ 이미 신청 완료된 프로그램입니다' : '✍️ 참가 신청서 작성'}
          </h5>

          ${isApplied ? `
            <div style="background:var(--dsu-green-soft); color:var(--dsu-green); padding:12px; border-radius:var(--radius-md); font-weight:700; font-size:0.84rem; text-align:center; margin-bottom:10px;">
              정상적으로 접수되었습니다. 센터에서 오리엔테이션 안내 문자가 발송될 예정입니다.
            </div>
            <button type="button" class="btn-detail" onclick="window.cancelApplication('${prog.id}')" style="width:100%; padding:11px; background:var(--bg-card-subtle); color:var(--dsu-rose); border:1px solid var(--dsu-rose);">
              신청 취소하기
            </button>
          ` : `
            <form id="program-apply-form" onsubmit="window.handleApplySubmit(event, '${prog.id}')">
              <div class="app-form-group">
                <label class="app-form-label">신청자 성명</label>
                <input type="text" class="app-form-input" id="apply-name" value="${appState.userName}" required>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div class="app-form-group">
                  <label class="app-form-label">학번</label>
                  <input type="text" class="app-form-input" id="apply-id" value="${appState.userStudentId}" required>
                </div>
                <div class="app-form-group">
                  <label class="app-form-label">학과</label>
                  <input type="text" class="app-form-input" id="apply-dept" value="${appState.userDept}" required>
                </div>
              </div>
              <div class="app-form-group">
                <label class="app-form-label">참가 포부 및 신청 동기</label>
                <textarea class="app-form-textarea" id="apply-memo" rows="2" placeholder="예: 이번 학기 전공 평점 4.0 달성을 목표로 열정적으로 참여하겠습니다!" required></textarea>
              </div>
              <button type="submit" class="diag-submit-btn" style="padding:12px; margin-top:6px;">
                🚀 원클릭 신청 완료하기 (+참여 마일리지 보장)
              </button>
            </form>
          `}
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  function handleApplySubmit(e, programId) {
    e.preventDefault();
    const prog = window.CTL_DATA.programs.find(p => p.id === programId);
    if (!prog) return;

    const name = document.getElementById("apply-name").value.trim();
    const studentId = document.getElementById("apply-id").value.trim();
    const dept = document.getElementById("apply-dept").value.trim();

    // 상태 업데이트
    appState.userName = name || appState.userName;
    appState.userStudentId = studentId || appState.userStudentId;
    appState.userDept = dept || appState.userDept;

    // 프로그램 인원 1명 증가
    if (prog.currentEnrolled < prog.capacity) {
      prog.currentEnrolled += 1;
    }

    // 마일리지 적립 보너스 (+30P 즉시 가상 선지급)
    const bonus = 30;
    appState.points += bonus;

    const newApp = {
      id: "app-" + Date.now(),
      programId: prog.id,
      programTitle: prog.title,
      appliedAt: new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      status: "접수완료",
      mileage: prog.mileage
    };

    appState.applications.unshift(newApp);
    saveState();

    Confetti.fire(80);
    showToast(`'${prog.title}' 신청 완료! 참여 보너스 +${bonus}P 적립 🎉`, "🎓");

    closeModal();
    renderPrograms();
    renderHomeComponents();
  }

  function cancelApplication(programId) {
    appState.applications = appState.applications.filter(a => a.programId !== programId);
    const prog = window.CTL_DATA.programs.find(p => p.id === programId);
    if (prog && prog.currentEnrolled > 0) {
      prog.currentEnrolled -= 1;
    }
    saveState();
    showToast("신청이 정상적으로 취소되었습니다.", "ℹ️");
    closeModal();
    renderPrograms();
    renderHomeComponents();
  }

  function toggleBookmark(programId, e) {
    if (e) e.stopPropagation();
    SoundFX.playClick();
    const idx = appState.bookmarks.indexOf(programId);
    const prog = window.CTL_DATA.programs.find(p => p.id === programId);
    const title = prog ? prog.title : "프로그램";

    if (idx >= 0) {
      appState.bookmarks.splice(idx, 1);
      showToast(`'${title}' 찜 목록에서 해제되었습니다.`, "🤍");
    } else {
      appState.bookmarks.push(programId);
      showToast(`'${title}' 찜 목록에 추가되었습니다!`, "⭐");
      Confetti.fire(30);
    }
    saveState();
    renderPrograms();
  }

  function closeModal() {
    const modal = document.getElementById("common-modal");
    if (modal) modal.classList.remove("active");
  }

  // ==========================================================================
  // [10] AI 학습코치 '동신이' 30초 맞춤 진단 & 챗봇 대화
  // ==========================================================================
  function initAICoach() {
    // 1. 진단기 선택 옵션 핸들러
    const setupOptionGroup = (groupId) => {
      const container = document.getElementById(groupId);
      if (!container) return;
      const btns = container.querySelectorAll(".diag-option-btn");
      btns.forEach(btn => {
        btn.addEventListener("click", () => {
          SoundFX.playClick();
          btns.forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
        });
      });
    };

    setupOptionGroup("diag-q1-group");
    setupOptionGroup("diag-q2-group");

    // 진단 실행 버튼
    const runBtn = document.getElementById("btn-run-diagnosis");
    const resultBox = document.getElementById("diag-result-box");
    const progTitleEl = document.getElementById("diag-result-program-title");
    const reasonEl = document.getElementById("diag-result-reason");
    const applyBtn = document.getElementById("diag-result-apply-btn");

    if (runBtn) {
      runBtn.addEventListener("click", () => {
        SoundFX.playSuccess();
        Confetti.fire(50);

        const q1Selected = document.querySelector("#diag-q1-group .diag-option-btn.selected");
        const q2Selected = document.querySelector("#diag-q2-group .diag-option-btn.selected");

        const q1Val = q1Selected ? q1Selected.getAttribute("data-val") : "freshman";
        const q2Val = q2Selected ? q2Selected.getAttribute("data-val") : "studygroup";

        let matchedId = "prog-01";
        let title = "러닝파트너 24기 스터디 그룹";
        let reason = "친구들과 팀을 이루어 전공 과목을 정복하고 최대 50만원 활동비와 장학금을 받을 수 있는 최적의 프로그램입니다!";

        if (q2Val === "aitech") {
          matchedId = "prog-02";
          title = "생성형 AI(ChatGPT & Claude) 활용 학업 워크숍";
          reason = "A+ 리포트 작성 시간 단축과 최신 AI 프롬프트 엔지니어링 실습으로 학업 효율을 300% 높일 수 있습니다!";
        } else if (q2Val === "strategy") {
          matchedId = "prog-03";
          title = "1:1 맞춤형 MLST 학습전략검사 및 전문가 코칭";
          reason = "전문 심리검사로 내 공부 스타일의 약점을 진단하고 벼락치기 탈출 솔루션을 1:1로 밀착 지도받을 수 있습니다.";
        } else if (q2Val === "tutoring") {
          matchedId = "prog-04";
          title = "동신 튜터링 (선후배 맞춤 전공 멘토링)";
          reason = "직전학기 과목 A+를 달성한 선배 튜터의 밀착 과외와 전공 꿀팁으로 성적 점프를 이룰 수 있습니다.";
        }

        if (resultBox && progTitleEl && reasonEl && applyBtn) {
          progTitleEl.textContent = title;
          reasonEl.textContent = `💡 AI 동신이의 진단 분석: ${reason}`;
          applyBtn.onclick = () => openProgramDetailModal(matchedId);
          resultBox.style.display = "block";
          resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    }

    // 2. 챗봇 대화 로직
    const chatInput = document.getElementById("chat-input-field");
    const sendBtn = document.getElementById("btn-chat-send");
    const messagesArea = document.getElementById("chat-messages-area");
    const replyChips = document.querySelectorAll(".reply-chip");

    function sendChatMessage(text) {
      if (!text || !messagesArea) return;
      SoundFX.playClick();

      // 유저 메시지 버블 추가
      const userBubble = document.createElement("div");
      userBubble.className = "msg-bubble msg-user";
      userBubble.textContent = text;
      messagesArea.appendChild(userBubble);
      messagesArea.scrollTop = messagesArea.scrollHeight;

      if (chatInput) chatInput.value = "";

      // 타이핑 인디케이터 시뮬레이션
      const typingBubble = document.createElement("div");
      typingBubble.className = "msg-bubble msg-bot";
      typingBubble.innerHTML = `<em>동신이가 답변을 작성 중입니다...</em>`;
      messagesArea.appendChild(typingBubble);
      messagesArea.scrollTop = messagesArea.scrollHeight;

      setTimeout(() => {
        let answer = "질문해주셔서 감사해요! 동신대 CTL에서는 학생 여러분의 학업과 성장을 위한 러닝파트너, AI 특강, 1:1 학습상담을 무료로 지원하고 있습니다. 자세한 상담은 중앙도서관 2층 센터(061-330-3114)로 문의주세요! 🦅✨";

        // 키워드 매칭
        const lower = text.toLowerCase();
        for (const item of window.CTL_DATA.faqResponses) {
          if (item.keywords.some(k => lower.includes(k))) {
            answer = `<strong>[${item.title}]</strong><br>${item.content}`;
            break;
          }
        }

        typingBubble.innerHTML = answer;
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }, 650);
    }

    if (sendBtn && chatInput) {
      sendBtn.addEventListener("click", () => {
        sendChatMessage(chatInput.value.trim());
      });
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          sendChatMessage(chatInput.value.trim());
        }
      });
    }

    replyChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-query");
        sendChatMessage(query);
      });
    });
  }

  // ==========================================================================
  // [11] 마이 마일리지 탭 (데일리 퀴즈 & 리워드 교환 & 신청 내역)
  // ==========================================================================
  function renderQuiz() {
    const qText = document.getElementById("quiz-question-text");
    const qAnswers = document.getElementById("quiz-answers-grid");
    const qStatus = document.getElementById("quiz-status-badge");
    if (!qText || !qAnswers || !window.CTL_DATA) return;

    const quiz = window.CTL_DATA.quizzes[0];
    qText.textContent = quiz.question;

    if (appState.quizAnswered) {
      if (qStatus) {
        qStatus.textContent = "오늘 참여 완료 (+20P 적립됨)";
        qStatus.style.color = "var(--text-muted)";
      }
      qAnswers.innerHTML = quiz.options.map((opt, i) => `
        <button type="button" class="quiz-ans-btn ${i === quiz.correctIndex ? 'correct' : ''}" disabled>
          ${opt} ${i === quiz.correctIndex ? '✅' : ''}
        </button>
      `).join("");
      return;
    }

    if (qStatus) {
      qStatus.textContent = "도전 가능 (+20P)";
      qStatus.style.color = "var(--dsu-green)";
    }

    qAnswers.innerHTML = quiz.options.map((opt, i) => `
      <button type="button" class="quiz-ans-btn" onclick="window.handleQuizAnswer(${i}, ${quiz.correctIndex})">
        ${opt}
      </button>
    `).join("");
  }

  function handleQuizAnswer(selectedIdx, correctIdx) {
    if (appState.quizAnswered) return;

    const btns = document.querySelectorAll("#quiz-answers-grid .quiz-ans-btn");
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.classList.add("correct");
      } else if (idx === selectedIdx) {
        btn.classList.add("wrong");
      }
    });

    if (selectedIdx === correctIdx) {
      const reward = 20;
      appState.points += reward;
      appState.quizAnswered = true;
      saveState();

      Confetti.fire(60);
      showToast(`정답입니다! 매일 배움 퀴즈 +${reward}P 적립 완료 👏`, "🎉");
    } else {
      appState.quizAnswered = true;
      saveState();
      showToast("아쉽게도 오답입니다! 내일 다시 도전해보세요.", "💡");
    }

    renderQuiz();
  }

  function initRewardExchange() {
    const exchangeBtns = document.querySelectorAll(".reward-exchange-btn");
    exchangeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const cost = parseInt(btn.getAttribute("data-cost"), 10);
        const name = btn.getAttribute("data-name");

        if (appState.points < cost) {
          showToast(`마일리지가 부족합니다. (현재: ${appState.points}P / 필요: ${cost}P)`, "⚠️");
          return;
        }

        // 교환 처리
        appState.points -= cost;
        appState.redeemedRewards.push({
          name: name,
          cost: cost,
          redeemedAt: new Date().toLocaleDateString("ko-KR")
        });
        saveState();

        Confetti.fire(70);
        showToast(`'${name}' 교환 신청 완료! 모바일 쿠폰이 발송됩니다.`, "🎁");
      });
    });
  }

  function renderMyApplications() {
    const list = document.getElementById("my-applied-programs-list");
    if (!list) return;

    if (appState.applications.length === 0) {
      list.innerHTML = `
        <div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:24px; text-align:center; color:var(--text-muted); font-size:0.82rem;">
          아직 신청한 CTL 프로그램이 없습니다.<br>
          [프로그램] 탭에서 원하는 스터디나 특강을 신청해보세요!
        </div>
      `;
      return;
    }

    list.innerHTML = appState.applications.map(app => `
      <div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-sm);">
        <div>
          <span style="font-size:0.68rem; font-weight:800; background:var(--dsu-green-soft); color:var(--dsu-green); padding:2px 8px; border-radius:var(--radius-pill);">${app.status}</span>
          <div style="font-weight:800; font-size:0.88rem; margin:4px 0 2px;">${app.programTitle}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">신청일시: ${app.appliedAt} | 혜택: +${app.mileage}P</div>
        </div>
        <button type="button" class="btn-detail" style="font-size:0.74rem; padding:6px 12px;" onclick="window.openProgramDetail('${app.programId}')">
          상세확인
        </button>
      </div>
    `).join("");
  }

  // ==========================================================================
  // [12] 센터소개 & 학습 공간 예약 안내
  // ==========================================================================
  function renderFacilities() {
    const list = document.getElementById("facilities-list");
    if (!list || !window.CTL_DATA) return;

    list.innerHTML = window.CTL_DATA.facilities.map(f => `
      <div class="facility-item-card">
        <div class="fac-name">${f.name}</div>
        <div class="fac-loc">📍 위치: ${f.location} | 수용: ${f.capacity}</div>
        <p class="fac-desc">${f.desc}</p>
        <div style="font-size:0.74rem; color:var(--text-muted); margin-bottom:8px;">
          🛠️ 구비 장비: ${f.equipment}
        </div>
        <div class="fac-tags">
          ${f.tags.map(t => `<span class="fac-tag">#${t}</span>`).join("")}
        </div>
        <button type="button" class="fac-reserve-btn" onclick="window.openFacilityBookingModal('${f.id}')">
          📅 스터디룸 / 공간 이용 예약하기
        </button>
      </div>
    `).join("");
  }

  function openFacilityBookingModal(facilityId) {
    SoundFX.playClick();
    const fac = window.CTL_DATA.facilities.find(f => f.id === facilityId);
    if (!fac) return;

    const modal = document.getElementById("common-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    modalTitle.textContent = `${fac.name} 예약 신청`;
    modalContent.innerHTML = `
      <div style="margin-bottom:14px;">
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">
          위치: ${fac.location} (${fac.availableTime})
        </p>

        <form id="facility-booking-form" onsubmit="window.handleFacilityBookingSubmit(event, '${fac.name}')">
          <div class="app-form-group">
            <label class="app-form-label">이용 목적 (스터디/특강/영상제작)</label>
            <input type="text" class="app-form-input" id="book-purpose" placeholder="예: 러닝파트너 24기 3주차 그룹 스터디" required>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="app-form-group">
              <label class="app-form-label">예약 일자</label>
              <input type="date" class="app-form-input" id="book-date" value="2026-03-20" required>
            </div>
            <div class="app-form-group">
              <label class="app-form-label">이용 희망 시간</label>
              <select class="app-form-select" id="book-time">
                <option>10:00 ~ 12:00 (2시간)</option>
                <option selected>14:00 ~ 16:00 (2시간)</option>
                <option>16:00 ~ 18:00 (2시간)</option>
                <option>18:00 ~ 20:00 (야간)</option>
              </select>
            </div>
          </div>
          <div class="app-form-group">
            <label class="app-form-label">참여 예상 인원 (수용: ${fac.capacity})</label>
            <input type="number" class="app-form-input" id="book-people" min="1" max="10" value="4" required>
          </div>
          <button type="submit" class="diag-submit-btn" style="padding:12px; margin-top:8px;">
            ✅ 공간 무료 예약 확정하기
          </button>
        </form>
      </div>
    `;

    modal.classList.add("active");
  }

  function handleFacilityBookingSubmit(e, facName) {
    e.preventDefault();
    closeModal();
    Confetti.fire(50);
    showToast(`[${facName}] 예약 신청이 완료되었습니다! 안내 문자를 확인해주세요.`, "🏢");
  }

  // ==========================================================================
  // [13] 알림 센터 및 찜 목록 모달
  // ==========================================================================
  function openNoticesModal() {
    SoundFX.playClick();
    appState.unreadNotices = 0;
    saveState();

    const modal = document.getElementById("common-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    modalTitle.textContent = "🔔 알림 & 공지 센터";
    modalContent.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${window.CTL_DATA.notices.map(n => `
          <div style="background:var(--bg-card-subtle); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
              <span style="font-size:0.7rem; font-weight:800; background:var(--dsu-blue); color:#ffffff; padding:2px 8px; border-radius:var(--radius-pill);">${n.tag}</span>
              <span style="font-size:0.72rem; color:var(--text-subtle);">${n.date}</span>
            </div>
            <div style="font-weight:800; font-size:0.86rem; margin-bottom:4px;">${n.title}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.45;">
              동신대학교 교수학습지원센터에서 제공하는 공식 공지입니다.
            </div>
          </div>
        `).join("")}
      </div>
    `;

    modal.classList.add("active");
  }

  function openNoticeItemModal(noticeId) {
    const notice = window.CTL_DATA.notices.find(n => n.id === noticeId);
    if (!notice) return;
    openNoticesModal();
  }

  function openBookmarksModal() {
    SoundFX.playClick();
    const modal = document.getElementById("common-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");

    const bookmarkedProgs = window.CTL_DATA.programs.filter(p => appState.bookmarks.includes(p.id));

    modalTitle.textContent = "⭐ 내가 찜한 프로그램";
    if (bookmarkedProgs.length === 0) {
      modalContent.innerHTML = `
        <div style="text-align:center; padding:30px; color:var(--text-muted);">
          찜한 프로그램이 아직 없습니다.<br>관심 있는 프로그램의 별표를 눌러보세요!
        </div>
      `;
    } else {
      modalContent.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${bookmarkedProgs.map(p => `
            <div style="background:var(--bg-card-subtle); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:0.7rem; font-weight:800; color:var(--dsu-blue);">${p.categoryName}</div>
                <div style="font-weight:800; font-size:0.88rem; margin:2px 0;">${p.title}</div>
                <div style="font-size:0.74rem; color:var(--dsu-amber); font-weight:700;">🌟 +${p.mileage}P</div>
              </div>
              <button type="button" class="btn-detail" onclick="window.openProgramDetail('${p.id}')">상세보기</button>
            </div>
          `).join("")}
        </div>
      `;
    }

    modal.classList.add("active");
  }

  // ==========================================================================
  // [14] 초기화 및 이벤트 리스너 바인딩
  // ==========================================================================
  function bindEventListeners() {
    // 탭 내비게이션
    const navItems = document.querySelectorAll(".nav-tab-item");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const target = item.getAttribute("data-target");
        switchTab(target);
      });
    });

    // 퀵 액션 버튼들
    const qaPrograms = document.getElementById("qa-programs");
    const qaDiagnosis = document.getElementById("qa-ai-diagnosis");
    const qaConsulting = document.getElementById("qa-consulting");
    const qaMileage = document.getElementById("qa-mileage");
    const quickToMileage = document.getElementById("quick-to-mileage");
    const viewAllPrograms = document.getElementById("home-view-all-programs");
    const brandLogo = document.getElementById("header-brand-logo");

    if (qaPrograms) qaPrograms.addEventListener("click", () => switchTab("pane-programs"));
    if (qaDiagnosis) qaDiagnosis.addEventListener("click", () => switchTab("pane-ai"));
    if (qaConsulting) qaConsulting.addEventListener("click", () => openProgramDetailModal("prog-03"));
    if (qaMileage) qaMileage.addEventListener("click", () => switchTab("pane-mileage"));
    if (quickToMileage) quickToMileage.addEventListener("click", () => switchTab("pane-mileage"));
    if (viewAllPrograms) viewAllPrograms.addEventListener("click", () => switchTab("pane-programs"));
    if (brandLogo) brandLogo.addEventListener("click", () => switchTab("pane-home"));

    // 테마 토글 버튼
    const themeBtn = document.getElementById("btn-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        SoundFX.playClick();
        appState.theme = appState.theme === "dark" ? "light" : "dark";
        saveState();
        showToast(appState.theme === "dark" ? "다크 모드가 적용되었습니다 🌙" : "라이트 모드가 적용되었습니다 ☀️", "🎨");
      });
    }

    // 뷰 모드 토글 (스마트폰 vs 웹 뷰)
    const btnPhone = document.getElementById("btn-mode-phone");
    const btnWeb = document.getElementById("btn-mode-web");

    if (btnPhone) {
      btnPhone.addEventListener("click", () => {
        SoundFX.playClick();
        appState.viewMode = "mode-phone";
        saveState();
        Confetti.resize();
      });
    }

    if (btnWeb) {
      btnWeb.addEventListener("click", () => {
        SoundFX.playClick();
        appState.viewMode = "mode-web";
        saveState();
        Confetti.resize();
      });
    }

    // 데이터 초기화 버튼
    const resetBtn = document.getElementById("btn-reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("체험 데이터를 초기 기본 상태로 리셋하시겠습니까?")) {
          localStorage.removeItem(STORAGE_KEY);
          appState = Object.assign({}, defaultState);
          saveState();
          renderPrograms();
          renderHomeComponents();
          renderQuiz();
          showToast("데이터가 초기 상태로 복구되었습니다.", "🔄");
        }
      });
    }

    // 모달 닫기
    const modalCloseBtn = document.getElementById("btn-close-modal");
    const modal = document.getElementById("common-modal");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // 알림 및 찜 버튼
    const noticeBtn = document.getElementById("btn-open-notices");
    const bookmarksBtn = document.getElementById("btn-open-bookmarks");
    if (noticeBtn) noticeBtn.addEventListener("click", openNoticesModal);
    if (bookmarksBtn) bookmarksBtn.addEventListener("click", openBookmarksModal);

    // 검색 인풋
    const searchInput = document.getElementById("program-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderPrograms();
      });
    }

    // 카테고리 칩
    const chipBtns = document.querySelectorAll("#category-chips-list .chip-btn");
    chipBtns.forEach(chip => {
      chip.addEventListener("click", () => {
        SoundFX.playClick();
        chipBtns.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentCategory = chip.getAttribute("data-category");
        renderPrograms();
      });
    });

    // 1:1 빠른 문의 버튼
    const quickInquiryBtn = document.getElementById("btn-quick-inquiry");
    if (quickInquiryBtn) {
      quickInquiryBtn.addEventListener("click", () => {
        switchTab("pane-ai");
        showToast("동신이 챗봇에게 문의해보세요!", "💬");
      });
    }
  }

  // 전역 노출 헬퍼 함수
  window.openProgramDetail = openProgramDetailModal;
  window.handleApplySubmit = handleApplySubmit;
  window.cancelApplication = cancelApplication;
  window.toggleBookmark = toggleBookmark;
  window.handleQuizAnswer = handleQuizAnswer;
  window.openFacilityBookingModal = openFacilityBookingModal;
  window.handleFacilityBookingSubmit = handleFacilityBookingSubmit;
  window.openNoticeModal = openNoticeItemModal;

  // ==========================================================================
  // [15] 앱 시동 (App Bootstrap)
  // ==========================================================================
  function initApp() {
    updateHeaderAndUserUI();
    updateLiveClock();
    setInterval(updateLiveClock, 30000);

    Confetti.init();
    initHeroSlider();
    renderHomeComponents();
    renderPrograms();
    initAICoach();
    initRewardExchange();
    renderQuiz();
    renderFacilities();
    bindEventListeners();

    console.log("동신대학교 CTL 공식 스마트 앱 v2.6 초기화 완료");
  }

  // DOM 로드 완료 시 구동
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
