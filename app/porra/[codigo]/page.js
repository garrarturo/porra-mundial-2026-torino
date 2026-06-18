'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { generarDieciseisavos, getClasificados } from '../../../lib/torneo'

import { GRUPOS, PREMIOS, TODOS_EQUIPOS, CODIGOS_PAIS } from '../../../lib/data'
import { getTodos, getPorteros, getJovenes } from '../../../lib/jugadores'

function Bandera({ equipo, size = 16 }) {
  const codigo = CODIGOS_PAIS[equipo]
  if (!codigo) return null
  return (
    <img
      src={`https://flagcdn.com/${size}x${Math.round(size * 0.75)}/${codigo}.png`}
      alt={equipo}
      style={{ width: size, height: Math.round(size * 0.75), objectFit: 'cover', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }}
    />
  )
}

const GRUPOS_KEYS = Object.keys(GRUPOS)
const TOTAL_PASOS = GRUPOS_KEYS.length + 1 + 4 + 1 // 12 grupos + terceros + 4 rondas + premios

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
    color: '#fff',
    padding: '1rem',
  },
  card: {
    maxWidth: '640px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #c8a84b44',
    borderRadius: '1rem',
    padding: '2rem',
  },
  titulo: { color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.25rem' },
  subtitulo: { color: '#ffffff66', fontFamily: 'Georgia, serif', fontSize: '0.9rem', marginBottom: '1.5rem' },
  btn: (disabled) => ({
    padding: '0.75rem 2rem',
    background: disabled ? '#333' : 'linear-gradient(90deg, #c8a84b, #f5d76e)',
    border: 'none', borderRadius: '0.5rem',
    color: disabled ? '#666' : '#0a0a0a',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em',
  }),
  equipoBtn: (sel) => ({
    padding: '0.6rem 1rem',
    background: sel ? '#c8a84b' : 'rgba(255,255,255,0.06)',
    border: `1px solid ${sel ? '#c8a84b' : '#ffffff22'}`,
    borderRadius: '0.5rem', color: sel ? '#0a0a0a' : '#fff',
    cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '0.85rem',
    transition: 'all 0.15s', textAlign: 'left',
  }),
}

