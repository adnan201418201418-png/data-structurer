import { useState, useRef } from 'react'
import './App.css'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

const SAMPLES = {
  'Sales Lead List': `John Smith, john@acme.com, CEO, New York, 555-1234
jane doe | Marketing Manager | jane@corp.com | Chicago
Bob - Developer - bob@startup.io - Austin
Alice Green, alice@co.com, Sales Lead, Miami, 555-9876`,
  'Contact List': `iPhone 15 Pro | Apple | $999 | 256GB | Black
Samsung Galaxy S24 - Samsung - $799 - 128GB - White
Google Pixel 8: Google: $699: 128GB: Blue`,
  'Event Registrations': `John attended React Conf 2024 on March 15 in SF
Jane - Vue Summit - April 2 - NYC - Speaker
Bob | Angular Day | May 10 | Chicago | Attendee`,
}

const FAQ_DATA = [
  {
    q: 'What is ConvertGrids Data Structurer?',
    a: 'ConvertGrids is a free online tool that converts unstructured text into structured tables using AI. Paste any messy data — emails, contact lists, CSV fragments, sales leads, or meeting notes — and our AI data formatter instantly organizes it into rows and columns. Export as CSV or copy directly to your clipboard.'
  },
  {
    q: 'What types of data can I structure?',
    a: 'You can structure virtually any text-based data: email threads, contact lists, sales leads, product catalogs, event registrations, support tickets, meeting notes, CSV fragments, and more. If it has a repeating pattern, our AI can find it.'
  },
  {
    q: 'Is my data safe and private?',
    a: 'Yes. Your data is processed in real-time using encrypted SSL/TLS connections and is never stored on our servers. Once you close the page, your data is permanently gone. No account, no tracking, no data retention.'
  },
  {
    q: 'Do I need to create an account?',
    a: 'No! ConvertGrids is completely free to use without any signup or account creation. Just paste your data and start structuring immediately.'
  },
  {
    q: 'What export formats are supported?',
    a: 'Currently, you can export your structured data as CSV — which is compatible with Microsoft Excel, Google Sheets, Airtable, and virtually any spreadsheet or database application.'
  },
  {
    q: 'How accurate is the AI structuring?',
    a: 'Our AI is powered by advanced large language models that achieve high accuracy on most common data formats. For best results, ensure your input data has at least 2-3 records so the AI can detect patterns reliably.'
  },
  {
    q: 'Is ConvertGrids free to use?',
    a: 'Yes, ConvertGrids is 100% free with no hidden limits. We plan to offer premium features in the future, but the core data structuring tool will always remain free.'
  },
  {
    q: 'Can I convert emails to a spreadsheet table?',
    a: 'Yes. Paste your email threads or contact information directly into the tool. Our AI automatically extracts names, email addresses, phone numbers, companies, and roles — then formats everything into a clean spreadsheet table you can download as CSV.'
  },
  {
    q: 'How do I clean and structure messy CSV data?',
    a: 'Simply paste your messy or incomplete CSV into the text box. Our AI data cleaner detects your column patterns and reformats the data into a properly structured table — even if the original format is inconsistent.'
  },
  {
    q: 'Who is this tool for?',
    a: 'ConvertGrids is used by salespeople building lead lists, recruiters organizing candidate data, marketers cleaning email lists, and anyone who needs to turn raw, unstructured text into a formatted spreadsheet quickly.'
  }
]


/* ==========================================================
   ABOUT PAGE
   ========================================================== */
