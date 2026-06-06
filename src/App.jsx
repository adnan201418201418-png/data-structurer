import { useState, useRef } from 'react'
import './App.css'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

export default function App() {
  const [raw, setRaw] = useState('')
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const toolRef = useRef(null)

  async function convert() {
    if (!raw.trim()) return
    setLoading(true)
    setStatus('Analyzing and structuring your data...')
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
    } catch {
      setStatus('❌ Could not parse. Try rephrasing your data.')
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
    setTimeout(() => setStatus(`✓ ${table.rows.length} records extracted`), 2000)
  }

  function clearAll() {
    setRaw('')
    setTable(null)
    setStatus('')
  }

  return (
    <>
      <nav>
        <div className="logo">⚡ DataStructurer</div>
        <button className="nav-btn" onClick={() => toolRef.current.scrollIntoView({ behavior: 'smooth' })}>
          Try Free
        </button>
      </nav>

      <div className="hero">
        <h1>Turn messy data into<br />clean tables instantly</h1>
        <p>Paste emails, notes, CSVs, or any unstructured text — get a perfectly structured table in seconds.</p>
        <button className="hero-btn" onClick={() => toolRef.current.scrollIntoView({ behavior: 'smooth' })}>
          Try it free →
        </button>
      </div>

      <div className="features">
        {[
          { icon: '🧠', title: 'AI Powered', desc: 'Understands any format — emails, notes, mixed text, broken CSVs.' },
          { icon: '⚡', title: 'Instant Results', desc: 'Get clean structured data in under 3 seconds.' },
          { icon: '📥', title: 'Export Anywhere', desc: 'Download as CSV or copy directly into Excel or Google Sheets.' },
          { icon: '🎯', title: 'Sales & Marketing', desc: 'Perfect for leads, contacts, and campaign data cleanup.' },
        ].map(f => (
          <div className="feature-card" key={f.title}>
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="tool-section" ref={toolRef}>
        <h2>Paste your data below</h2>
        <div className="tool-wrap">
          <div>
            <div className="panel-label">Raw / unstructured input</div>
            <textarea
              value={raw}
              onChange={e => setRaw(e.target.value)}
              placeholder={"Paste anything here — emails, notes, CSV, free text...\n\nExamples:\n• John Smith, john@acme.com, 555-1234, CEO\n• jane doe | Marketing | jane@co.com\nName: Bob | Phone: 555-9876 | Role: Dev"}
            />
            <div className="btn-row">
              <button className="btn-main" onClick={convert} disabled={loading}>
                {loading ? 'Structuring...' : '✨ Structure data'}
              </button>
              <button className="btn-icon" onClick={clearAll}>🗑</button>
            </div>
            <div className="status">{status}</div>
          </div>

          <div>
            <div className="panel-label">
              Structured output
              {table && <span className="badge">{table.rows.length} rows</span>}
            </div>
            <div className="output-box">
              {!table ? (
                <div className="placeholder">
                  <span>🗂</span>
                  <span>Structured table appears here</span>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>{table.headers.map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i}>{table.headers.map((_, j) => <td key={j}>{row[j] || ''}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {table && (
              <div className="btn-row">
                <button className="btn-icon" onClick={copyCSV}>📋 Copy CSV</button>
                <button className="btn-icon" onClick={downloadCSV}>⬇ Download CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer>
        <p>Built with ❤️ — DataStructurer © 2026</p>
      </footer>
    </>
  )
}