export default function PorraPage() {
  const { codigo } = useParams()
  const [participante, setParticipante] = useState(null)
  const [paso, setPaso] = useState(0)
  const [porra, setPorra] = useState({})
  const [loading, setLoading] = useState(true)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('participantes').select('*').eq('codigo', codigo).single()
      if (!data) { setError('Código no válido. Contacta con el organizador.') }
      else if (data.porra_enviada) {
        setEnviado(true); setParticipante(data)
        const { data: rows } = await supabase.from('porras').select('*').eq('participante_id', data.id)
        const p = {}; if (rows) rows.forEach(r => { p[r.clave] = r.valor }); setPorra(p)
      } else { setParticipante(data) }
      setLoading(false)
    }
    cargar()
  }, [codigo])

  function setVal(clave, valor) { setPorra(prev => ({ ...prev, [clave]: valor })) }

  async function enviarPorra() {
    setGuardando(true)
    const rows = Object.entries(porra).filter(([,v]) => v).map(([clave, valor]) => ({
      participante_id: participante.id,
      clave, valor,
    }))
    await supabase.from('porras').insert(rows)
    await supabase.from('participantes').update({ porra_enviada: true }).eq('id', participante.id)
    setEnviado(true); setGuardando(false)
  }

  if (loading) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#c8a84b' }}>Cargando...</div>
  if (error) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={s.card}><p style={{ color: '#f87171', fontFamily: 'Georgia, serif' }}>{error}</p></div></div>

  if (enviado) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem' }}>🎉</div>
            <h2 style={s.titulo}>¡PORRA ENVIADA!</h2>
            <p style={{ fontFamily: 'Georgia, serif', color: '#ffffff88', lineHeight: 1.6 }}>
              Tu porra está registrada, <strong style={{ color: '#c8a84b' }}>{participante?.nombre}</strong>.
            </p>
            <a href="/" style={{ ...s.btn(false), display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>VER CLASIFICACIÓN</a>
          </div>
        </div>
      </div>
    )
  }

  const porcentaje = Math.round((paso / TOTAL_PASOS) * 100)

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ ...s.titulo, fontSize: '1.5rem', marginBottom: '0.25rem' }}>PORRA MUNDIAL 2026</h1>
          <p style={{ fontFamily: 'Georgia, serif', color: '#c8a84b', fontSize: '0.9rem', margin: 0 }}>
            Hola, <strong>{participante?.nombre}</strong>
          </p>
        </div>
        <div style={{ height: '4px', background: '#ffffff11', borderRadius: '2px', marginBottom: '0.5rem' }}>
          <div style={{ height: '100%', width: `${porcentaje}%`, background: 'linear-gradient(90deg, #c8a84b, #f5d76e)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.75rem', color: '#ffffff44', marginBottom: '1.5rem' }}>
          Paso {paso + 1} de {TOTAL_PASOS} · {porcentaje}% completado
        </p>

        {/* GRUPOS A-L */}
        {paso < GRUPOS_KEYS.length && (
          <PasoGrupo grupo={GRUPOS_KEYS[paso]} equipos={GRUPOS[GRUPOS_KEYS[paso]]}
            porra={porra} setVal={setVal}
            onNext={() => setPaso(p => p + 1)}
            onPrev={paso > 0 ? () => setPaso(p => p - 1) : null} />
        )}

        {/* TERCEROS */}
        {paso === GRUPOS_KEYS.length && (
          <PasoTerceros porra={porra} setVal={setVal}
            onNext={() => setPaso(p => p + 1)}
            onPrev={() => setPaso(p => p - 1)} />
        )}

        {/* DIECISEISAVOS */}
        {paso === GRUPOS_KEYS.length + 1 && (
          <PasoCuadro titulo="DIECISEISAVOS DE FINAL" ronda="dec"
            partidos={generarDieciseisavos(porra) || []}
            porra={porra} setVal={setVal}
            claveGanador={(i) => `dec_${i}`}
            onNext={() => setPaso(p => p + 1)}
            onPrev={() => setPaso(p => p - 1)} />
        )}

        {/* OCTAVOS */}
        {paso === GRUPOS_KEYS.length + 2 && (
          <PasoCuadro titulo="OCTAVOS DE FINAL" ronda="oct"
            partidos={generarOctavos(porra)}
            porra={porra} setVal={setVal}
            claveGanador={(i) => `oct_${i}`}
            onNext={() => setPaso(p => p + 1)}
            onPrev={() => setPaso(p => p - 1)} />
        )}

        {/* CUARTOS */}
        {paso === GRUPOS_KEYS.length + 3 && (
          <PasoCuadro titulo="CUARTOS DE FINAL" ronda="cua"
            partidos={generarCuartos(porra)}
            porra={porra} setVal={setVal}
            claveGanador={(i) => `cua_${i}`}
            onNext={() => setPaso(p => p + 1)}
            onPrev={() => setPaso(p => p - 1)} />
        )}

        {/* SEMIS + FINAL */}
        {paso === GRUPOS_KEYS.length + 4 && (
          <PasoSemisFinal porra={porra} setVal={setVal}
            onNext={() => setPaso(p => p + 1)}
            onPrev={() => setPaso(p => p - 1)} />
        )}

        {/* PREMIOS */}
        {paso === GRUPOS_KEYS.length + 5 && (
          <PasoPremios porra={porra} setVal={setVal}
            onEnviar={enviarPorra}
            onPrev={() => setPaso(p => p - 1)}
            guardando={guardando} />
        )}
      </div>
    </div>
  )
}

// Genera octavos a partir de los ganadores de dieciseisavos
function generarOctavos(porra) {
  const partidos = []
  // Los 8 partidos de octavos: ganadores de dieciseisavos enfrentados por parejas
  // Lado izquierdo: dec_0 vs dec_1, dec_2 vs dec_3, dec_4 vs dec_5, dec_6 vs dec_7
  // Lado derecho: dec_8 vs dec_9, dec_10 vs dec_11, dec_12 vs dec_13, dec_14 vs dec_15
  const pares = [[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15]]
  for (const [a, b] of pares) {
    partidos.push([porra[`dec_${a}`] || null, porra[`dec_${b}`] || null])
  }
  return partidos
}

// Genera cuartos a partir de los ganadores de octavos
function generarCuartos(porra) {
  const pares = [[0,1],[2,3],[4,5],[6,7]]
  return pares.map(([a, b]) => [porra[`oct_${a}`] || null, porra[`oct_${b}`] || null])
}