function AboutPage({ onNavigate }) {
  return (
    <div className="content-page">
      <div className="content-page-inner">
        <button className="back-link" onClick={() => onNavigate('home')}>← Back to Home</button>

        <h1 className="page-title">About ConvertGrids</h1>
        <p className="page-intro">
          We're on a mission to make data conversion effortless. ConvertGrids is a free, AI-powered tool that transforms messy, unstructured text into clean, structured tables — in seconds.
        </p>

        <section className="page-section">
          <h2>Our Mission</h2>
          <p>
            Every day, millions of people waste hours manually formatting data — copying from emails, cleaning up CSV files, organizing contact lists. We believe this work should be instant. ConvertGrids was built to eliminate the tedious process of data formatting, so you can focus on what actually matters.
          </p>
        </section>

        <section className="page-section">
          <h2>What We Do</h2>
          <p>
            ConvertGrids uses advanced AI models to analyze any messy text you throw at it — emails, meeting notes, sales leads, CSV fragments, contact lists — and automatically organizes it into a clean, structured table. You can then export your data as a CSV file, ready to import into Excel, Google Sheets, your CRM, or any database.
          </p>
          <p>
            No signup required. No data stored. No hidden fees. Just paste, structure, and export.
          </p>
        </section>

        <section className="page-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Simplicity</h3>
              <p>No complicated interfaces or learning curves. Paste your data, click one button, and get structured results instantly.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your data is never stored on our servers. Everything is processed in real-time and discarded immediately. Zero tracking, zero data retention.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Speed</h3>
              <p>Our AI processes your data in seconds, not minutes. Get structured, export-ready tables faster than any manual method.</p>
            </div>
          </div>
        </section>

        <section className="page-section">
          <h2>Our Technology</h2>
          <p>
            ConvertGrids is powered by state-of-the-art large language models (LLMs) that can understand and extract patterns from virtually any text format. Whether your data uses commas, pipes, tabs, colons, or natural language — our AI figures out the structure and organizes it into clean rows and columns.
          </p>
          <p>
            All data processing happens over encrypted SSL/TLS connections. We don't log, store, or share any of the data you paste into our tool. Your privacy is our top priority.
          </p>
        </section>
      </div>
    </div>
  )
}


/* ==========================================================
   PRIVACY POLICY PAGE
   ========================================================== */
function PrivacyPage({ onNavigate }) {
  return (
    <div className="content-page">
      <div className="content-page-inner">
        <button className="back-link" onClick={() => onNavigate('home')}>← Back to Home</button>

        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-intro">
          Last updated: June 2026. Your privacy is critically important to us. This Privacy Policy explains how ConvertGrids handles your information.
        </p>

        <section className="page-section">
          <h2>1. Information We Collect</h2>
          <p>
            <strong>ConvertGrids does not collect, store, or retain any personal data.</strong> When you paste text into our tool, it is sent directly to our AI processing service for structuring and is immediately discarded after the results are returned to your browser.
          </p>
          <p>We do not require you to:</p>
          <ul>
            <li>Create an account</li>
            <li>Provide your name, email, or any personal information</li>
            <li>Accept tracking cookies</li>
          </ul>
        </section>

        <section className="page-section">
          <h2>2. How We Process Your Data</h2>
          <p>
            When you click "Structure Data," your text is sent to a third-party AI service (Groq) via an encrypted SSL/TLS connection. The AI model processes your text, extracts structured data, and returns the results. Your original text is not stored by ConvertGrids or logged in any database.
          </p>
        </section>

        <section className="page-section">
          <h2>3. Data Storage & Security</h2>
          <p>
            We implement industry-standard security measures to protect your data during transit:
          </p>
          <ul>
            <li><strong>SSL/TLS Encryption:</strong> All data transmitted between your browser and our service is encrypted.</li>
            <li><strong>No Server-Side Storage:</strong> Your data is processed in real-time and never written to any database or file system.</li>
            <li><strong>Session Isolation:</strong> Each user session is completely independent. Closing your browser tab permanently removes all data from memory.</li>
          </ul>
        </section>

        <section className="page-section">
          <h2>4. Cookies & Tracking</h2>
          <p>
            ConvertGrids uses only essential <strong>localStorage</strong> to remember your theme preference (dark/light mode). We do not use analytics cookies, advertising trackers, or any third-party tracking scripts. We do not track your browsing behavior.
          </p>
        </section>

        <section className="page-section">
          <h2>5. Third-Party Services</h2>
          <p>
            We use the following third-party services:
          </p>
          <ul>
            <li><strong>Groq API:</strong> For AI-powered data structuring. Groq processes your text in real-time and does not retain user data.</li>
            <li><strong>Google Fonts:</strong> For typography (Inter and Space Grotesk). Google may collect anonymous usage statistics.</li>
            <li><strong>Vercel:</strong> For website hosting and deployment.</li>
          </ul>
        </section>

        <section className="page-section">
          <h2>6. Your Rights</h2>
          <p>
            Since we do not collect or store any personal data, there is no personal information to access, modify, or delete. You have complete control over your data at all times — it exists only in your browser while you use the tool.
          </p>
        </section>

        <section className="page-section">
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </section>
      </div>
    </div>
  )
}


/* ==========================================================
   TERMS OF SERVICE PAGE
   ========================================================== */
