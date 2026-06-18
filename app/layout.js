'use client'
import './globals.css'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [playing, setPlaying] = useState(false)

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <title>⚽ Porra Mundial 2026</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}

        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem',
        }}>
          {playing && (
            <audio src="/bso.mp3" autoPlay loop style={{ display: 'none' }} />
          )}
          <button
            onClick={() => setPlaying(p => !p)}
            title={playing ? 'Parar música' : 'Reproducir BSO Mundial'}
            style={{
              width: '3rem', height: '3rem',
              borderRadius: '50%',
              background: playing ? 'linear-gradient(135deg, #c8a84b, #f5d76e)' : 'rgba(0,0,0,0.7)',
              border: '2px solid #c8a84b',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: playing ? '0 0 12px #c8a84b88' : 'none',
              transition: 'all 0.2s',
            }}>
            {playing ? '⏸' : '▶️'}
          </button>
          {playing && (
            <div style={{
              background: 'rgba(0,0,0,0.8)', border: '1px solid #c8a84b44',
              borderRadius: '0.5rem', padding: '0.3rem 0.6rem',
              color: '#c8a84b', fontSize: '0.65rem', fontFamily: 'Georgia, serif',
              whiteSpace: 'nowrap',
            }}>
              🎵 BSO Mundial 2026
            </div>
          )}
        </div>
      </body>
    </html>
  )
}