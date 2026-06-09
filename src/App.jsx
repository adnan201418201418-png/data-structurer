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
    q: 'What is Clario Data Structurer?',
    a: 'Clario is a free online tool that converts unstructured text into structured tables using AI. Paste any messy data — emails, contact lists, CSV fragments, sales leads, or meeting notes — and our AI data formatter instantly organizes it into rows and columns. Export as CSV or copy directly to your clipboard.'
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
    a: 'No! Clario is completely free to use without any signup or account creation. Just paste your data and start structuring immediately.'
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
    q: 'Is Clario free to use?',
    a: 'Yes, Clario is 100% free with no hidden limits. We plan to offer premium features in the future, but the core data structuring tool will always remain free.'
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
    a: 'Clario is used by salespeople building lead lists, recruiters organizing candidate data, marketers cleaning email lists, and anyone who needs to turn raw, unstructured text into a formatted spreadsheet quickly.'
  }
]

export default function App() {
  const [raw, setRaw] = useState('')
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fileInputRef = useRef(null)

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
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">Clario</span>
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
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
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

      {/* ========== MAIN CONTENT ========== */}
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

            {/* Max file notice */}
            <p className="tool-notice">Max file size 1MB. By proceeding, you agree to our <a href="#">Terms of Use</a>.</p>

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

      {/* ========== FOOTER ========== */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-links">
            <a href="#">About Us</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-bottom">
            <div className="footer-logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">Clario</span>
            </div>
            <p className="footer-seo-tag">Free AI data structuring tool — convert unstructured text to structured tables online. Export as CSV.</p>
            <span className="footer-copy">© Clario.com All rights reserved (2026)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}