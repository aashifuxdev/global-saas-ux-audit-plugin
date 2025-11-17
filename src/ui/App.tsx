import React, { useState, useEffect } from 'react'

export default function App() {
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('Select a frame and click Run Audit')

  useEffect(() => {
    window.onmessage = (event) => {
      const msg = (event as any).data.pluginMessage
      if (!msg) return
      if (msg.type === 'audit-results') {
        setResults(msg.data)
        setStatus(`${msg.data.length} frame(s) analyzed`)
      }
      if (msg.type === 'no-selection') {
        setStatus('No frames selected')
        setResults([])
      }
    }
  }, [])

  const runAudit = () => {
    parent.postMessage({ pluginMessage: { type: 'run-audit' } }, '*')
  }

  return (
    <div style={{ padding: 16, fontFamily: 'Inter, sans-serif', width: 420 }}>
      <h3>Global SaaS UX Audit</h3>
      <button onClick={runAudit}>Run Audit</button>
      <p>{status}</p>
      {results.map((r: any) => (
        <div key={r.id} style={{ border: '1px solid #eee', marginTop: 8, padding: 8 }}>
          <strong>{r.name}</strong> — Score: {r.score.toFixed(1)} / 5
          <ul>
            {Object.entries(r.heuristics).map(([k, v]: any) => (
              <li key={k}><b>{k}:</b> {v}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
