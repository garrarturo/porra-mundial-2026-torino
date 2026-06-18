'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { GRUPOS, PREMIOS } from '../../lib/data'
import { generarDieciseisavos } from '../../lib/torneo'

const GRUPOS_KEYS = Object.keys(GRUPOS)

const s = {
  page: { minHeight: '100vh', background: '#0f0f0f', fontFamily: 'Georgia, serif', color: '#fff', padding: '2rem 1rem' },
  card: { maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid #c8a84b33', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem' },
  h1: { fontFamily: "'Bebas Neue', sans-serif", color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.5rem' },
  h2: { fontFamily: "'Bebas Neue', sans-serif", color: '#c8a84b', fontSize: '1.4rem', letterSpacing: '0.1em', marginBottom: '1rem' },
  h3: { fontFamily: "'Bebas Neue', sans-serif", color: '#c8a84b88', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '0.75rem' },
  input: { padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid #c8a84b44', borderRadius: '0.5rem', color: '#fff', fontFamily: 'Georgia, serif', fontSize: '0.9rem', outline: 'none', width: '100%' },
  btn: { padding: '0.6rem 1.5rem', background: 'linear-gradient(90deg, #c8a84b, #f5d76e)', border: 'none', borderRadius: '0.5rem', color: '#0a0a0a', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.05em' },
  btnRojo: { padding: '0.4rem 1rem', background: '#ef444422', border: '1px solid #ef4444', borderRadius: '0.4rem', color: '#ef4444', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '0.8rem' },
  label: { color: '#c8a84b', fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' },
  select: { padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid #c8a84b44', borderRadius: '0.5rem', color: '#fff', fontFamily: 'Georgia, serif', fontSize: '0.85rem', outline: 'none', width: '100%', colorScheme: 'dark', backgroundColor: '#1a1a2e' },
  tabBtn: (active) => ({ padding: '0.5rem 1.5rem', background: active ? '#c8a84b' : 'transparent', border: '1px solid #c8a84b', borderRadius: '0.5rem', color: active ? '#0a0a0a' : '#c8a84b', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.05em' }),
  partidoCard: (sel) => ({ background: sel ? 'rgba(200,168,75,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${sel ? '#c8a84b44' : '#ffffff11'}`, borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }),
  equipoBtn: (sel) => ({ padding: '0.6rem 0.75rem', background: sel ? '#c8a84b' : 'rgba(255,255,255,0.06)', border: `1px solid ${sel ? '#c8a84b' : '#ffffff22'}`, borderRadius: '0.5rem', color: sel ? '#0a0a0a' : '#fff', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '0.85rem', flex: 1, transition: 'all 0.15s' }),
}

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [password, setPassword] = useState('')
  const [errorAuth, setErrorAuth] = useState(false)
  const [solucion, setSolucion] = useState({})
  const [participantes, setParticipantes] = useState([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoCodigo, setNuevoCodigo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [tab, setTab] = useState('00000000-0000-0000-0000-000000000000')

  function login() {
    if (password === 'BuenaPorraQatarusa223') { setAutenticado(true); cargarDatos() }
    else setErrorAuth(true)
  }

  async function cargarDatos() {
    const [{ data: solRows }, { data: parts }] = await Promise.all([
      supabase.from('porras').select('*').eq('participante_id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('participantes').select('*').order('created_at'),
    ])
    const sol = {}
    if (solRows) solRows.forEach(r => { sol[r.clave] = r.valor })
    setSolucion(sol)
    setParticipantes(parts || [])
  }

  function setVal(clave, valor) { setSolucion(prev => ({ ...prev, [clave]: valor })) }

  async function guardarSolucion() {
  setGuardando(true)
  const solConFinal = { ...solucion }
  if (solucion['semi_0']) solConFinal['final_0'] = solucion['semi_0']
  if (solucion['semi_1']) solConFinal['final_1'] = solucion['semi_1']

  const { error: deleteError } = await supabase.from('porras').delete().eq('participante_id', '00000000-0000-0000-0000-000000000000')
  console.log('Delete error:', deleteError)

  const rows = Object.entries(solConFinal).filter(([,v]) => v).map(([clave, valor]) => ({
    participante_id: '00000000-0000-0000-0000-000000000000', clave, valor,
  }))
  console.log('Rows to insert:', rows.length, rows[0])

  const { error: insertError } = await supabase.from('porras').insert(rows)
  console.log('Insert error:', insertError)

  setGuardando(false); setGuardado(true)
  setTimeout(() => setGuardado(false), 2000)
}

  async function crearParticipante() {
    if (!nuevoNombre || !nuevoCodigo) return
    await supabase.from('participantes').insert({ nombre: nuevoNombre, codigo: nuevoCodigo.toLowerCase().replace(/\s/g, ''), porra_enviada: false })
    setNuevoNombre(''); setNuevoCodigo(''); cargarDatos()
  }

  async function resetearPorra(id) {
    if (!confirm('¿Resetear la porra de este participante?')) return
    await supabase.from('porras').delete().eq('participante_id', id)
    await supabase.from('participantes').update({ porra_enviada: false }).eq('id', id)
    cargarDatos()
  }

  async function eliminarParticipante(id) {
    if (!confirm('¿Eliminar este participante?')) return
    await supabase.from('porras').delete().eq('participante_id', id)
    await supabase.from('participantes').delete().eq('id', id)
    cargarDatos()
  }

  if (!autenticado) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...s.card, maxWidth: '360px', textAlign: 'center' }}>
          <h1 style={s.h1}>ADMIN</h1>
          <p style={{ color: '#ffffff66', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Solo para el organizador</p>
          <input type="password" placeholder="Contraseña" value={password}
            onChange={e => { setPassword(e.target.value); setErrorAuth(false) }}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ ...s.input, marginBottom: '1rem', textAlign: 'center' }} />
          {errorAuth && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Contraseña incorrecta</p>}
          <button style={s.btn} onClick={login}>ENTRAR</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={s.h1}>PANEL DE ADMINISTRADOR</h1>
        <p style={{ color: '#ffffff44', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Porra Mundial 2026</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[['00000000-0000-0000-0000-000000000000', 'SOLUCIÓN'], ['participantes', 'PARTICIPANTES']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={s.tabBtn(tab === key)}>{label}</button>
          ))}
        </div>

        {tab === '00000000-0000-0000-0000-000000000000' && (
          <SolucionPanel solucion={solucion} setVal={setVal} guardarSolucion={guardarSolucion} guardando={guardando} guardado={guardado} />
        )}

        {tab === 'participantes' && (
          <ParticipantesPanel participantes={participantes} nuevoNombre={nuevoNombre} nuevoCodigo={nuevoCodigo}
            setNuevoNombre={setNuevoNombre} setNuevoCodigo={setNuevoCodigo}
            crearParticipante={crearParticipante} resetearPorra={resetearPorra} eliminarParticipante={eliminarParticipante} />
        )}
      </div>
    </div>
  )
}

function SolucionPanel({ solucion, setVal, guardarSolucion, guardando, guardado }) {
  const [seccion, setSeccion] = useState('grupos')
  const secciones = [['grupos','GRUPOS'],['terceros','TERCEROS'],['cuadro','CUADRO'],['premios','PREMIOS']]

  return (
    <div style={s.card}>
      <h2 style={s.h2}>ACTUALIZAR SOLUCIÓN</h2>
      <p style={{ color: '#ffffff55', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        Ve actualizando conforme avanza el torneo.
      </p>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {secciones.map(([key, label]) => (
          <button key={key} onClick={() => setSeccion(key)} style={{
            padding: '0.4rem 1rem', background: seccion === key ? '#c8a84b22' : 'transparent',
            border: `1px solid ${seccion === key ? '#c8a84b' : '#ffffff22'}`,
            borderRadius: '0.4rem', color: seccion === key ? '#c8a84b' : '#ffffff66',
            cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: '0.8rem',
          }}>{label}</button>
        ))}
      </div>

      {seccion === 'grupos' && <SeccionGrupos solucion={solucion} setVal={setVal} />}
      {seccion === 'terceros' && <SeccionTerceros solucion={solucion} setVal={setVal} />}
      {seccion === 'cuadro' && <SeccionCuadro solucion={solucion} setVal={setVal} />}
      {seccion === 'premios' && <SeccionPremios solucion={solucion} setVal={setVal} />}

      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #ffffff11' }}>
        <button style={s.btn} onClick={guardarSolucion} disabled={guardando}>
          {guardando ? 'GUARDANDO...' : guardado ? '✓ GUARDADO' : 'GUARDAR SOLUCIÓN'}
        </button>
      </div>
    </div>
  )
}

function SeccionGrupos({ solucion, setVal }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {GRUPOS_KEYS.map(g => (
        <div key={g} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <p style={{ color: '#c8a84b', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', margin: '0 0 0.5rem' }}>GRUPO {g}</p>
          {[1, 2, 3].map(pos => (
            <div key={pos} style={{ marginBottom: '0.4rem' }}>
              <select value={solucion[`grupo_${g}_${pos}`] || ''} onChange={e => setVal(`grupo_${g}_${pos}`, e.target.value)} style={s.select}>
                <option value="">{pos}º — sin definir</option>
                {GRUPOS[g].map(eq => <option key={eq} value={eq}>{eq}</option>)}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function SeccionTerceros({ solucion, setVal }) {
  const tercerosPosibles = GRUPOS_KEYS.map(g => solucion[`grupo_${g}_3`]).filter(Boolean)
  const seleccionados = Array.from({ length: 8 }, (_, i) => solucion[`tercero_${i}`]).filter(Boolean)

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

  return (
    <div>
      <p style={{ color: '#ffffff66', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Selecciona los 8 mejores terceros ({seleccionados.length}/8)
      </p>
      {tercerosPosibles.length < 12 && (
        <p style={{ color: '#f59e0b', fontSize: '0.8rem', marginBottom: '1rem' }}>
          ⚠️ Define primero los terceros de cada grupo en la sección Grupos
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {GRUPOS_KEYS.map((g, i) => {
          const equipo = solucion[`grupo_${g}_3`]
          if (!equipo) return null
          const selec = seleccionados.includes(equipo)
          const bloqueado = !selec && seleccionados.length >= 8
          return (
            <button key={g}
              style={{ ...s.equipoBtn(selec), opacity: bloqueado ? 0.3 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => !bloqueado && toggle(equipo)} disabled={bloqueado}>
              <span style={{ color: '#c8a84b88', fontSize: '0.7rem' }}>{g}</span>
              {equipo}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SeccionCuadro({ solucion, setVal }) {
  const dieciseisavos = generarDieciseisavos(solucion)

  function generarOctavos() {
    const pares = [[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15]]
    return pares.map(([a, b]) => [solucion[`dec_${a}`] || null, solucion[`dec_${b}`] || null])
  }

  function generarCuartos() {
    const pares = [[0,1],[2,3],[4,5],[6,7]]
    return pares.map(([a, b]) => [solucion[`oct_${a}`] || null, solucion[`oct_${b}`] || null])
  }

  function generarSemis() {
    return [
      [solucion['cua_0'] || null, solucion['cua_1'] || null],
      [solucion['cua_2'] || null, solucion['cua_3'] || null],
    ]
  }

  const rondas = [
    { titulo: 'DIECISEISAVOS', partidos: dieciseisavos || [], clave: 'dec' },
    { titulo: 'OCTAVOS DE FINAL', partidos: generarOctavos(), clave: 'oct' },
    { titulo: 'CUARTOS DE FINAL', partidos: generarCuartos(), clave: 'cua' },
  ]

  const semis = generarSemis()
  const finalistas = [solucion['semi_0'] || null, solucion['semi_1'] || null]

  return (
    <div>
      {!dieciseisavos && (
        <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ⚠️ Define los grupos y terceros clasificados primero
        </p>
      )}

      {rondas.map(({ titulo, partidos, clave }) => (
        <div key={clave} style={{ marginBottom: '1.5rem' }}>
          <p style={s.h3}>{titulo}</p>
          {partidos.map(([a, b], i) => {
            const ganador = solucion[`${clave}_${i}`]
            return (
              <div key={i} style={s.partidoCard(!!ganador)}>
                <p style={{ color: '#ffffff33', fontSize: '0.7rem', margin: '0 0 0.5rem', fontFamily: 'Georgia, serif' }}>Partido {i + 1}</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button style={{ ...s.equipoBtn(ganador === a), opacity: a ? 1 : 0.3 }}
                    onClick={() => a && setVal(`${clave}_${i}`, a)} disabled={!a}>{a || '?'}</button>
                  <span style={{ color: '#ffffff44', fontSize: '0.8rem' }}>vs</span>
                  <button style={{ ...s.equipoBtn(ganador === b), opacity: b ? 1 : 0.3 }}
                    onClick={() => b && setVal(`${clave}_${i}`, b)} disabled={!b}>{b || '?'}</button>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Semis */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={s.h3}>SEMIFINALES</p>
        {semis.map(([a, b], i) => {
          const ganador = solucion[`semi_${i}`]
          return (
            <div key={i} style={s.partidoCard(!!ganador)}>
              <p style={{ color: '#ffffff33', fontSize: '0.7rem', margin: '0 0 0.5rem', fontFamily: 'Georgia, serif' }}>Semifinal {i + 1}</p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button style={{ ...s.equipoBtn(ganador === a), opacity: a ? 1 : 0.3 }}
                  onClick={() => a && setVal(`semi_${i}`, a)} disabled={!a}>{a || '?'}</button>
                <span style={{ color: '#ffffff44', fontSize: '0.8rem' }}>vs</span>
                <button style={{ ...s.equipoBtn(ganador === b), opacity: b ? 1 : 0.3 }}
                  onClick={() => b && setVal(`semi_${i}`, b)} disabled={!b}>{b || '?'}</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Final y 3er puesto */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={s.h3}>FINAL 🏆</p>
        <div style={s.partidoCard(!!solucion['campeon'])}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {[0, 1].map(i => {
              const eq = finalistas[i]
              return (
                <button key={i} style={{ ...s.equipoBtn(solucion['campeon'] === eq), opacity: eq ? 1 : 0.3 }}
                  onClick={() => eq && setVal('campeon', eq)} disabled={!eq}>{eq || '?'}</button>
              )
            })}
          </div>
          {solucion['campeon'] && <p style={{ color: '#c8a84b', fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>🏆 <strong>{solucion['campeon']}</strong></p>}
        </div>
      </div>

      {/* 3er puesto */}
      {solucion['semi_0'] && solucion['semi_1'] && (
        <div>
          <p style={s.h3}>3ER PUESTO 🥉</p>
          <div style={s.partidoCard(!!solucion['tercer_clasificado'])}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {semis.map(([a, b], i) => {
                const perdedor = semis[i].find(e => e !== solucion[`semi_${i}`])
                if (!perdedor) return null
                return (
                  <button key={i} style={s.equipoBtn(solucion['tercer_clasificado'] === perdedor)}
                    onClick={() => setVal('tercer_clasificado', perdedor)}>{perdedor}</button>
                )
              })}
            </div>
            {solucion['tercer_clasificado'] && <p style={{ color: '#c8a84b', fontSize: '0.75rem', margin: '0.5rem 0 0', textAlign: 'center' }}>🥉 <strong>{solucion['tercer_clasificado']}</strong></p>}
          </div>
        </div>
      )}
    </div>
  )
}

function SeccionPremios({ solucion, setVal }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {PREMIOS.map(p => (
        <div key={p.key}>
          <label style={s.label}>{p.label}</label>
          <input type="text" value={solucion[p.key] || ''} onChange={e => setVal(p.key, e.target.value)}
            style={s.input} placeholder="Nombre del jugador/selección" />
        </div>
      ))}
    </div>
  )
}

function ParticipantesPanel({ participantes, nuevoNombre, nuevoCodigo, setNuevoNombre, setNuevoCodigo, crearParticipante, resetearPorra, eliminarParticipante }) {
  return (
    <div>
      <div style={s.card}>
        <h2 style={s.h2}>AÑADIR PARTICIPANTE</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={s.label}>Nombre</label>
            <input type="text" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} style={s.input} placeholder="Ej: Arturo" />
          </div>
          <div>
            <label style={s.label}>Código (para el enlace)</label>
            <input type="text" value={nuevoCodigo} onChange={e => setNuevoCodigo(e.target.value)} style={s.input} placeholder="Ej: arturo2026" />
          </div>
        </div>
        {nuevoCodigo && (
          <p style={{ color: '#ffffff55', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Enlace: <span style={{ color: '#c8a84b' }}>{typeof window !== 'undefined' ? window.location.origin : ''}/porra/{nuevoCodigo.toLowerCase().replace(/\s/g, '')}</span>
          </p>
        )}
        <button style={s.btn} onClick={crearParticipante} disabled={!nuevoNombre || !nuevoCodigo}>CREAR PARTICIPANTE</button>
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>PARTICIPANTES ({participantes.length})</h2>
        {participantes.length === 0 ? (
          <p style={{ color: '#ffffff44', fontSize: '0.85rem' }}>Aún no hay participantes</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {participantes.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.75rem 1rem', border: '1px solid #ffffff11' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{p.nombre}</span>
                  <span style={{ color: '#ffffff44', fontSize: '0.75rem', marginLeft: '0.75rem', fontFamily: 'monospace' }}>/porra/{p.codigo}</span>
                </div>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.7rem', background: p.porra_enviada ? '#4ade8022' : '#f59e0b22', color: p.porra_enviada ? '#4ade80' : '#f59e0b', border: `1px solid ${p.porra_enviada ? '#4ade8044' : '#f59e0b44'}` }}>
                  {p.porra_enviada ? 'Enviada ✓' : 'Pendiente'}
                </span>
                {p.porra_enviada && <button style={s.btnRojo} onClick={() => resetearPorra(p.id)}>Resetear</button>}
                <button style={s.btnRojo} onClick={() => eliminarParticipante(p.id)}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}