import './style.css'
import { supabase } from './lib/supabase'

const app = document.querySelector<HTMLDivElement>('#app')!

// ─── Types ───────────────────────────────────────────────────────
interface Student {
  id: string
  first_name: string
  last_name: string
  grade_level: string | null
  subjects: string[] | null
  customers: { first_name: string; last_name: string; email: string; phone: string | null } | null
}

// ─── Render Login ────────────────────────────────────────────────
function renderLogin(error?: string) {
  app.innerHTML = `
    <nav class="nav">
      <a href="/" class="nav-logo">Cove Learning</a>
      <a href="/" class="nav-contact">Back to Home</a>
    </nav>

    <section class="portal-login">
      <div class="login-card">
        <h1 class="login-title">Tutor Portal</h1>
        <p class="login-subtitle">Sign in to manage your students and sessions.</p>
        ${error ? `<div class="login-error">${error}</div>` : ''}
        <form id="login-form" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-input" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="••••••••" required>
          </div>
          <button type="submit" class="form-submit login-submit">
            Sign In
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <span class="footer-logo">Cove Learning</span>
        <span class="footer-copy">\u00A9 ${new Date().getFullYear()} Cove Learning. All rights reserved.</span>
      </div>
    </footer>
  `

  document.getElementById('login-form')!.addEventListener('submit', handleLogin)
}

async function handleLogin(e: Event) {
  e.preventDefault()
  const email = (document.getElementById('email') as HTMLInputElement).value
  const password = (document.getElementById('password') as HTMLInputElement).value

  const btn = document.querySelector('.login-submit') as HTMLButtonElement
  btn.disabled = true
  btn.textContent = 'Signing in…'

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    renderLogin(error.message)
    return
  }

  renderDashboard()
}

