import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <!-- Navigation -->
  <nav class="nav">
    <a href="#" class="nav-logo">Cove Learning</a>
    <button class="nav-contact" onclick="document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })">
      Contact Us
    </button>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title"><span id="typed-text"></span><span class="cursor">|</span></h1>
      <p class="hero-subtitle">
        Personalized tutoring for students who want to do more. Build confidence and achieve your academic goals.
      </p>
      <button class="hero-cta" onclick="document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })">
        Get Started
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
    <div class="hero-image">
      <div class="hero-blob-main">
        <img src="/images/hero-main.png" alt="Happy student" class="hero-student">
      </div>
      <div class="hero-orb hero-orb-sm"></div>
      <div class="hero-orb hero-orb-outline"></div>
      <div class="hero-orb hero-orb-dot"></div>
    </div>
  </section>

  <!-- Divider -->
  <div class="divider">
    <div class="divider-line"></div>
  </div>

  <!-- About Section -->
  <section class="about">
    <span class="about-label">Our Mission</span>
    <div class="about-content">
      <h2>We meet students where they are</h2>
      <p>
        Cove Learning was founded in UC San Diego's Geisel library on a simple belief: 
        that every young student deserves the same guidance and resources that made all the difference for us.

        We're driven by the idea that no student should navigate their academic journey alone.
        By pairing students with dedicated mentors and proven learning strategies, we create an environment 
        where we can not only reinforce academic concepts, but hone the skill of learning itself.
      </p>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="how-it-works">
    <div class="how-header">
      <span class="how-label">The Process</span>
      <h2 class="how-title">How does it work?</h2>
    </div>
    <div class="how-steps">
      <div class="how-step">
        <div class="step-number">1</div>
        <h3 class="step-title">Schedule a consultation</h3>
        <p class="step-desc">Reach out to us and we'll set up a free call to discuss your goals and learning needs.</p>
      </div>
      <div class="how-step">
        <div class="step-number">2</div>
        <h3 class="step-title">Get matched with a tutor</h3>
        <p class="step-desc">We'll pair you with the perfect tutor based on subject, learning style, and availability.</p>
      </div>
      <div class="how-step">
        <div class="step-number">3</div>
        <h3 class="step-title">Start learning</h3>
        <p class="step-desc">Begin personalized sessions online or in-person and watch your confidence grow.</p>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="services">
    <div class="services-header">
      <span class="services-label">What We Offer</span>
      <h2 class="services-title">Tailored support for every learner</h2>
    </div>
    <div class="services-grid">
      <div class="service-card">
        <div class="service-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <h3 class="service-title">College & Test Prep</h3>
        <p class="service-desc">Personalized mentoring for long-term academic and career success alongside college application guidance. We help students navigate their surrounding resources, build real-world skills, and reach their full potential. </p>
      </div>
      <div class="service-card">
        <div class="service-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="8" y1="7" x2="16" y2="7"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <h3 class="service-title">K-12 Academic Tutoring</h3>
        <p class="service-desc">From foundational reading and math to advanced high school coursework. We meet students where they are and build lasting understanding across all subjects. We also help students navigate their surrounding resources, build real-world skills, and reach their full academic potential.</p>
      </div>
      <div class="service-card">
        <div class="service-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <polyline points="7 8 10 11 7 14"/>
            <line x1="13" y1="14" x2="17" y2="14"/>
          </svg>
        </div>
        <h3 class="service-title">Digital & Tech Skills</h3>
        <p class="service-desc">Programming fundamentals, digital literacy, and responsible AI fluency for a world where these skills are no longer optional. Prepare for a future where knowing how to think alongside AI is just as important as knowing how to think for yourself.</p>
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section class="team">
    <div class="team-header">
      <span class="team-label">Meet Your Tutors</span>
      <h2 class="team-title">Dedicated educators committed to your success</h2>
    </div>
    <div class="team-panels">
      <div class="team-panel panel-left">
        <div class="panel-image">
          <div class="panel-image-placeholder">R</div>
        </div>
        <div class="panel-content">
          <h3 class="panel-name">Ryan</h3>
          <p class="panel-role">Co-Founder & Lead Tutor</p>
          <p class="panel-bio">
            Ryan has been tutoring students across various subjects since middle school. 
            Beyond helping students master their current coursework, he is deeply committed 
            to developing their fundamental study skills and teaching them how to learn effectively. 
            He strives to provide a patient, encouraging environment that helps students overcome 
            immediate challenges and build their lifelong academic confidence.
          </p>
        </div>
      </div>
      <div class="team-panel panel-right">
        <div class="panel-content">
          <h3 class="panel-name">Jacob</h3>
          <p class="panel-role">Co-Founder & Lead Tutor</p>
          <p class="panel-bio">
            Jacob has taught, managed, and created coding enrichment programs for K-8 students since 2022. 
            As a lifelong student currently navigating university-level data science himself, he has firsthand 
            experience with the struggles that come with unfamiliar concepts. His personal goal with Cove Learning 
            is to provide guidance and personalized support so that any student can build the confidence to tackle 
            these challenges head-on.
          </p>
        </div>
        <div class="panel-image">
          <div class="panel-image-placeholder">J</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="contact" id="contact">
    <div class="contact-grid">
      <div class="contact-column">
        <p class="contact-eyebrow">Get Started</p>
        <h2 class="contact-title">Ready to learn?</h2>
        <p class="contact-subtitle">
          Reach out today to schedule a free consultation and discover how we can help.
        </p>
        <button class="contact-btn" onclick="window.location.href='/parents/'">
          Get Started
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <div class="contact-divider"></div>
      <div class="contact-column">
        <p class="contact-eyebrow">Join Our Team</p>
        <h2 class="contact-title">Want to tutor with us?</h2>
        <p class="contact-subtitle">
          We're always looking for passionate educators to join our team.
        </p>
        <button class="contact-btn contact-btn-outline" onclick="window.location.href='/tutors/'">
          Interest Form
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <span class="footer-logo">Cove Learning</span>
      <span class="footer-copy">© ${new Date().getFullYear()} Cove Learning. All rights reserved.</span>
    </div>
  </footer>
