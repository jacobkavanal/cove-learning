import './style.css'
import { createClient } from '@supabase/supabase-js'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Load Turnstile script so the page works even if it's blocked (form still shows)
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

  <!-- Tutor Form Section -->
  <section class="tutor-page">
    <div class="tutor-form-container">
      <div class="tutor-intro">
        <h1 class="tutor-form-title">Tutor with us</h1>
        <p class="tutor-form-subtitle">
          We're looking for passionate educators who love helping students grow.
          Fill out the form below and we'll be in touch.
        </p>
        <div class="tutor-perks">
          <div class="perk">
            <div class="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span>Flexible scheduling</span>
          </div>
          <div class="perk">
            <div class="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span>Competitive pay</span>
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
            <span>Supportive team</span>
          </div>
        </div>
      </div>

      <form class="tutor-form" id="tutor-form">
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
          <label for="school" class="form-label">School</label>
          <input type="text" id="school" name="school" class="form-input" placeholder="UC San Diego, San Diego CC, La Jolla High" required>
        </div>

        <div class="form-group">
          <label for="grad-year" class="form-label">Graduating Year</label>
          <select id="grad-year" name="grad-year" class="form-input form-select" required>
            <option value="" disabled selected>Select year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="graduated">Already graduated</option>
          </select>
        </div>

        <div class="form-group">
          <label for="resume" class="form-label">Resume</label>
          <div class="form-file-wrapper">
            <input type="file" id="resume" name="resume" class="form-file-input" accept=".pdf,.doc,.docx" required>
            <div class="form-file-display">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span id="file-name">Upload PDF or DOC</span>
            </div>
          </div>
        </div>

        <div class="form-group turnstile-wrap" id="turnstile-wrap">
          <div class="cf-turnstile" data-sitekey="${TURNSTILE_SITE_KEY}" id="turnstile-widget"></div>
          <p id="turnstile-fallback" class="form-error turnstile-fallback" role="status" style="display: none;"></p>
        </div>

        <p id="tutor-form-error" class="form-error" role="alert"></p>

        <button type="submit" class="form-submit" id="tutor-submit-btn">
          Submit Application
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

// Load Turnstile after form is in the DOM so the page shows even if script is blocked
loadTurnstileScript()
  .then(() => {})
  .catch(() => {
    const fallback = document.getElementById('turnstile-fallback')
    if (fallback) {
      fallback.style.display = 'block'
      fallback.textContent = 'Verification couldn\'t load. Try disabling ad blockers for this site or check your connection, then reload the page.'
    }
  })

// File input display
const fileInput = document.getElementById('resume') as HTMLInputElement
const fileName = document.getElementById('file-name')
if (fileInput && fileName) {
  fileInput.addEventListener('change', () => {
    fileName.textContent = fileInput.files?.[0]?.name || 'Upload PDF or DOC'
  })
}

// Form submit
const form = document.getElementById('tutor-form') as HTMLFormElement
const errorEl = document.getElementById('tutor-form-error')
const submitBtn = document.getElementById('tutor-submit-btn')

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

    const fileInput = form.querySelector<HTMLInputElement>('#resume')
    const file = fileInput?.files?.[0]
    let resumePath: string | null = null

    if (file && SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        const ext = file.name.split('.').pop() || 'pdf'
        const path = `resumes/${crypto.randomUUID()}_${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('resumes').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })
        if (uploadError) {
          if (errorEl) errorEl.textContent = 'Resume upload failed. Please try again.'
          if (submitBtn) {
            (submitBtn as HTMLButtonElement).disabled = false
            submitBtn.innerHTML = 'Submit Application <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
          }
          return
        }
        resumePath = path
      } catch {
        if (errorEl) errorEl.textContent = 'Resume upload failed. Please try again.'
        if (submitBtn) {
          (submitBtn as HTMLButtonElement).disabled = false
          submitBtn.innerHTML = 'Submit Application <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
        }
        return
      }
    }

    const payload = {
      type: 'tutor',
      turnstileToken: token,
      honeypot: honeypot || undefined,
      name: (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? '',
      email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? '',
      school: (form.querySelector('[name="school"]') as HTMLInputElement)?.value ?? '',
      graduatingYear: (form.querySelector('[name="grad-year"]') as HTMLSelectElement)?.value ?? '',
      resumePath,
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
          submitBtn.innerHTML = 'Submit Application <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
        }
        return
      }

      form.innerHTML = `
        <div class="form-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>Application received!</h3>
          <p>We'll review your info and get back to you soon.</p>
        </div>
      `
    } catch {
      if (errorEl) errorEl.textContent = 'Network error. Please try again.'
      if (submitBtn) {
        (submitBtn as HTMLButtonElement).disabled = false
        submitBtn.innerHTML = 'Submit Application <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      }
    }
  })
}