// ─── Render Dashboard ────────────────────────────────────────────
async function renderDashboard() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { renderLogin(); return }

  const { data: tutor } = await supabase
    .from('tutors')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  const tutorName = tutor ? `${tutor.first_name}` : user.email

  const { data: assignments } = await supabase
    .from('tutor_students')
    .select('student_id, students(id, first_name, last_name, grade_level, subjects, customer_id, customers(first_name, last_name, email, phone))')
    .eq('tutor_id', user.id)

  const students: Student[] = (assignments ?? []).map((a: any) => a.students)

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, session_date, duration_hours, subject, notes, students(first_name, last_name)')
    .eq('tutor_id', user.id)
    .order('session_date', { ascending: false })
    .limit(25)

  const totalHours = (sessions ?? []).reduce((sum: number, s: any) => sum + Number(s.duration_hours), 0)

  app.innerHTML = `
    <nav class="nav">
      <a href="/" class="nav-logo">Cove Learning</a>
      <button class="nav-contact" id="logout-btn">Sign Out</button>
    </nav>

    <section class="portal-dashboard">
      <header class="dash-header">
        <div>
          <h1 class="dash-title">Welcome back, ${tutorName}</h1>
          <p class="dash-subtitle">Here's an overview of your students and sessions.</p>
        </div>
      </header>

      <!-- Stats -->
      <div class="dash-stats">
        <div class="stat-card">
          <span class="stat-value">${students.length}</span>
          <span class="stat-label">Active Students</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${(sessions ?? []).length}</span>
          <span class="stat-label">Total Sessions</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${totalHours.toFixed(1)}</span>
          <span class="stat-label">Hours Logged</span>
        </div>
      </div>

      <!-- Log Hours -->
      <div class="dash-section">
        <h2 class="dash-section-title">Log a Session</h2>
        <form id="log-form" class="log-form">
          <div class="log-row">
            <div class="form-group">
              <label for="log-student" class="form-label">Student</label>
              <select id="log-student" class="form-input form-select" required>
                <option value="" disabled selected>Select student</option>
                ${students.map(s => `<option value="${s.id}">${s.first_name} ${s.last_name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="log-subject" class="form-label">Subject</label>
              <input type="text" id="log-subject" class="form-input" placeholder="Math, Reading…" required>
            </div>
          </div>
          <div class="log-row">
            <div class="form-group">
              <label for="log-date" class="form-label">Date</label>
              <input type="date" id="log-date" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="log-hours" class="form-label">Duration (hrs)</label>
              <input type="number" id="log-hours" class="form-input" step="0.25" min="0.25" max="8" placeholder="1.5" required>
            </div>
          </div>
          <div class="form-group">
            <label for="log-notes" class="form-label">Notes (optional)</label>
            <textarea id="log-notes" class="form-input log-notes-input" rows="2" placeholder="What did you cover?"></textarea>
          </div>
          <button type="submit" class="form-submit">
            Log Session
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <div id="log-msg" class="log-msg"></div>
        </form>
      </div>

      <!-- Students -->
      <div class="dash-section">
        <h2 class="dash-section-title">Your Students</h2>
        ${students.length === 0
          ? '<p class="dash-empty">No students assigned yet.</p>'
          : `<div class="students-grid">${students.map(s => `
              <div class="student-card">
                <div class="student-avatar">${s.first_name[0]}${s.last_name[0]}</div>
                <div class="student-info">
                  <span class="student-name">${s.first_name} ${s.last_name}</span>
                  <span class="student-meta">${s.grade_level || 'Grade N/A'}${s.subjects?.length ? ' · ' + s.subjects.join(', ') : ''}</span>
                  ${s.customers ? `<span class="student-parent">Parent: ${s.customers.first_name} ${s.customers.last_name}</span>` : ''}
                </div>
              </div>`).join('')}
            </div>`
        }
      </div>

      <!-- Past Sessions -->
      <div class="dash-section">
        <h2 class="dash-section-title">Recent Sessions</h2>
        ${(sessions ?? []).length === 0
          ? '<p class="dash-empty">No sessions logged yet.</p>'
          : `<div class="sessions-table-wrap">
              <table class="sessions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Hours</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${(sessions ?? []).map((s: any) => `
                    <tr>
                      <td>${new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>${s.students ? s.students.first_name + ' ' + s.students.last_name : '—'}</td>
                      <td>${s.subject}</td>
                      <td>${Number(s.duration_hours).toFixed(1)}</td>
                      <td class="session-notes">${s.notes || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>`
        }
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <span class="footer-logo">Cove Learning</span>
        <span class="footer-copy">\u00A9 ${new Date().getFullYear()} Cove Learning. All rights reserved.</span>
      </div>
    </footer>
  `

  // Logout
  document.getElementById('logout-btn')!.addEventListener('click', async () => {
    await supabase.auth.signOut()
    renderLogin()
  })

  // Default date to today
  const dateInput = document.getElementById('log-date') as HTMLInputElement
  dateInput.valueAsDate = new Date()

  // Log form
  document.getElementById('log-form')!.addEventListener('submit', async (e) => {
    e.preventDefault()
    const msgEl = document.getElementById('log-msg')!

    const studentId = (document.getElementById('log-student') as HTMLSelectElement).value
    const subject = (document.getElementById('log-subject') as HTMLInputElement).value
    const sessionDate = (document.getElementById('log-date') as HTMLInputElement).value
    const durationHours = parseFloat((document.getElementById('log-hours') as HTMLInputElement).value)
    const notes = (document.getElementById('log-notes') as HTMLTextAreaElement).value || null

    const { error } = await supabase.from('sessions').insert({
      tutor_id: user.id,
      student_id: studentId,
      subject,
      session_date: sessionDate,
      duration_hours: durationHours,
      notes,
    })

    if (error) {
      msgEl.textContent = 'Error: ' + error.message
      msgEl.className = 'log-msg log-msg-error'
    } else {
      msgEl.textContent = 'Session logged!'
      msgEl.className = 'log-msg log-msg-success'
      setTimeout(() => renderDashboard(), 1200)
    }
  })
}

// ─── Boot ────────────────────────────────────────────────────────
async function init() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    renderDashboard()
  } else {
    renderLogin()
  }
}

init()
