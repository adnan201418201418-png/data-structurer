import { useState, useRef, useEffect } from 'react'
import './App.css'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

const SAMPLES = {
  'Sales Leads': `John Smith, john@acme.com, CEO, New York, 555-1234
jane doe | Marketing Manager | jane@corp.com | Chicago
Bob - Developer - bob@startup.io - Austin
Alice Green, alice@co.com, Sales Lead, Miami, 555-9876`,
  'Product Data': `iPhone 15 Pro | Apple | $999 | 256GB | Black
Samsung Galaxy S24 - Samsung - $799 - 128GB - White
Google Pixel 8: Google: $699: 128GB: Blue`,
  'Event List': `John attended React Conf 2024 on March 15 in SF
Jane - Vue Summit - April 2 - NYC - Speaker
Bob | Angular Day | May 10 | Chicago | Attendee`,
  'Support Tickets': `[HIGH] Login failing with 500 error on /auth - devon@acme.co (Ticket #1041)
Password reset link not arriving for user sven@nordic.se - Medium - #1042
Low priority - Ticket #1043 - Request to cancel subscription - elena@travel.com`
}

const DEMO_BEFORE = `Hey, I'm devon@acme.co. I run operations here. You can call me at 555-0199.
Send the contract to billing@acme.co.
Also note: Sarah Jenkins (sarah.j@vertex.io) is VP Sales, phone 555-0244.
Marcus from Stripe (marcus@stripe.com, Dev Relations) wants to chat.`

const DEMO_AFTER = {
  headers: ["Name", "Email", "Role", "Phone", "Company"],
  rows: [
    ["Devon", "devon@acme.co", "Operations", "555-0199", "Acme Co"],
    ["Sarah Jenkins", "sarah.j@vertex.io", "VP Sales", "555-0244", "Vertex.io"],
    ["Marcus", "marcus@stripe.com", "Dev Relations", "-", "Stripe"]
  ]
}