function TermsPage({ onNavigate }) {
  return (
    <div className="content-page">
      <div className="content-page-inner">
        <button className="back-link" onClick={() => onNavigate('home')}>← Back to Home</button>

        <h1 className="page-title">Terms of Service</h1>
        <p className="page-intro">
          Last updated: June 2026. Please read these Terms of Service carefully before using ConvertGrids.
        </p>

        <section className="page-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using ConvertGrids ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.
          </p>
        </section>

        <section className="page-section">
          <h2>2. Description of Service</h2>
          <p>
            ConvertGrids is a free, AI-powered online tool that converts unstructured text data into structured tables. The Service allows users to paste text, process it using artificial intelligence, and export the results as CSV files. The Service is provided "as is" and "as available."
          </p>
        </section>

        <section className="page-section">
          <h2>3. User Responsibilities</h2>
          <p>When using ConvertGrids, you agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes and in accordance with these Terms.</li>
            <li>Not submit any data that is illegal, harmful, threatening, abusive, or violates any applicable laws.</li>
            <li>Not attempt to interfere with, compromise, or disrupt the Service or its infrastructure.</li>
            <li>Not use automated tools, bots, or scripts to access the Service in a manner that exceeds reasonable usage.</li>
            <li>Take responsibility for the accuracy and legality of the data you submit.</li>
          </ul>
        </section>

        <section className="page-section">
          <h2>4. Intellectual Property</h2>
          <p>
            The ConvertGrids name, logo, design, and all associated content are the intellectual property of ConvertGrids. You may not reproduce, distribute, or create derivative works without prior written permission.
          </p>
          <p>
            You retain full ownership of any data you submit to and receive from the Service. We do not claim any rights over your input or output data.
          </p>
        </section>

        <section className="page-section">
          <h2>5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. We do not guarantee that:
          </p>
          <ul>
            <li>The Service will be uninterrupted, error-free, or secure at all times.</li>
            <li>The AI-generated structured data will be 100% accurate or complete.</li>
            <li>The Service will meet your specific requirements or expectations.</li>
          </ul>
          <p>
            You acknowledge that AI processing may occasionally produce inaccurate results, and you are responsible for reviewing and verifying the output.
          </p>
        </section>

        <section className="page-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, ConvertGrids and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, profits, or business opportunities, arising from your use of or inability to use the Service.
          </p>
        </section>

        <section className="page-section">
          <h2>7. Modifications to Service & Terms</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice. We may also update these Terms of Service from time to time. Continued use of the Service after any changes constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section className="page-section">
          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ConvertGrids operates, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </div>
  )
}


/* ==========================================================
   MAIN APP COMPONENT
   ========================================================== */