// Genera semis a partir de los ganadores de cuartos
function generarSemis(porra) {
  return [
    [porra['cua_0'] || null, porra['cua_1'] || null],
    [porra['cua_2'] || null, porra['cua_3'] || null],
  ]
}

// ─── COMPONENTES ───────────────────────────────────────────

function PasoGrupo({ grupo, equipos, porra, setVal, onNext, onPrev }) {
  const sel1 = porra[`grupo_${grupo}_1`]
  const sel2 = porra[`grupo_${grupo}_2`]
  const sel3 = porra[`grupo_${grupo}_3`]

  function seleccionar(equipo, puesto) {
    const otros = [sel1, sel2, sel3].filter((_, i) => i !== puesto - 1)
    if (otros.includes(equipo)) return
    setVal(`grupo_${grupo}_${puesto}`, equipo)
  }

  const completo = sel1 && sel2 && sel3
  return (
    <div>
      <h2 style={s.titulo}>GRUPO {grupo}</h2>
      <p style={s.subtitulo}>Ordena los equipos del 1º al 3º clasificado</p>
      {[1, 2, 3].map(puesto => {
        const selActual = porra[`grupo_${grupo}_${puesto}`]
        return (
          <div key={puesto} style={{ marginBottom: '1.25rem' }}>
            <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{puesto}º clasificado</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {equipos.map(equipo => {
                const ocupado = [sel1, sel2, sel3].filter((_, i) => i !== puesto - 1).includes(equipo)
                return (
                  <button key={equipo} style={{ ...s.equipoBtn(selActual === equipo), opacity: ocupado ? 0.3 : 1 }}
                    onClick={() => !ocupado && seleccionar(equipo, puesto)} disabled={ocupado}>
                    <Bandera equipo={equipo} />{equipo}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        {onPrev && <button style={s.btn(false)} onClick={onPrev}>← ATRÁS</button>}
        <button style={s.btn(!completo)} onClick={onNext} disabled={!completo}>SIGUIENTE →</button>
      </div>
    </div>
  )
}

function PasoTerceros({ porra, setVal, onNext, onPrev }) {
  const terceros = GRUPOS_KEYS.map(g => porra[`grupo_${g}_3`]).filter(Boolean)
  const seleccionados = Array.from({ length: 8 }, (_, i) => porra[`tercero_${i}`]).filter(Boolean)

  function toggle(equipo) {
    const idx = seleccionados.indexOf(equipo)
    if (idx >= 0) {
      const nuevo = seleccionados.filter(e => e !== equipo)
      for (let i = 0; i < 8; i++) setVal(`tercero_${i}`, '')
      nuevo.forEach((e, i) => setVal(`tercero_${i}`, e))
    } else if (seleccionados.length < 8) {
      setVal(`tercero_${seleccionados.length}`, equipo)
    }
  }

  const completo = seleccionados.length === 8
  return (
    <div>
      <h2 style={s.titulo}>MEJORES TERCEROS</h2>
      <p style={s.subtitulo}>Selecciona los 8 terceros clasificados que pasan ({seleccionados.length}/8)</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {terceros.map((equipo, i) => {
          const selec = seleccionados.includes(equipo)
          const bloqueado = !selec && seleccionados.length >= 8
          return (
            <button key={equipo || i}
              style={{ ...s.equipoBtn(selec), opacity: bloqueado ? 0.3 : 1 }}
              onClick={() => equipo && !bloqueado && toggle(equipo)}
              disabled={!equipo || bloqueado}>
              <span style={{ color: '#c8a84b88', fontSize: '0.7rem', marginRight: '0.4rem' }}>
                {GRUPOS_KEYS[i]}
              </span>
              <Bandera equipo={equipo} />{equipo || '—'}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={s.btn(false)} onClick={onPrev}>← ATRÁS</button>
        <button style={s.btn(!completo)} onClick={onNext} disabled={!completo}>SIGUIENTE →</button>
      </div>
    </div>
  )
}

function PasoCuadro({ titulo, ronda, partidos, porra, setVal, claveGanador, onNext, onPrev }) {
  const completo = partidos.length > 0 && partidos.every((_, i) => porra[claveGanador(i)])
  const listo = partidos.length > 0 && partidos.every(([a, b]) => a && b)

  return (
    <div>
      <h2 style={s.titulo}>{titulo}</h2>
      <p style={s.subtitulo}>Selecciona el ganador de cada partido</p>

      {!listo && (
        <div style={{ background: '#f59e0b11', border: '1px solid #f59e0b44', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#f59e0b', fontFamily: 'Georgia, serif', fontSize: '0.85rem', margin: 0 }}>
            ⚠️ Completa las rondas anteriores para ver los partidos
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {partidos.map(([equipoA, equipoB], i) => {
          const ganador = porra[claveGanador(i)]
          const ladoLabel = ronda === 'dec'
            ? (i < 8 ? `Partido ${i + 1} · Lado izquierdo` : `Partido ${i + 1} · Lado derecho`)
            : `Partido ${i + 1}`
          return (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${ganador ? '#c8a84b44' : '#ffffff11'}`,
              borderRadius: '0.75rem', padding: '1rem',
            }}>
              <p style={{ color: '#ffffff44', fontFamily: 'Georgia, serif', fontSize: '0.7rem', margin: '0 0 0.5rem', letterSpacing: '0.1em' }}>
                {ladoLabel}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  style={{
                    ...s.equipoBtn(ganador === equipoA),
                    opacity: equipoA ? 1 : 0.3,
                    textAlign: 'center',
                    padding: '0.6rem 0.5rem',
                  }}
                  onClick={() => equipoA && setVal(claveGanador(i), equipoA)}
                  disabled={!equipoA}>
                  {equipoA ? <><Bandera equipo={equipoA} />{equipoA}</> : '?'}
                </button>
                <span style={{ color: '#ffffff44', fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>vs</span>
                <button
                  style={{
                    ...s.equipoBtn(ganador === equipoB),
                    opacity: equipoB ? 1 : 0.3,
                    textAlign: 'center',
                    padding: '0.6rem 0.5rem',
                  }}
                  onClick={() => equipoB && setVal(claveGanador(i), equipoB)}
                  disabled={!equipoB}>
                  {equipoB ? <><Bandera equipo={equipoB} />{equipoB}</> : '?'}
                </button>
              </div>
              {ganador && (
                <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>
                  ✓ Pasa: <strong><Bandera equipo={ganador} />{ganador}</strong>
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={s.btn(false)} onClick={onPrev}>← ATRÁS</button>
        <button style={s.btn(!completo)} onClick={onNext} disabled={!completo}>SIGUIENTE →</button>
      </div>
    </div>
  )
}

function PasoSemisFinal({ porra, setVal, onNext, onPrev }) {
  const semis = generarSemis(porra)
  const semi1OK = porra['semi_0'] && porra['semi_1']

  // Guardar finalistas automáticamente cuando estén definidos
  useEffect(() => {
    if (porra['semi_0']) setVal('final_0', porra['semi_0'])
    if (porra['semi_1']) setVal('final_1', porra['semi_1'])
  }, [porra['semi_0'], porra['semi_1']])

  const finalistasOK = porra['final_0'] && porra['final_1']
  const campeonOK = porra['campeon']
  const terceroOK = porra['tercer_clasificado']
  const completo = semi1OK && finalistasOK && campeonOK && terceroOK

  // Perdedores de semis (para el 3er puesto)
  const perdedoresSemis = []
  if (porra['semi_0']) {
    const otro = semis[0].find(e => e !== porra['semi_0'])
    if (otro) perdedoresSemis.push(otro)
  }
  if (porra['semi_1']) {
    const otro = semis[1].find(e => e !== porra['semi_1'])
    if (otro) perdedoresSemis.push(otro)
  }

  return (
    <div>
      <h2 style={s.titulo}>SEMIFINAL · FINAL</h2>
      <p style={s.subtitulo}>Elige los ganadores de cada ronda hasta el campeón</p>

      {/* Semis */}
      <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>SEMIFINALES</p>
      {semis.map(([a, b], i) => {
        const ganador = porra[`semi_${i}`]
        return (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #ffffff11', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
            <p style={{ color: '#ffffff44', fontFamily: 'Georgia, serif', fontSize: '0.7rem', margin: '0 0 0.5rem' }}>Semifinal {i + 1}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <button style={{ ...s.equipoBtn(ganador === a), opacity: a ? 1 : 0.3, textAlign: 'center' }}
                onClick={() => a && setVal(`semi_${i}`, a)} disabled={!a}><Bandera equipo={a} />{a || '?'}</button>
              <span style={{ color: '#ffffff44', fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>vs</span>
              <button style={{ ...s.equipoBtn(ganador === b), opacity: b ? 1 : 0.3, textAlign: 'center' }}
                onClick={() => b && setVal(`semi_${i}`, b)} disabled={!b}><Bandera equipo={b} />{b || '?'}</button>
            </div>
            {ganador && <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>✓ Pasa: <strong>{ganador}</strong></p>}
          </div>
        )
      })}

      {/* Final */}
      {semi1OK && (
        <>
          <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.85rem', margin: '1.25rem 0 0.75rem' }}>FINAL 🏆</p>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #c8a84b33', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
  <button style={{ ...s.equipoBtn(porra['campeon'] === porra['semi_0']), opacity: porra['semi_0'] ? 1 : 0.3, textAlign: 'center' }}
    onClick={() => porra['semi_0'] && setVal('campeon', porra['semi_0'])} disabled={!porra['semi_0']}>
    <Bandera equipo={porra['semi_0']} />{porra['semi_0'] || '?'}
  </button>
  <span style={{ color: '#ffffff44', fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>vs</span>
  <button style={{ ...s.equipoBtn(porra['campeon'] === porra['semi_1']), opacity: porra['semi_1'] ? 1 : 0.3, textAlign: 'center', width: '100%' }}
    onClick={() => porra['semi_1'] && setVal('campeon', porra['semi_1'])} disabled={!porra['semi_1']}>
    <Bandera equipo={porra['semi_1']} />{porra['semi_1'] || '?'}
  </button>
</div>
            </div>
            {porra['campeon'] && <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>🏆 Campeón: <strong>{porra['campeon']}</strong></p>}
          </div>
        </>
      )}

      {/* 3er puesto */}
      {finalistasOK && perdedoresSemis.length === 2 && (
        <>
          <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.85rem', margin: '1.25rem 0 0.75rem' }}>3ER Y 4º PUESTO 🥉</p>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #ffffff11', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
  <button style={{ ...s.equipoBtn(porra['tercer_clasificado'] === perdedoresSemis[0]), textAlign: 'center' }}
    onClick={() => setVal('tercer_clasificado', perdedoresSemis[0])}>
    <Bandera equipo={perdedoresSemis[0]} />{perdedoresSemis[0]}
  </button>
  <span style={{ color: '#ffffff44', fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>vs</span>
  <button style={{ ...s.equipoBtn(porra['tercer_clasificado'] === perdedoresSemis[1]), textAlign: 'center', width: '100%' }}
    onClick={() => setVal('tercer_clasificado', perdedoresSemis[1])}>
    <Bandera equipo={perdedoresSemis[1]} />{perdedoresSemis[1]}
  </button>
</div>
            {porra['tercer_clasificado'] && <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>🥉 3º: <strong>{porra['tercer_clasificado']}</strong></p>}
          </div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button style={s.btn(false)} onClick={onPrev}>← ATRÁS</button>
        <button style={s.btn(!completo)} onClick={onNext} disabled={!completo}>SIGUIENTE →</button>
      </div>
    </div>
  )
}

// Replace PasoPremios in app/porra/[codigo]/page.js with this
// Also add import at top: import { getTodos, getPorteros, getJovenes } from '../../../lib/jugadores'

function PasoPremios({ porra, setVal, onEnviar, onPrev, guardando }) {
  const [selecciones, setSelecciones] = useState({})

  const TODOS_EQUIPOS_SORTED = [...TODOS_EQUIPOS].sort((a, b) => a.localeCompare(b, 'es'))

  const premiosConfig = [
  { key: 'balon_oro', label: 'Balón de Oro ⚽', tipo: 'todos', desc: 'Mejor jugador del torneo' },
  { key: 'bota_oro', label: 'Bota de Oro 👟', tipo: 'todos', desc: 'Máximo goleador del torneo' },
  { key: 'guante_oro', label: 'Guante de Oro 🧤', tipo: 'porteros', desc: 'Mejor portero del torneo' },
  { key: 'mejor_joven', label: 'Mejor Jugador Joven ⭐', tipo: 'jovenes', desc: 'Mejor jugador menor de 21 años' },
  { key: 'juego_limpio', label: 'Premio Fair Play 🤝', tipo: 'seleccion', desc: 'Selección con mejor comportamiento deportivo (medido en tarjetas amarillas y rojas)' },
  { key: 'gol_torneo', label: 'Gol del Torneo 🎯', tipo: 'todos', desc: 'Gol más bonito del Mundial' },
]

  function getJugadores(tipo, seleccion) {
    if (!seleccion) return []
    const todos = getTodos(seleccion)
    if (tipo === 'porteros') return todos.filter(j => j.portero)
    if (tipo === 'jovenes') return todos.filter(j => j.joven)
    return todos
  }

  function handleSeleccion(key, seleccion) {
    setSelecciones(prev => ({ ...prev, [key]: seleccion }))
    setVal(key, '') // reset jugador al cambiar selección
  }

  const selectStyle = {
    width: '100%', padding: '0.6rem 1rem',
    background: '#1a1a2e',
    border: '1px solid #c8a84b44',
    borderRadius: '0.5rem',
    color: '#fff', fontFamily: 'Georgia, serif', fontSize: '0.9rem',
    outline: 'none', colorScheme: 'dark',
  }

  const completo = premiosConfig.every(p => porra[p.key])

  return (
    <div>
      <h2 style={{ color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>PREMIOS INDIVIDUALES</h2>
      <p style={{ color: '#ffffff66', fontFamily: 'Georgia, serif', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Selecciona primero la selección y luego el jugador
      </p>

      {premiosConfig.map(premio => {
        const selActual = selecciones[premio.key] || ''
        const jugadores = getJugadores(premio.tipo, selActual)
        const valorActual = porra[premio.key] || ''

        return (
          <div key={premio.key} style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
              {premio.label}
              <span style={{ color: '#ffffff44', fontSize: '0.75rem', marginLeft: '0.5rem' }}>({premio.desc})</span>
            </label>

            {premio.tipo === 'seleccion' ? (
              // Fair Play: solo selección
              <select
                value={valorActual}
                onChange={e => setVal(premio.key, e.target.value)}
                style={selectStyle}>
                <option value="">Selecciona una selección...</option>
                {TODOS_EQUIPOS_SORTED.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            ) : (
              // Premios de jugador: selección + jugador
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <select
                  value={selActual}
                  onChange={e => handleSeleccion(premio.key, e.target.value)}
                  style={selectStyle}>
                  <option value="">1. Selecciona una selección...</option>
                  {TODOS_EQUIPOS_SORTED.map(eq => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>

                {selActual && (
                  <select
                    value={valorActual}
                    onChange={e => setVal(premio.key, e.target.value)}
                    style={selectStyle}>
                    <option value="">2. Selecciona un jugador...</option>
                    {jugadores.length === 0 ? (
                      <option disabled>No hay jugadores disponibles</option>
                    ) : (
                      jugadores
                        .sort((a, b) => a.nombre.localeCompare(b.nombre))
                        .map(j => (
                          <option key={j.nombre} value={j.nombre}>{j.nombre}</option>
                        ))
                    )}
                  </select>
                )}

                {valorActual && (
                  <p style={{ color: '#c8a84b', fontFamily: 'Georgia, serif', fontSize: '0.75rem', margin: 0 }}>
                    ✓ {selActual} — {valorActual}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button style={{
          padding: '0.75rem 2rem', background: 'linear-gradient(90deg, #c8a84b, #f5d76e)',
          border: 'none', borderRadius: '0.5rem', color: '#0a0a0a',
          cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em',
        }} onClick={onPrev}>← ATRÁS</button>
        <button
          style={{
            padding: '0.75rem 2rem',
            background: (!completo || guardando) ? '#333' : 'linear-gradient(90deg, #c8a84b, #f5d76e)',
            border: 'none', borderRadius: '0.5rem',
            color: (!completo || guardando) ? '#666' : '#0a0a0a',
            cursor: (!completo || guardando) ? 'not-allowed' : 'pointer',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em',
          }}
          onClick={onEnviar}
          disabled={!completo || guardando}>
          {guardando ? 'ENVIANDO...' : '🚀 ENVIAR PORRA'}
        </button>
      </div>
    </div>
  )
}