`

// Smooth scroll for navigation
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()
    const href = anchor.getAttribute('href')
    if (href) {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })
})

// Typing effect for hero title
const slogans = [
  "Unlock your potential",
  "Learn without limits",
  "Achieve your goals",
  "Build confidence",
  "Master any subject"
]

const typedTextElement = document.getElementById('typed-text')
let sloganIndex = 0
let charIndex = 0
let isDeleting = false
let typingSpeed = 80

function typeEffect() {
  if (!typedTextElement) return
  
  const currentSlogan = slogans[sloganIndex]
  
  if (isDeleting) {
    typedTextElement.textContent = currentSlogan.substring(0, charIndex - 1)
    charIndex--
    typingSpeed = 40
  } else {
    typedTextElement.textContent = currentSlogan.substring(0, charIndex + 1)
    charIndex++
    typingSpeed = 80
  }
  
  if (!isDeleting && charIndex === currentSlogan.length) {
    // Pause at end of word
    typingSpeed = 2500
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    sloganIndex = (sloganIndex + 1) % slogans.length
    typingSpeed = 400
  }
  
  setTimeout(typeEffect, typingSpeed)
}

// Start typing effect
typeEffect()

// Scroll animations for How It Works section
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, observerOptions)

document.querySelectorAll('.how-step').forEach(step => {
  observer.observe(step)
})

// Observe about section
const aboutContent = document.querySelector('.about-content')
if (aboutContent) {
  observer.observe(aboutContent)
}

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
  observer.observe(card)
})

// Observe team panels
document.querySelectorAll('.team-panel').forEach(panel => {
  observer.observe(panel)
})

// Hero entrance + mouse parallax
const blobMain = document.querySelector('.hero-blob-main') as HTMLElement
const orbs = document.querySelectorAll<HTMLElement>('.hero-orb')
const parallaxEls = [blobMain, ...Array.from(orbs)]
const speeds = [8, 20, 28, 16]

// Trigger entrance
requestAnimationFrame(() => {
  blobMain?.classList.add('entered')
  orbs.forEach(orb => orb.classList.add('entered'))
})

// After entrance settles, enable smooth mouse tracking via CSS vars
let mx = 0, my = 0, tx = 0, ty = 0

document.addEventListener('mousemove', (e) => {
  tx = (e.clientX / window.innerWidth - 0.5) * 2
  ty = (e.clientY / window.innerHeight - 0.5) * 2
})

function tick() {
  mx += (tx - mx) * 0.08
  my += (ty - my) * 0.08

  parallaxEls.forEach((el, i) => {
    if (!el) return
    const s = speeds[i] ?? 12
    el.style.setProperty('--mx', `${mx * s}px`)
    el.style.setProperty('--my', `${my * s}px`)
  })
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