export default function App() {
  const [raw, setRaw] = useState('')
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('convertgrids-theme')
      return saved ? saved === 'dark' : true
    } catch {
      return true
    }
  })
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const fileInputRef = useRef(null)

  // --- Theme toggle with persistence ---
  function toggleTheme() {
    setDarkMode(prev => {
      const next = !prev
      try { localStorage.setItem('convertgrids-theme', next ? 'dark' : 'light') } catch {}
      return next
    })
  }

  // --- Page navigation ---
  function navigateTo(page) {
    setCurrentPage(page)
    setMobileMenuOpen(false)
    setOpenDropdown(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- Core AI convert ---
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

  // --- Helpers ---
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
    setStatus('✓ Copied to clipboard!')
    setStatusType('success')
    setTimeout(() => {
      if (table) setStatus(`✓ ${table.rows.length} records extracted`)
    }, 2000)
  }

  function clearAll() {
    setRaw('')
    setTable(null)
    setStatus('')
    setStatusType('')
  }

  function loadSample(key) {
    setRaw(SAMPLES[key])
    setTable(null)
    setStatus('')
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setRaw(text)
      setStatus('Pasted from clipboard')
      setStatusType('success')
    } catch {
      setStatus('Unable to read clipboard. Please paste manually.')
      setStatusType('error')
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      setRaw(evt.target.result)
      setStatus(`Loaded: ${file.name}`)
      setStatusType('success')
    }
    reader.readAsText(file)
  }

  function toggleDropdown(name) {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <div className={`app-root ${darkMode ? 'dark' : 'light'}`} onClick={() => { setOpenDropdown(null); setMobileMenuOpen(false); }}>

      {/* ========== NAVIGATION ========== */}
      <nav className="top-nav">
        <div className="nav-inner">
          <div className="nav-logo-wrap">
            <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">⚡</span>
              <span className="logo-text">ConvertGrids</span>
            </div>
          </div>

          <div className="nav-menu">
            {/* Convert Dropdown */}
            <div className="nav-dropdown-wrap" onClick={e => { e.stopPropagation(); toggleDropdown('convert') }}>
              <span className={`nav-link ${openDropdown === 'convert' ? 'open' : ''}`}>Convert <span className="chevron">▾</span></span>
              {openDropdown === 'convert' && (
                <div className="dropdown-panel">
                  <div className="dropdown-item active-item">
                    <span className="dropdown-icon">📊</span>
                    <div>
                      <div className="dropdown-title">Data Structurer</div>
                      <div className="dropdown-desc">Convert messy text to tables</div>
                    </div>
                  </div>
                  <div className="dropdown-item coming-soon">
                    <span className="dropdown-icon">📄</span>
                    <div>
                      <div className="dropdown-title">CSV Formatter</div>
                      <div className="dropdown-desc">Coming Soon</div>
                    </div>
                  </div>
                  <div className="dropdown-item coming-soon">
                    <span className="dropdown-icon">🔄</span>
                    <div>
                      <div className="dropdown-title">JSON Converter</div>
                      <div className="dropdown-desc">Coming Soon</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compress Dropdown */}
            <div className="nav-dropdown-wrap" onClick={e => { e.stopPropagation(); toggleDropdown('compress') }}>
              <span className={`nav-link ${openDropdown === 'compress' ? 'open' : ''}`}>Compress <span className="chevron">▾</span></span>
              {openDropdown === 'compress' && (
                <div className="dropdown-panel">
                  <div className="dropdown-item coming-soon">
                    <span className="dropdown-icon">🗜️</span>
                    <div>
                      <div className="dropdown-title">Data Compressor</div>
                      <div className="dropdown-desc">Coming Soon</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="nav-dropdown-wrap" onClick={e => { e.stopPropagation(); toggleDropdown('tools') }}>
              <span className={`nav-link ${openDropdown === 'tools' ? 'open' : ''}`}>Tools <span className="chevron">▾</span></span>
              {openDropdown === 'tools' && (
                <div className="dropdown-panel">
                  <div className="dropdown-item active-item">
                    <span className="dropdown-icon">🧠</span>
                    <div>
                      <div className="dropdown-title">AI Data Structurer</div>
                      <div className="dropdown-desc">Structure any messy data</div>
                    </div>
                  </div>
                  <div className="dropdown-item coming-soon">
                    <span className="dropdown-icon">✨</span>
                    <div>
                      <div className="dropdown-title">AI Summarizer</div>
                      <div className="dropdown-desc">Coming Soon</div>
                    </div>
                  </div>
                  <div className="dropdown-item coming-soon">
                    <span className="dropdown-icon">🔍</span>
                    <div>
                      <div className="dropdown-title">AI Data Extractor</div>
                      <div className="dropdown-desc">Coming Soon</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="nav-right">
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Hamburger Button */}
            <button
              className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
              title="Toggle menu"
            >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            {/* Convert Dropdown */}
            <div className="mobile-menu-item-wrap">
              <div className="mobile-menu-header" onClick={() => toggleDropdown('convert')}>
                <span>Convert</span>
                <span className={`chevron ${openDropdown === 'convert' ? 'open' : ''}`}>▾</span>
              </div>
              {openDropdown === 'convert' && (
                <div className="mobile-submenu">
                  <div className="mobile-submenu-item active-item" onClick={() => { setMobileMenuOpen(false); setOpenDropdown(null); }}>
                    <span>📊 Data Structurer</span>
                  </div>
                  <div className="mobile-submenu-item coming-soon">
                    <span>📄 CSV Formatter (Soon)</span>
                  </div>
                  <div className="mobile-submenu-item coming-soon">
                    <span>🔄 JSON Converter (Soon)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Compress Dropdown */}
            <div className="mobile-menu-item-wrap">
              <div className="mobile-menu-header" onClick={() => toggleDropdown('compress')}>
                <span>Compress</span>
                <span className={`chevron ${openDropdown === 'compress' ? 'open' : ''}`}>▾</span>
              </div>
              {openDropdown === 'compress' && (
                <div className="mobile-submenu">
                  <div className="mobile-submenu-item coming-soon">
                    <span>🗜️ Data Compressor (Soon)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="mobile-menu-item-wrap">
              <div className="mobile-menu-header" onClick={() => toggleDropdown('tools')}>
                <span>Tools</span>
                <span className={`chevron ${openDropdown === 'tools' ? 'open' : ''}`}>▾</span>
              </div>
              {openDropdown === 'tools' && (
                <div className="mobile-submenu">
                  <div className="mobile-submenu-item active-item" onClick={() => { setMobileMenuOpen(false); setOpenDropdown(null); }}>
                    <span>🧠 AI Data Structurer</span>
                  </div>
                  <div className="mobile-submenu-item coming-soon">
                    <span>✨ AI Summarizer (Soon)</span>
                  </div>
                  <div className="mobile-submenu-item coming-soon">
                    <span>🔍 AI Data Extractor (Soon)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ========== PAGE CONTENT ========== */}
      {currentPage === 'home' ? (
        <main className="main-content">

          {/* --- Tool Hero Title --- */}
          <div className="tool-hero">
            <h1 className="tool-title">Data Structurer</h1>
            <p className="tool-subtitle">Free AI tool to convert messy text, emails, and CSVs into clean, structured tables — instantly.</p>
          </div>

          {/* --- 3-Column: Ad | All Content | Ad --- */}
          <div className="tool-layout-3col">

            {/* Left Ad */}
            <aside className="ad-column ad-left">
              <div className="ad-placeholder">
                <span className="ad-label">Advertisement</span>
                <div className="ad-mock-content">
                  <div className="ad-mock-line long" />
                  <div className="ad-mock-line short" />
                  <div className="ad-mock-line medium" />
                  <div className="ad-mock-btn">Learn More</div>
                </div>
              </div>
            </aside>

            {/* Center — ALL content sections */}
            <div className="center-column">

              {/* Horizontal Ad Banner above tool */}
              <div className="horizontal-ad">
                <span className="ad-label">Advertisement</span>
                <div className="horizontal-ad-content">
                  <div className="ad-mock-line long" />
                  <div className="ad-mock-line medium" />
                  <div className="ad-mock-btn">Learn More</div>
                </div>
              </div>

              {/* Sample Buttons */}
              <div className="sample-row">
                <span className="sample-label">Try sample:</span>
                {Object.keys(SAMPLES).map(key => (
                  <button key={key} className="sample-btn" onClick={() => loadSample(key)}>
                    {key}
                  </button>
                ))}
              </div>

              {/* Tool Card */}
              <div className="tool-card">
                {/* Input Area */}
                <div className="tool-input-area">
                  <textarea
                    value={raw}
                    onChange={e => setRaw(e.target.value)}
                    placeholder={"Paste unstructured data here — emails, contact lists, sales leads, CSV fragments, meeting notes, free text...\n\nExample:\n• John Smith, john@acme.com, CEO\n• jane | Marketing | jane@co.com\nName: Bob | Role: Dev | Phone: 555-9876"}
                    onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') convert() }}
                  />
                </div>

                {/* Action Bar */}
                <div className="tool-action-bar">
                  <div className="tool-actions-left">
                    <button className="tool-sm-btn" onClick={handlePaste}>📋 Paste</button>
                    <button className="tool-sm-btn" onClick={() => fileInputRef.current.click()}>📤 Upload</button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.csv,.json,.tsv"
                      style={{ display: 'none' }}
                    />
                    <button className="tool-sm-btn" onClick={clearAll}>🗑 Clear</button>
                  </div>
                  <button className="tool-convert-btn" onClick={convert} disabled={loading || !raw.trim()}>
                    {loading ? <><span className="spinner" /> Structuring...</> : '✨ Structure Data'}
                  </button>
                </div>

                {/* Status */}
                <div className={`tool-status ${statusType}`}>
                  {status || 'Ctrl+Enter to convert'}
                </div>
              </div>

              {/* Output Table */}
              {table && (
                <div className="output-card">
                  <div className="output-header">
                    <span className="output-label">Structured Output</span>
                    <span className="output-count">{table.rows.length} rows</span>
                  </div>
                  <div className="output-table-wrap">
                    <table>
                      <thead>
                        <tr>{table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((val, j) => <td key={j}>{val || ''}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="output-actions">
                    <button className="tool-sm-btn success" onClick={copyCSV}>📋 Copy CSV</button>
                    <button className="tool-sm-btn success" onClick={downloadCSV}>⬇ Download CSV</button>
                  </div>
                </div>
              )}



              {/* ========== HOW TO CONVERT ========== */}
              <section className="how-section">
                <h2 className="section-title">How to Structure Data?</h2>
                <div className="how-steps">
                  <div className="how-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Paste your data</h3>
                      <p>Click the text area or use <strong>"Paste"</strong> button to add your raw unstructured data — works with emails, contact lists, sales leads, CSV fragments, or any free text.</p>
                    </div>
                  </div>
                  <div className="how-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Click "Structure Data"</h3>
                      <p>Our AI parses and extracts names, emails, phone numbers, roles, and more — then organizes your unstructured text into a clean, structured table automatically.</p>
                    </div>
                  </div>
                  <div className="how-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Export your results</h3>
                      <p>Click <strong>"Copy CSV"</strong> to copy your structured data to clipboard, or <strong>"Download"</strong> to save as a CSV spreadsheet file — ready to import into Excel, Google Sheets, or your CRM.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========== FEATURE HIGHLIGHTS ========== */}
              <section className="highlights-section">
                <div className="highlights-grid">
                  <div className="highlight-card">
                    <div className="highlight-icon">📊</div>
                    <h3>Convert Any Unstructured Text</h3>
                    <p>Convert emails, notes, CSVs, lead lists, and contact lists into structured tables. Our AI data cleaner handles any messy text format — no manual formatting needed.</p>
                  </div>
                  <div className="highlight-card">
                    <div className="highlight-icon">🧠</div>
                    <h3>AI-Powered Text to Table Converter</h3>
                    <p>Our AI text parser detects names, emails, phone numbers, roles, and more — then structures them into rows and columns with high accuracy.</p>
                  </div>
                  <div className="highlight-card">
                    <div className="highlight-icon">🛡️</div>
                    <h3>Free & Secure</h3>
                    <p>Our free data structuring tool works on any browser. Your data is never stored — processed in real-time and deleted once you close the page.</p>
                  </div>
                </div>
              </section>

              {/* ========== FAQ ========== */}
              <section className="faq-section">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-list">
                  {FAQ_DATA.map((item, i) => (
                    <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                      <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <span>{item.q}</span>
                        <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
                      </button>
                      {openFaq === i && (
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ========== DATA SAFETY ========== */}
              <section className="safety-section">
                <div className="safety-inner">
                  <div className="safety-text">
                    <h2>Your Data is Safe — Here's How We Protect It</h2>
                    <p>When you use our free data structuring tool, your privacy is guaranteed. We use SSL/TLS encryption, process all data in real-time without storing it, and require zero account creation. Your unstructured text is converted to a structured table and immediately discarded — never logged, never sold.</p>
                  </div>
                  <div className="safety-badges">
                    <div className="safety-badge">
                      <span className="safety-badge-icon">🔒</span>
                      <div>
                        <strong>SSL/TLS Encryption</strong>
                      </div>
                    </div>
                    <div className="safety-badge">
                      <span className="safety-badge-icon">🛡️</span>
                      <div>
                        <strong>Secured Data Processing</strong>
                      </div>
                    </div>
                    <div className="safety-badge">
                      <span className="safety-badge-icon">🔑</span>
                      <div>
                        <strong>Access Control and Authentication</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Ad */}
            <aside className="ad-column ad-right">
              <div className="ad-placeholder">
                <span className="ad-label">Advertisement</span>
                <div className="ad-mock-content">
                  <div className="ad-mock-line long" />
                  <div className="ad-mock-line short" />
                  <div className="ad-mock-line medium" />
                  <div className="ad-mock-btn">Learn More</div>
                </div>
              </div>
            </aside>
          </div>

        </main>
      ) : currentPage === 'about' ? (
        <AboutPage onNavigate={navigateTo} />
      ) : currentPage === 'privacy' ? (
        <PrivacyPage onNavigate={navigateTo} />
      ) : currentPage === 'terms' ? (
        <TermsPage onNavigate={navigateTo} />
      ) : null}

      {/* ========== FOOTER ========== */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms</a>
          </div>
          <div className="footer-bottom">
            <div className="footer-logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">⚡</span>
              <span className="logo-text">ConvertGrids</span>
            </div>
            <p className="footer-seo-tag">Free AI data structuring tool — convert unstructured text to structured tables online. Export as CSV.</p>
            <span className="footer-copy">© ConvertGrids.com All rights reserved (2026)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}