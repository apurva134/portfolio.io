/* ==========================================
   APURVA portfolio - CORE LOGIC & INTERACTION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initCustomCursor();
  initMobileMenu();
  initScrollSpy();
  initCaseStudyModal();
  initContactForm();
});

/* ==========================================
   HEADER SCROLL EFFECT
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

/* ==========================================
   CUSTOM INTERACTIVE CURSOR
   ========================================== */
function initCustomCursor() {
  const dot = document.getElementById('customCursorDot');
  const ring = document.getElementById('customCursorRing');
  
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth trailing effect for the cursor ring
  const updateRingPosition = () => {
    const delay = 6; // Lower = faster response
    
    ringX += (mouseX - ringX) / delay;
    ringY += (mouseY - ringY) / delay;
    
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    
    requestAnimationFrame(updateRingPosition);
  };
  
  updateRingPosition();

  // Add hover state triggers
  const interactiveSelector = 'a, button, [role="button"], .project-card, .banking-toggle-btn, input, textarea, select';
  const addHoverEffect = () => {
    dot.classList.add('custom-cursor-hover');
    ring.classList.add('custom-cursor-ring-hover');
  };
  const removeHoverEffect = () => {
    dot.classList.remove('custom-cursor-hover');
    ring.classList.remove('custom-cursor-ring-hover');
  };

  const attachListeners = () => {
    document.querySelectorAll(interactiveSelector).forEach(el => {
      // Avoid duplicate binding
      el.removeEventListener('mouseenter', addHoverEffect);
      el.removeEventListener('mouseleave', removeHoverEffect);
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });
  };

  attachListeners();
  
  // Re-attach listeners on DOM mutations (useful when screen content changes dynamically)
  const observer = new MutationObserver(attachListeners);
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================
   MOBILE NAVIGATION MENU
   ========================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  const toggleMenu = () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  };

  toggle.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

/* ==========================================
   SCROLLSPY ACTIVE NAV HIGHLIGHT
   ========================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    let scrollPos = window.scrollY + 120; // offset header

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll);
}

/* ==========================================
   CASE STUDIES DATABASE & MODAL HANDLER
   ========================================== */
const CASE_STUDIES = {
  'legal-saas': {
    category: 'SaaS Product Design',
    title: 'Simplifying Legal Operations – Case Management SaaS Platform',
    client: 'Legal Conveyancing Management System',
    duration: '14 Months',
    role: 'UI UX Designer',
    industry: 'LegalTech (Property & Conveyancing)',
    overview: 'A role-based SaaS platform designed to streamline legal case workflows, billing, and document management for law firms. The platform simplifies complex legal operations through intuitive dashboards, smart search, financial metrics, and visual analytics.',
    problem: 'Law firms were operating with outdated, fragmented systems. Key pain points included redundant features across tabs, inaccessible workflows for non-admin roles, and a lack of role-specific dashboards or quick insights.',
    research: [
      'Discovery interviews: Visited client UK offices to observe conveyancing solicitors in action.',
      'Usability audits: Discovered system status confusion (users did not know when actions completed) and excessive admin-heavy jargon (like "Entities") which confused associates.',
      'Participated in bi-weekly sprints with iterative design updates, checking technical feasibility with UK/India dev teams.'
    ],
    solutions: [
      'Visibility of System Status: Added clear loading states, success toasts, and indicators for transaction stages.',
      'Real-World Match: Replaced admin jargon with legal-industry terms (Matter, Client, Hearing, Invoice).',
      'User Control & Consistency: Standardized input designs and enabled cancel options, editable form stages, and recognition-based filters.'
    ],
    impact: 'Strategic UX fixes led to fewer user errors, reduced support queries, and significantly faster onboarding timelines for new conveyancing teams.'
  },
  'facility-ops': {
    category: 'Operational Intelligence',
    title: 'Smart Facility Operations System',
    client: 'Hospital Operations Team',
    duration: '6 Months',
    role: 'UI UX designer',
    industry: 'Healthcare Facilities',
    overview: 'Transforming reactive hospital maintenance into a proactive operational intelligence platform. Large hospital facilities rely on disconnected systems to track building infrastructure, inspection logs, and incidents, causing critical coordination delays.',
    problem: 'Most maintenance workflows are reactive and fragmented. Facility managers are forced to manually switch between maintenance logs, location sheets, and technician dispatcher dashboards, increasing operational risks.',
    research: [
      'Conducted interviews with facility managers and hospital administrators to understand critical failure timelines.',
      'Observed dispatch cycles showing that technician assignment based on proximity and skill level was done entirely through manual calls.',
      'Identified critical infrastructure risks (HVAC, power grids, backup generators) where failure notifications were often delayed.'
    ],
    solutions: [
      'Centralized Monitoring: Created an integrated view combining infrastructure health, issue tracking, and dispatch.',
      'Smart Dispatch: Standardized technician coordination workflows with live mapping views and skill-check parameters.',
      'Predictive Insights: Integrated visual indicators showing preventative check statuses and AI-assisted logs.'
    ],
    impact: 'Centralizing building health indicators and automating scheduling patterns reduced coordination blockages and helped technicians respond to critical hospital system failures faster.'
  },
  'smart-banking': {
    isInteractive: true,
    category: 'Adaptive UX Design Case Study',
    title: 'Smart Banking App (Adaptive UX)',
    duration: 'Fintech Case Study',
    role: 'UI/UX Lead Designer',
    industry: 'Fintech / Banking',
    overview: 'Adaptive UX represents a paradigm shift where interfaces dynamically mutate prioritization and information density based on user telemetry. Rather than static layouts, this study maps user telemetry (like repeat balance inquiries or receipt checking) to trigger specialized, distraction-free views.'
  }
};

