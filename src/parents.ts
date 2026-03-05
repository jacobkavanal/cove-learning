import './style.css'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

function loadTurnstileScript(): Promise<void> {
  if (document.querySelector('script[src*="turnstile"]')) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Turnstile script failed to load'))
    document.head.appendChild(s)
  })
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <!-- Navigation -->
  <nav class="nav">
    <a href="/" class="nav-logo">Cove Learning</a>
    <a href="/" class="nav-contact">Back to Home</a>
  </nav>

  <!-- Parent Form Section -->
  <section class="tutor-page">
    <div class="tutor-form-container">
      <div class="tutor-intro">
        <h1 class="tutor-form-title">Let's get started</h1>
        <p class="tutor-form-subtitle">
          Tell us a little about your family and we'll match your student with the right tutor.
        </p>
        <div class="tutor-perks">
          <div class="perk">
            <div class="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span>Free initial consultation</span>
          </div>
          <div class="perk">
            <div class="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span>Personalized tutor matching</span>
          </div>
          <div class="perk">
            <div class="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span>Flexible scheduling</span>
          </div>
        </div>
      </div>

      <form class="tutor-form" id="parent-form">
        <div class="form-group honeypot" aria-hidden="true">
          <label for="website">Website</label>
          <input type="text" id="website" name="website" class="form-input" tabindex="-1" autocomplete="off">
        </div>

        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input type="text" id="name" name="name" class="form-input" placeholder="Jane Smith" required>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input type="email" id="email" name="email" class="form-input" placeholder="jane@example.com" required>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Phone Number</label>
          <input type="tel" id="phone" name="phone" class="form-input" placeholder="(555) 123-4567" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="zip" class="form-label">Zip Code</label>
            <input type="text" id="zip" name="zip" class="form-input" placeholder="92093" maxlength="10" required>
          </div>

          <div class="form-group">
            <label for="num-students" class="form-label"># of Students</label>
            <select id="num-students" name="num-students" class="form-input form-select" required>
              <option value="" disabled selected>Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4+">4+</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="relationship" class="form-label">Relationship to Student</label>
          <select id="relationship" name="relationship" class="form-input form-select" required>
            <option value="" disabled selected>Select relationship</option>
            <option value="parent">Parent</option>
            <option value="guardian">Guardian</option>
            <option value="grandparent">Grandparent</option>
            <option value="sibling">Sibling</option>
            <option value="self">Self (I'm the student)</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group turnstile-wrap" id="turnstile-wrap">
          <div class="cf-turnstile" data-sitekey="${TURNSTILE_SITE_KEY}"></div>
          <p id="turnstile-fallback" class="form-error turnstile-fallback" role="status" style="display: none;"></p>
        </div>

        <p id="parent-form-error" class="form-error" role="alert"></p>

        <button type="submit" class="form-submit" id="parent-submit-btn">
          Request Consultation
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
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

loadTurnstileScript().catch(() => {
  const fallback = document.getElementById('turnstile-fallback')
  if (fallback) {
    fallback.style.display = 'block'
    fallback.textContent = 'Verification couldn\'t load. Try disabling ad blockers or check your connection, then reload the page.'
  }
})

// Form submit
const form = document.getElementById('parent-form') as HTMLFormElement
const errorEl = document.getElementById('parent-form-error')
const submitBtn = document.getElementById('parent-submit-btn')

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (errorEl) errorEl.textContent = ''

    const honeypot = (form.querySelector('[name="website"]') as HTMLInputElement)?.value
    if (honeypot && honeypot.trim() !== '') {
      return
    }

    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]') as HTMLTextAreaElement
    const token = turnstileResponse?.value
    if (!token) {
      if (errorEl) {
        const fallback = document.getElementById('turnstile-fallback')
        errorEl.textContent = fallback?.style.display === 'block'
          ? 'Verification couldn\'t load. Please reload the page (and try without ad blockers).'
          : 'Please complete the verification check.'
      }
      return
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      if (errorEl) errorEl.textContent = 'Form is not configured. Please try again later.'
      return
    }

    if (submitBtn) {
      (submitBtn as HTMLButtonElement).disabled = true
      submitBtn.textContent = 'Submitting…'
    }

    const payload = {
      type: 'parent',
      turnstileToken: token,
      honeypot: honeypot || undefined,
      name: (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? '',
      email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? '',
      phone: (form.querySelector('[name="phone"]') as HTMLInputElement)?.value ?? '',
      zip: (form.querySelector('[name="zip"]') as HTMLInputElement)?.value ?? '',
      numStudents: (form.querySelector('[name="num-students"]') as HTMLSelectElement)?.value ?? '',
      relationship: (form.querySelector('[name="relationship"]') as HTMLSelectElement)?.value ?? '',
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (errorEl) errorEl.textContent = data?.error || 'Something went wrong. Please try again.'
        if (submitBtn) {
          (submitBtn as HTMLButtonElement).disabled = false
          submitBtn.innerHTML = 'Request Consultation <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
        }
        return
      }

      form.innerHTML = `
        <div class="form-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>We've got your info!</h3>
          <p>We'll reach out shortly to schedule your free consultation.</p>
        </div>
      `
    } catch {
      if (errorEl) errorEl.textContent = 'Network error. Please try again.'
      if (submitBtn) {
        (submitBtn as HTMLButtonElement).disabled = false
        submitBtn.innerHTML = 'Request Consultation <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      }
    }
  })
}
