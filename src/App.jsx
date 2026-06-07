import { useState, useRef } from 'react'
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
}

export default function App() {
  const [raw, setRaw] = useState('')
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const toolRef = useRef(null)

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
- Return ONLY the JSON. No markdown, no explanation, no backticks.

Data to structure:
${raw}`

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
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
      setStatus(`✓ ${table.rows.length} records extracted`)
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

  return (
    <div className="app-wrap">
      {/* Animated background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Nav */}
      <nav>
        <div className="logo">
          <div className="logo-icon">⚡</div>
          DataStructurer
        </div>
        <div className="nav-badge">AI Powered</div>
        <button className="nav-btn" onClick={() => toolRef.current.scrollIntoView({ behavior: 'smooth' })}>
          Try Free →
        </button>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">
          <div className="hero-eyebrow-dot" />
          Next-Gen Data Engine
        </div>
        <h1>
          Turn chaos into<br />
          <span className="gradient-text">clean structured data</span>
        </h1>
        <p>
          Paste emails, notes, CSVs, or any messy text — our AI instantly extracts and organizes it into a perfect table. No formulas, no manual work.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => toolRef.current.scrollIntoView({ behavior: 'smooth' })}>
            ✨ Try it free
          </button>
          <button className="btn-secondary" onClick={() => toolRef.current.scrollIntoView({ behavior: 'smooth' })}>
            See examples ↓
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { num: 'Any', label: 'Input Format' },
          { num: '<3s', label: 'Processing Time' },
          { num: '100%', label: 'Free to Use' },
          { num: 'CSV', label: 'Export Ready' },
        ].map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="features">
        {[
          { icon: '🧠', title: 'AI Powered', desc: 'Understands any format — emails, notes, mixed text, broken CSVs.' },
          { icon: '⚡', title: 'Instant Results', desc: 'Clean structured data in under 3 seconds.' },
          { icon: '📥', title: 'Export Anywhere', desc: 'Download CSV or copy directly into Excel or Google Sheets.' },
          { icon: '🎯', title: 'Sales & Marketing', desc: 'Perfect for leads, contacts, and campaign data cleanup.' },
        ].map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Tool */}
      <div className="tool-section" ref={toolRef}>
        <div className="section-header">
          <h2>Paste your data below</h2>
          <p>Works with any format — we figure out the structure for you</p>
        </div>

        {/* Sample buttons */}
        <div className="sample-btns">
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', alignSelf: 'center' }}>Try sample:</span>
          {Object.keys(SAMPLES).map(key => (
            <button key={key} className="sample-btn" onClick={() => loadSample(key)}>
              {key}
            </button>
          ))}
        </div>

        <div className="tool-wrap">
          {/* Input panel */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-label">
                <div className="panel-label-dot" />
                Raw / Unstructured Input
              </div>
            </div>
            <div className="glass-box">
              <div className="glass-inner">
                <textarea
                  value={raw}
                  onChange={e => setRaw(e.target.value)}
                  placeholder={"Paste anything here — emails, notes, CSV, free text...\n\nExample:\n• John Smith, john@acme.com, CEO\n• jane | Marketing | jane@co.com\nName: Bob | Role: Dev | Phone: 555-9876"}
                  onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') convert() }}
                />
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-convert" onClick={convert} disabled={loading}>
                {loading ? <><span className="spinner" /> Structuring...</> : '✨ Structure data'}
              </button>
              <button className="btn-icon" onClick={clearAll} title="Clear">🗑</button>
            </div>
            <div className={`status-bar ${statusType === 'success' ? 'status-success' : statusType === 'error' ? 'status-error' : ''}`}>
              {status && <span>{status}</span>}
              {!status && <span style={{color:'var(--muted)', fontSize:'0.72rem'}}>Ctrl+Enter to convert</span>}
            </div>
          </div>

          {/* Divider arrow */}
          <div className="tool-divider">
            <div className="divider-arrow">→</div>
          </div>

          {/* Output panel */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-label">
                <div className="panel-label-dot" style={{background:'var(--cyan)'}} />
                Structured Output
              </div>
              {table && <span className="badge">{table.rows.length} rows</span>}
            </div>

            <div className={`output-box ${table ? 'has-data' : ''}`}>
              {!table ? (
                <div className="placeholder">
                  <div className="placeholder-icon">🗂</div>
                  <p>Structured table appears here</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>{table.headers.map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, i) => (
                        <tr key={i}>
                          {table.headers.map((_, j) => <td key={j}>{row[j] || ''}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {table && (
              <div className="btn-row">
                <button className="btn-icon" onClick={copyCSV}>📋 Copy CSV</button>
                <button className="btn-icon" onClick={downloadCSV}>⬇ Download</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>Built with ❤️ — <span>DataStructurer</span> © 2026 — Turn any mess into clean data</p>
      </footer>
    </div>
  )
}