function initCaseStudyModal() {
  const cards = document.querySelectorAll('.project-card');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const contentArea = document.getElementById('modalContentArea');
  const container = document.getElementById('modalContainer');

  if (!backdrop || !closeBtn || !contentArea) return;

  const openModal = (projectId) => {
    const data = CASE_STUDIES[projectId];
    if (!data) return;

    if (data.isInteractive) {
      // Set container width slightly wider for the side-by-side banking app layout
      container.style.maxWidth = '960px';
      
      // Inject Interactive Banking Demo Shell
      contentArea.innerHTML = `
        <div class="modal-header" style="border-bottom: none; margin-bottom: 12px; padding-bottom: 0;">
          <span class="category">${data.category}</span>
          <h2>${data.title}</h2>
          <div class="modal-meta-row">
            <span>Role: <strong>${data.role}</strong></span>
            <span>Duration: <strong>${data.duration}</strong></span>
            <span>Industry: <strong>${data.industry}</strong></span>
          </div>
        </div>

        <div class="modal-section" style="margin-bottom: 12px;">
          <p>${data.overview}</p>
        </div>

        <!-- Interactive side-by-side container -->
        <div class="banking-demo-layout">
          
          <!-- Trigger Switch Tabs -->
          <div class="banking-toggle-tabs">
            <button class="banking-toggle-btn active" id="btnShowSalary" data-view="salary">
              Scenario A: Waiting for Salary
            </button>
            <button class="banking-toggle-btn" id="btnShowAnxiety" data-view="anxiety">
              Scenario B: Transaction Anxiety
            </button>
          </div>

          <!-- Smartphone Frame -->
          <div class="banking-phone-mockup">
            <div class="phone-screen" id="phoneScreen">
              <!-- Content injected dynamically by tab trigger -->
            </div>
          </div>

          <!-- UX Insights Annotation Panel -->
          <div class="ux-insights-panel" id="uxInsightsPanel">
            <!-- Content injected dynamically by tab trigger -->
          </div>

        </div>
      `;

      // Set up the dynamic toggles
      initBankingDemoInteractivity();
    } else {
      // Standard static project modal rendering
      container.style.maxWidth = '800px';

      const researchHtml = data.research.map(item => `<li>${item}</li>`).join('');
      const solutionsHtml = data.solutions.map(item => `<li>${item}</li>`).join('');

      contentArea.innerHTML = `
        <div class="modal-header">
          <span class="category">${data.category}</span>
          <h2>${data.title}</h2>
          <div class="modal-meta-row">
            <span>Client: <strong>${data.client}</strong></span>
            <span>Role: <strong>${data.role}</strong></span>
            <span>Duration: <strong>${data.duration}</strong></span>
          </div>
        </div>
        
        <div class="modal-section">
          <h4>Context & Overview</h4>
          <p>${data.overview}</p>
        </div>

        <div class="modal-section">
          <h4>The Challenge</h4>
          <p>${data.problem}</p>
        </div>

        <div class="modal-section">
          <h4>User Research & Audits</h4>
          <ul class="modal-bullets">
            ${researchHtml}
          </ul>
        </div>

        <div class="modal-section">
          <h4>Solution Design</h4>
          <ul class="modal-bullets">
            ${solutionsHtml}
          </ul>
        </div>

        <div class="modal-section">
          <div class="modal-metric-box">
            <h5>Project Outcomes & Impact</h5>
            <p>${data.impact}</p>
          </div>
        </div>
      `;
    }

    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeModal = () => {
    backdrop.classList.add('hidden');
    document.body.style.overflow = ''; // Unlock background scrolling
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      openModal(projectId);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================
   BANKING DEMO INTERACTIVE VIEWS
   ========================================== */
function initBankingDemoInteractivity() {
  const tabSalary = document.getElementById('btnShowSalary');
  const tabAnxiety = document.getElementById('btnShowAnxiety');
  const screen = document.getElementById('phoneScreen');
  const insights = document.getElementById('uxInsightsPanel');

  if (!tabSalary || !tabAnxiety || !screen || !insights) return;

  const renderSalaryView = () => {
    // 1. Render expected salary mockup screen
    screen.innerHTML = `
      <div class="notch"></div>
      <div class="phone-notch-bar">
        <span>9:41 AM</span>
        <span>📶 🔋 100%</span>
      </div>
      
      <div class="phone-app-header">
        <h5>TrustBank Mobile</h5>
        <span style="font-size: 14px;">🔔</span>
      </div>

      <!-- Contextual banner message (Strict text requested) -->
      <div class="adaptive-contextual-banner">
        We thought this information might be helpful based on your recent activity.
      </div>

      <!-- Expected Salary tracker card -->
      <div class="phone-card">
        <div class="salary-tracker-pill">Expected Salary Tracker</div>
        <p class="salary-countdown-text">Payout Expected in <strong>2 Days</strong></p>
        <div class="salary-amount-large">$3,250.00</div>
        <div class="salary-verif-pill">Status: Verified by Employer Ledger</div>
      </div>

      <!-- Upcoming payments stack -->
      <div>
        <div class="stack-title">Upcoming Payments</div>
        <div class="payment-stack-list">
          
          <div class="payment-stack-item">
            <div class="payment-icon-detail">
              <span class="pay-icon">⚡</span>
              <div>
                <p class="pay-name">Electricity Bill</p>
                <p class="pay-due">Due: Jun 24</p>
              </div>
            </div>
            <span class="pay-value">$112.50</span>
          </div>

          <div class="payment-stack-item">
            <div class="payment-icon-detail">
              <span class="pay-icon">🌐</span>
              <div>
                <p class="pay-name">Internet Utility</p>
                <p class="pay-due">Due: Jun 25</p>
              </div>
            </div>
            <span class="pay-value">$60.00</span>
          </div>

          <div class="payment-stack-item">
            <div class="payment-icon-detail">
              <span class="pay-icon">🏠</span>
              <div>
                <p class="pay-name">Home EMI Payment</p>
                <p class="pay-due">Auto-debit: Jun 28</p>
              </div>
            </div>
            <span class="pay-value">$850.00</span>
          </div>

        </div>
      </div>

      <!-- Recent Balance activities -->
      <div class="phone-card" style="margin-top: auto; padding: 10px 14px;">
        <div class="stack-title" style="margin-bottom: 6px;">Recent Balance Activity</div>
        <div class="activity-item">
          <span class="activity-name">Available Funds</span>
          <span class="activity-balance">$420.75</span>
        </div>
      </div>
    `;

    // 2. Render insights panel
    insights.innerHTML = `
      <div class="ux-insights-header">
        <h5>UX Case Study Insights</h5>
      </div>
      
      <div class="insights-list">
        <div class="insight-item">
          <span class="insight-label">Telemetry Input</span>
          <span class="insight-value">Checked balance <strong>18 times today</strong>, transactions checked <strong>7 times</strong> near the 28th of the month.</span>
        </div>
        
        <div class="insight-item">
          <span class="insight-label">Inferred User Intent</span>
          <span class="insight-value">Anxiously waiting for the payroll direct deposit.</span>
        </div>

        <div class="insight-item">
          <span class="insight-label">Intent Confidence</span>
          <span class="insight-value-highlight">87%</span>
        </div>

        <div class="insight-item">
          <span class="insight-label">Interface Adaptation</span>
          <span class="insight-value">Prioritizes expected salary countdown. Hides standard credit card and loan promo banners to reduce cognitive clutter.</span>
        </div>
      </div>

      <div class="insight-footer-note">
        Adaptive rule: Mutates view order based on frequency metrics and date proximity.
      </div>
    `;
  };

  const renderAnxietyView = () => {
    // 1. Render transaction status tracker mockup screen
    screen.innerHTML = `
      <div class="notch"></div>
      <div class="phone-notch-bar">
        <span>9:41 AM</span>
        <span>📶 🔋 100%</span>
      </div>
      
      <div class="phone-app-header">
        <h5>TrustBank Mobile</h5>
        <span style="font-size: 14px;">🔔</span>
      </div>

      <!-- Contextual banner message (Strict text requested) -->
      <div class="adaptive-contextual-banner">
        We noticed you've been tracking this transaction. Here's the latest status.
      </div>

      <!-- Status Tracker Card -->
      <div class="phone-card">
        <span class="tracker-badge-warning">Processing Transfer</span>
        <div class="tracker-title">Recipient Verification</div>
        
        <div class="tracker-recip-row">
          <div class="recip-avatar">AT</div>
          <div>
            <p style="font-size: 13px; font-weight: 700;">Apurva Tadas</p>
            <p style="font-size: 10px; color: var(--fintech-text-muted);">Ref ID: TXN8924108</p>
          </div>
          <span style="margin-left: auto;" class="recip-amount-large">$1,500.00</span>
        </div>

        <!-- Visual progress bar steps -->
        <div class="progress-bar-steps">
          <div class="progress-bar-steps-fill"></div>
          <span class="p-step completed" title="Sent"></span>
          <span class="p-step active" title="Processing"></span>
          <span class="p-step" title="Cleared"></span>
        </div>

        <p class="tracker-copy-alert">
          Payment is being processed by the receiving bank. Expected completion within 2 hours.
        </p>
      </div>

      <!-- Actionable support shortcuts -->
      <div class="banking-action-shortcuts">
        <button class="banking-shortcut-btn">
          <span>Contact Support Hotline</span>
          <span class="arrow-indicator">&rarr;</span>
        </button>
        <button class="banking-shortcut-btn">
          <span>Raise Transaction Dispute</span>
          <span class="arrow-indicator">&rarr;</span>
        </button>
        <button class="banking-shortcut-btn">
          <span>View Metadata Details</span>
          <span class="arrow-indicator">&rarr;</span>
        </button>
      </div>
    `;

    // 2. Render insights panel
    insights.innerHTML = `
      <div class="ux-insights-header">
        <h5>UX Case Study Insights</h5>
      </div>
      
      <div class="insights-list">
        <div class="insight-item">
          <span class="insight-label">Telemetry Input</span>
          <span class="insight-value">Same transaction opened <strong>12 times today</strong>, support accessed <strong>twice</strong> in 20 minutes after large transfer.</span>
        </div>
        
        <div class="insight-item">
          <span class="insight-label">Inferred User Intent</span>
          <span class="insight-value">Anxiety regarding whether a critical transfer has failed or gone to the wrong account.</span>
        </div>

        <div class="insight-item">
          <span class="insight-label">Intent Confidence</span>
          <span class="insight-value-highlight">92%</span>
        </div>

        <div class="insight-item">
          <span class="insight-label">Interface Adaptation</span>
          <span class="insight-value">Hides marketing updates and investment upsells. Surfaces live tracking status bar and support shortcuts at the very top.</span>
        </div>
      </div>

      <div class="insight-footer-note">
        Adaptive rule: Surfaces troubleshooting pipelines directly in path of repeat inquiries.
      </div>
    `;
  };

  // Toggle button actions
  tabSalary.addEventListener('click', () => {
    tabSalary.classList.add('active');
    tabAnxiety.classList.remove('active');
    renderSalaryView();
  });

  tabAnxiety.addEventListener('click', () => {
    tabAnxiety.classList.add('active');
    tabSalary.classList.remove('active');
    renderAnxietyView();
  });

  // Render Scenario A initially
  renderSalaryView();
}

/* ==========================================
   CONTACT FORM HANDLER
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  
  if (!form || !successMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Loading State
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';
    
    // Simulate API Post latency
    setTimeout(() => {
      form.classList.add('hidden');
      successMsg.classList.remove('hidden');
      form.reset();
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 5000);
      
    }, 1200);
  });
}