export default function App() {
  const [view, setView] = useState('landing') // 'landing' or 'app'
  const [raw, setRaw] = useState('')
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [activeTab, setActiveTab] = useState('Sales Leads')
  
  const fileInputRef = useRef(null)

  // Scroll animations observer
  useEffect(() => {
    if (view !== 'landing') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [view])

  // Spotlight effect coordinates
  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  // Smooth scroll helper
  const scrollToId = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Navigate to landing section from any view
  const handleNavClick = (id) => {
    if (view !== 'landing') {
      setView('landing')
      setTimeout(() => {
        scrollToId(id)
      }, 150)
    } else {
      scrollToId(id)
    }
  }

  // Core convert logic
  async function convert() {
    if (!raw.trim()) return
    setLoading(true)
    setStatus('Analyzing patterns...')
    setStatusType('')
    setTable(null)

    const prompt = `You are a data structuring engine. The user will give you messy, unstructured data in any format.
Your job: extract all structured records and return ONLY a valid JSON object with this exact shape:
{"headers": ["Col1","Col2",...], "rows": [["val","val",...], ...]}
Rules:
- Infer the best column names from context (Name, Email, Phone, Company, Role, etc.)
- Every row must have the same number of values as headers. Use "" for missing fields.
- Clean up formatting: proper casing for names, lowercase emails.
- Return ONLY the JSON. No markdown, no explanation, no backticks.`

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt + `\n\nData to structure:\n${raw}` }],
          temperature: 0.1
        })
      })
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setTable(parsed)
      setStatus(`✓ ${parsed.rows.length} records extracted`)
      setStatusType('success')
    } catch {
      setStatus('Could not parse. Try rephrasing your data.')
      setStatusType('error')
    }
    setLoading(false)
  }

  // File and Clipboard Handlers
  async function handlePasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText()
      setRaw(text)
      setStatus('Pasted from clipboard')
      setStatusType('success')
    } catch (err) {
      setStatus('Unable to read clipboard. Please paste manually.')
      setStatusType('error')
    }
  }

  function triggerFileUpload() {
    fileInputRef.current.click()
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      setRaw(evt.target.result)
      setStatus(`Loaded file: ${file.name}`)
      setStatusType('success')
    }
    reader.readAsText(file)
  }

  function loadSample(key) {
    setActiveTab(key)
    setRaw(SAMPLES[key])
    setTable(null)
    setStatus('')
    setStatusType('')
  }

  function toCSV() {
    if (!table) return ''
    const esc = v => `"${String(v).replace(/"/g, '""')}"`
    return [table.headers, ...table.rows].map(r => r.map(esc).join(',')).join('\n')
  }

  function downloadCSV() {
    const blob = new Blob([toCSV()], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'structured_data.csv'
    a.click()
  }

  function copyCSV() {
    navigator.clipboard.writeText(toCSV())
    setStatus('✓ Copied CSV to clipboard!')
    setStatusType('success')
    setTimeout(() => {
      if (table) {
        setStatus(`✓ ${table.rows.length} records extracted`)
      }
    }, 2000)
  }

  // Demo before/after helpers
  function copyDemoCSV() {
    const esc = v => `"${String(v).replace(/"/g, '""')}"`
    const csvContent = [DEMO_AFTER.headers, ...DEMO_AFTER.rows].map(r => r.map(esc).join(',')).join('\n')
    navigator.clipboard.writeText(csvContent)
    alert('Demo CSV copied to clipboard!')
  }

  function downloadDemoCSV() {
    const esc = v => `"${String(v).replace(/"/g, '""')}"`
    const csvContent = [DEMO_AFTER.headers, ...DEMO_AFTER.rows].map(r => r.map(esc).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'demo_structured_data.csv'
    a.click()
  }

  return (
    <div className="app-wrap">
      {/* Background decoration */}
      <div className="bg-glow">
        <div className="glow-orb orb-purple" />
        <div className="glow-orb orb-blue" />
      </div>

      {/* Sticky Header */}
      <header className="sticky-nav">
        <nav className="nav-container">
          <div className="logo" onClick={() => { setView('landing'); setTimeout(() => scrollToId('hero'), 50); }}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">DataStructurer</span>
          </div>
          <ul className="nav-links">
            <li onClick={() => handleNavClick('features')}>Product</li>
            <li onClick={() => handleNavClick('use-cases')}>Use Cases</li>
            <li onClick={() => handleNavClick('how-it-works')}>How it Works</li>
          </ul>
          {view === 'landing' ? (
            <button className="nav-btn" onClick={() => setView('app')}>
              Try for Free
            </button>
          ) : (
            <button className="nav-btn secondary-nav-btn" onClick={() => setView('landing')}>
              Back to Home
            </button>
          )}
        </nav>
      </header>

      <main className="content-container">
        {view === 'landing' ? (
          <>
            {/* Hero Section */}
            <section id="hero" className="hero-section animate-on-scroll">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                <span>Next-Gen Data Engine</span>
              </div>
              <h1>
                Turn messy text into <br />
                <span className="gradient-text">clean structured data</span>
              </h1>
              <p className="hero-subheading">
                Paste emails, notes, CSVs, lead lists, or any raw text and instantly convert them into organized tables powered by AI.
              </p>

              <div className="trust-badges">
                <span className="badge-item">
                  <span className="badge-check">✔</span> Free Forever
                </span>
                <span className="badge-item">
                  <span className="badge-check">✔</span> No Signup Required
                </span>
                <span className="badge-item">
                  <span className="badge-check">✔</span> CSV Export
                </span>
              </div>

              <div className="hero-ctas">
                <button className="btn-primary animate-btn" onClick={() => setView('app')}>
                  Paste Your Data
                </button>
                <button className="btn-secondary" onClick={() => {
                  setView('app');
                  loadSample('Sales Leads');
                }}>
                  Try Sample
                </button>
              </div>
            </section>

            {/* Before / After Demo Section */}
            <section id="demo" className="demo-section animate-on-scroll">
              <div className="section-title-wrap">
                <span className="section-tag">Interactive Demo</span>
                <h2>Transformation in Action</h2>
              </div>
              <div className="demo-grid">
                {/* Before Card */}
                <div className="demo-card before-card glass-panel" onMouseMove={handleMouseMove}>
                  <div className="card-glow" />
                  <div className="demo-header">
                    <span className="dot red-dot" />
                    <span className="demo-header-title">Before (Messy Text)</span>
                  </div>
                  <div className="demo-body">
                    <pre>{DEMO_BEFORE}</pre>
                    <div className="scanning-line" />
                  </div>
                </div>

                {/* Transition Indicator */}
                <div className="demo-transition-arrow">
                  <div className="arrow-glow">✨</div>
                  <div className="arrow-line">→</div>
                </div>

                {/* After Card */}
                <div className="demo-card after-card glass-panel" onMouseMove={handleMouseMove}>
                  <div className="card-glow" />
                  <div className="demo-header">
                    <span className="dot green-dot" />
                    <span className="demo-header-title">After (Structured Table)</span>
                    <div className="demo-actions">
                      <button className="demo-action-btn" onClick={copyDemoCSV} title="Copy CSV">📋 Copy</button>
                      <button className="demo-action-btn" onClick={downloadDemoCSV} title="Download CSV">⬇ Download</button>
                    </div>
                  </div>
                  <div className="demo-body table-container">
                    <table>
                      <thead>
                        <tr>
                          {DEMO_AFTER.headers.map((h, i) => <th key={i}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_AFTER.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((val, cellIndex) => <td key={cellIndex}>{val}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-section animate-on-scroll">
              <div className="section-title-wrap">
                <span className="section-tag">Process</span>
                <h2>Three Steps to Structured Clarity</h2>
              </div>
              <div className="steps-container">
                <div className="step-card glass-panel" onMouseMove={handleMouseMove}>
                  <div className="card-glow" />
                  <div className="step-num">01</div>
                  <div className="step-icon">📄</div>
                  <h3>Paste or Upload</h3>
                  <p>Paste raw text or upload files.</p>
                </div>
                
                <div className="step-connector">
                  <div className="dotted-line" />
                </div>

                <div className="step-card glass-panel" onMouseMove={handleMouseMove}>
                  <div className="card-glow" />
                  <div className="step-num">02</div>
                  <div className="step-icon">✨</div>
                  <h3>AI Structures It</h3>
                  <p>Automatically detects patterns and organizes data.</p>
                </div>

                <div className="step-connector">
                  <div className="dotted-line" />
                </div>

                <div className="step-card glass-panel" onMouseMove={handleMouseMove}>
                  <div className="card-glow" />
                  <div className="step-num">03</div>
                  <div className="step-icon">⬇</div>
                  <h3>Export Anywhere</h3>
                  <p>Download CSV or copy to Excel, Sheets, or Airtable.</p>
                </div>
              </div>
            </section>

            {/* Feature Cards Section */}
            <section id="features" className="features-section animate-on-scroll">
              <div className="section-title-wrap">
                <span className="section-tag">Key Features</span>
                <h2>Engineered for Modern Operations</h2>
              </div>
              <div className="features-grid">
                {[
                  { icon: '⚡', title: 'Lightning Fast', desc: 'Structure data in under 3 seconds.' },
                  { icon: '🧠', title: 'AI Powered', desc: 'Detects names, emails, phones, and more.' },
                  { icon: '🎁', title: '100% Free', desc: 'No hidden limits.' },
                  { icon: '🔒', title: 'Private & Secure', desc: 'Your data is never stored.' },
                  { icon: '☁', title: 'Export Ready', desc: 'CSV, Excel, Google Sheets compatible.' }
                ].map((f, i) => (
                  <div key={i} className="feature-card glass-panel" onMouseMove={handleMouseMove}>
                    <div className="card-glow" />
                    <div className="feature-card-icon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Use Cases Section */}
            <section id="use-cases" className="usecases-section animate-on-scroll">
              <div className="section-title-wrap">
                <span className="section-tag">Applications</span>
                <h2>Built for Every Workflow</h2>
              </div>
              <div className="usecases-wrapper">
                <div className="usecases-container">
                  {[
                    { title: 'Sales Leads', subtitle: 'Clean messy lead lists' },
                    { title: 'Customer Data', subtitle: 'Organize customer information' },
                    { title: 'Event Registrations', subtitle: 'Structure registration lists' },
                    { title: 'Notes & Emails', subtitle: 'Extract important details' },
                    { title: 'Product Data', subtitle: 'Format product catalogs' }
                  ].map((u, i) => (
                    <div key={i} className="usecase-card glass-panel" onMouseMove={handleMouseMove}>
                      <div className="card-glow" />
                      <div className="usecase-icon-wrapper">
                        <div className="usecase-icon-placeholder" />
                      </div>
                      <h3>{u.title}</h3>
                      <p>{u.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Trust Section */}
            <section id="trust" className="trust-section animate-on-scroll">
              <div className="trust-layout glass-panel" onMouseMove={handleMouseMove}>
                <div className="card-glow" />
                <div className="trust-content">
                  <span className="section-tag">Security & Compliance</span>
                  <h2>Your data stays private</h2>
                  <ul className="trust-checklist">
                    <li>
                      <span className="checklist-bullet">✔</span> We never store your data
                    </li>
                    <li>
                      <span className="checklist-bullet">✔</span> End-to-end processing
                    </li>
                    <li>
                      <span className="checklist-bullet">✔</span> Fast local processing
                    </li>
                    <li>
                      <span className="checklist-bullet">✔</span> Export anytime
                    </li>
                  </ul>
                </div>
                
                <div className="trust-illustration">
                  <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="glowing-lock-svg">
                    <defs>
                      <linearGradient id="lockGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#2DD4FF" stopOpacity="0.8" />
                      </linearGradient>
                      <filter id="blurFilter" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="28" />
                      </filter>
                    </defs>
                    {/* Background radial soft glow */}
                    <circle cx="120" cy="120" r="75" fill="url(#lockGlow)" filter="url(#blurFilter)" opacity="0.35" />
                    {/* Lock Shackle */}
                    <path d="M85 110V75C85 55.67 100.67 40 120 40C139.33 40 155 55.67 155 75V110" stroke="url(#lockGlow)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 1" />
                    <path d="M85 110V75C85 55.67 100.67 40 120 40C139.33 40 155 55.67 155 75V110" stroke="url(#lockGlow)" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
                    <path d="M85 110V75C85 55.67 100.67 40 120 40C139.33 40 155 55.67 155 75V110" stroke="url(#lockGlow)" strokeWidth="4" strokeLinecap="round" />
                    {/* Lock Body */}
                    <rect x="65" y="110" width="110" height="90" rx="20" stroke="url(#lockGlow)" strokeWidth="4" fill="#0B1023" fillOpacity="0.85" />
                    {/* Lock Accents */}
                    <rect x="75" y="120" width="90" height="70" rx="14" stroke="url(#lockGlow)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                    {/* Keyhole */}
                    <circle cx="120" cy="148" r="8" fill="url(#lockGlow)" />
                    <path d="M120 156V172" stroke="url(#lockGlow)" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Try It / Tool Section as another screen */
          <section id="try-it" className="try-section active-tool-screen">
            <div className="tool-title-wrap">
              <span className="tool-tag">AI Data Engine</span>
              <h1 className="tool-main-heading">Convert Your Data <span className="gradient-text">Instantly</span></h1>
              <p className="tool-subtitle">Paste any messy or unstructured text below and let our AI instantly parse, clean, and organize it into a structured table.</p>
            </div>

            <div className="try-layout glass-panel" onMouseMove={handleMouseMove}>
              <div className="card-glow" />
              
              {/* Input Panel */}
              <div className="try-panel input-panel">
                <div className="panel-title-bar">
                  <span>Raw Input Text</span>
                  <span className="char-counter">{raw.length} characters</span>
                </div>
                <div className="textarea-wrapper">
                  <textarea
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    placeholder="Paste your messy text here..."
                  />
                </div>
                <div className="input-actions-bar">
                  <div className="left-actions">
                    <button className="try-action-btn" onClick={handlePasteFromClipboard}>
                      📋 Paste from Clipboard
                    </button>
                    <button className="try-action-btn" onClick={triggerFileUpload}>
                      📤 Upload File
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.csv,.json,.tsv,.text"
                      style={{ display: 'none' }}
                    />
                  </div>
                  <button
                    className="btn-convert-action"
                    onClick={convert}
                    disabled={loading || !raw.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-mini" /> Structuring...
                      </>
                    ) : (
                      '✨ AI Structure'
                    )}
                  </button>
                </div>
              </div>

              {/* Central Animated Arrow */}
              <div className="try-center-arrow">
                <div className={`animated-convert-arrow ${loading ? 'converting' : ''}`}>→</div>
              </div>

              {/* Output Panel */}
              <div className="try-panel output-panel">
                <div className="panel-title-bar">
                  <span>Structured Output</span>
                  {table && <span className="status-extracted">{table.rows.length} rows found</span>}
                </div>
                <div className="output-display">
                  {!table ? (
                    <div className="output-placeholder">
                      <p className="placeholder-primary-text">Your structured data will appear here</p>
                      <p className="placeholder-secondary-text">Paste text or try a sample and click AI Structure</p>
                    </div>
                  ) : (
                    <div className="live-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            {table.headers.map((h, i) => <th key={i}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((val, cellIndex) => <td key={cellIndex}>{val}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                <div className="output-actions-bar">
                  <div className="status-message-box">
                    <span className={`status-tag ${statusType}`}>{status}</span>
                  </div>
                  {table && (
                    <div className="right-actions">
                      <button className="try-action-btn success-action" onClick={copyCSV}>
                        📋 Copy CSV
                      </button>
                      <button className="try-action-btn success-action" onClick={downloadCSV}>
                        ⬇ Export CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <p>Built with ❤️ — <span>DataStructurer</span> © 2026 — Turn any mess into clean data</p>
      </footer>
    </div>
  )
}