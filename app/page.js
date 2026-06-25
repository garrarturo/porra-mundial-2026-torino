'use client'
import { generarDieciseisavos } from '../lib/torneo'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { calcularPuntuacion } from '../lib/scoring'
import { GRUPOS, CODIGOS_PAIS } from '../lib/data'

function Bandera({ equipo, size = 14 }) {
  const codigo = CODIGOS_PAIS[equipo]
  if (!codigo) return null
  return (
    <img
      src={`https://flagcdn.com/w20/${codigo}.png`}
      alt={equipo}
      style={{ width: size, height: Math.round(size * 0.75), objectFit: 'cover', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }}
    />
  )
}

const MEDALLAS = ['🥇', '🥈', '🥉']
// Lógica de desempate para añadir a app/page.js

// 1. Función para comprobar si la solución está completa
function solucionCompleta(sol) {
  if (!sol) return false
  const gruposKeys = Object.keys(GRUPOS)
  // Grupos: 1, 2, 3 de cada uno de los 12 grupos
  for (const g of gruposKeys) {
    if (!sol[`grupo_${g}_1`] || !sol[`grupo_${g}_2`] || !sol[`grupo_${g}_3`]) return false
  }
  // Terceros
  for (let i = 0; i < 8; i++) {
    if (!sol[`tercero_${i}`]) return false
  }
  // Cuadro completo
  for (let i = 0; i < 16; i++) if (!sol[`dec_${i}`]) return false
  for (let i = 0; i < 8; i++) if (!sol[`oct_${i}`]) return false
  for (let i = 0; i < 4; i++) if (!sol[`cua_${i}`]) return false
  for (let i = 0; i < 2; i++) if (!sol[`semi_${i}`]) return false
  if (!sol['campeon']) return false
  if (!sol['tercer_clasificado']) return false
  // Premios individuales
  const premios = ['balon_oro', 'bota_oro', 'guante_oro', 'mejor_joven', 'juego_limpio', 'gol_torneo']
  for (const p of premios) {
    if (!sol[p]) return false
  }
  return true
}

// 2. Función para calcular los valores de desempate de un participante
// Devuelve un array de números, uno por cada criterio, en orden de prioridad
function calcularDesempate(porra, sol) {
  // Criterio 1: ¿Acertó el campeón? (1 = sí, 0 = no)
  const c1 = porra['campeon'] && porra['campeon'] === sol['campeon'] ? 1 : 0

  // Criterio 2: cuántos finalistas acertó (0, 1 o 2)
  const finalistasSol = new Set([sol['semi_0'], sol['semi_1']].filter(Boolean))
  const c2 = [porra['semi_0'], porra['semi_1']].filter(e => e && finalistasSol.has(e)).length

  // Criterio 3: cuántos semifinalistas acertó (0 a 4)
  const semisSol = new Set(Array.from({ length: 4 }, (_, i) => sol[`cua_${i}`]).filter(Boolean))
  const c3 = Array.from({ length: 4 }, (_, i) => porra[`cua_${i}`]).filter(e => e && semisSol.has(e)).length

  // Criterio 4: cuántos cuartofinalistas acertó (0 a 8)
  const cuartosSol = new Set(Array.from({ length: 8 }, (_, i) => sol[`oct_${i}`]).filter(Boolean))
  const c4 = Array.from({ length: 8 }, (_, i) => porra[`oct_${i}`]).filter(e => e && cuartosSol.has(e)).length

  // Criterio 5: ¿Acertó el tercer clasificado? (1 = sí, 0 = no)
  const c5 = porra['tercer_clasificado'] && porra['tercer_clasificado'] === sol['tercer_clasificado'] ? 1 : 0

  // Criterio 6: cuántos clasificados a octavos acertó (0 a 16)
  const octavosSol = new Set(Array.from({ length: 16 }, (_, i) => sol[`dec_${i}`]).filter(Boolean))
  const c6 = Array.from({ length: 16 }, (_, i) => porra[`dec_${i}`]).filter(e => e && octavosSol.has(e)).length

  return [c1, c2, c3, c4, c5, c6]
}

// 3. Función de ordenación del ranking con desempate
function ordenarRanking(participantes, sol) {
  const solCompleta = solucionCompleta(sol)

  return [...participantes].sort((a, b) => {
    const totalA = a.puntuacion?.total || 0
    const totalB = b.puntuacion?.total || 0
    if (totalA !== totalB) return totalB - totalA

    // Empate en puntos: aplicar desempate solo si la solución está completa
    if (!solCompleta) return 0

    const desA = calcularDesempate(a.porra, sol)
    const desB = calcularDesempate(b.porra, sol)
    for (let i = 0; i < desA.length; i++) {
      if (desA[i] !== desB[i]) return desB[i] - desA[i]
    }
    return 0
  })
}
export default function Home() {
  const [ranking, setRanking] = useState([])
  const [solucion, setSolucion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [verPorra, setVerPorra] = useState(null)

  async function cargarDatos() {
    const [{ data: participantes }, { data: todasPorras }, { data: solData }] = await Promise.all([
      supabase.from('participantes').select('*'),
      supabase.from('porras').select('*').range(0,9999),
      supabase.from('porras').select('*').eq('participante_id', '00000000-0000-0000-0000-000000000000'),
    ])
    const sol = {}
    if (solData) solData.forEach(r => { sol[r.clave] = r.valor })
    setSolucion(sol)
    const result = (participantes || [])
      .filter(p => p.porra_enviada)
      .map(p => {
        const porraRows = (todasPorras || []).filter(r => r.participante_id === p.id)
        const porra = {}
        porraRows.forEach(r => { porra[r.clave] = r.valor })
        const puntuacion = calcularPuntuacion(porra, sol)
        return { ...p, porra, puntuacion }
      })
      const result_sorted = ordenarRanking(result, sol)
    setRanking(result_sorted)
    setLastUpdate(new Date())
    setLoading(false)
  }

  useEffect(() => {
    cargarDatos()
    const interval = setInterval(cargarDatos, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      color: '#fff',
      padding: '0',
    }}>
      <header style={{
        background: 'linear-gradient(90deg, #c8a84b 0%, #f5d76e 40%, #c8a84b 100%)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' }} />
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#0a0a0a', margin: 0, letterSpacing: '0.1em', position: 'relative', textShadow: '2px 2px 0 rgba(255,255,255,0.3)' }}>
          ⚽ PORRA MUNDIAL 2026
        </h1>
        <p style={{ color: '#2a2a2a', margin: '0.5rem 0 0', fontSize: '1rem', fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}>
          USA · CANADA · MEXICO
        </p>
        {lastUpdate && (
          <p style={{ color: '#555', margin: '0.5rem 0 0', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            Actualizado: {lastUpdate.toLocaleTimeString('es-ES')} · refresco automático cada 30s
          </p>
        )}
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.5rem', color: '#c8a84b' }}>Cargando clasificación...</div>
        ) : ranking.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', border: '2px dashed #c8a84b33', borderRadius: '1rem', color: '#c8a84b88' }}>
            <div style={{ fontSize: '3rem' }}>⏳</div>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Aún no hay porras enviadas</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#ffffff44' }}>Comparte el enlace con tus amigos para que hagan su porra</p>
          </div>
        ) : (
          <>
          <section style={{ marginBottom: '2rem' }}>
  <h2 style={{ color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.15em', marginBottom: '1.5rem', borderBottom: '2px solid #c8a84b33', paddingBottom: '0.5rem' }}>
    SISTEMA DE PUNTUACIÓN
  </h2>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
    {[
      { emoji: '🏟️', titulo: 'Fase de grupos', puntos: '36 pts', desc: '1 punto por cada puesto correcto (un grupo perfecto son 3 puntos) en cada uno de los 12 grupos.' },
      { emoji: '🎟️', 'titulo': 'Clasificados a 1/16', puntos: '32 pts', desc: '1 punto por cada uno de los 32 clasificados que aciertes (24 primeros/segundos + 8 mejores terceros).' },
      { emoji: '⚔️', titulo: 'Octavos de final', puntos: '32 pts', desc: '2 puntos por cada uno de los 16 clasificados a octavos que aciertes.' },
      { emoji: '🏅', titulo: 'Cuartos de final', puntos: '32+32 pts', desc: '4 puntos por cada uno de los 8 clasificados a cuartos. Bonus: 8 pts extra si aciertas el enfrentamiento exacto en el lado correcto del cuadro.' },
      { emoji: '⭐', titulo: 'Semifinales', puntos: '32+32 pts', desc: '8 puntos por cada uno de los 4 semifinalistas. Bonus: 16 pts extra si aciertas el enfrentamiento exacto en el lado correcto del cuadro.' },
      { emoji: '🏆', titulo: 'Final y podio', puntos: '80 pts', desc: '16 pts por cada finalista · 32 pts por el campeón · 16 pts por el 3er clasificado.' },
      { emoji: '🎖️', titulo: 'Premios individuales', puntos: '192 pts', desc: '32 pts cada uno: Balón de Oro, Bota de Oro, Guante de Oro, Mejor Joven, Fair Play y Gol del Torneo.' },
    ].map(({ emoji, titulo, puntos, desc }) => (
      <div key={titulo} style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #c8a84b22',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
          <span style={{
            background: 'linear-gradient(90deg, #c8a84b, #f5d76e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.2rem',
            letterSpacing: '0.05em',
          }}>{puntos}</span>
        </div>
        <p style={{ color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.05em', margin: 0 }}>{titulo}</p>
        <p style={{ color: '#ffffff66', fontFamily: 'Georgia, serif', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
    ))}
  </div>
  <p style={{ color: '#c8a84b', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', textAlign: 'center', marginTop: '1.25rem', letterSpacing: '0.1em' }}>
    PUNTUACIÓN MÁXIMA: 500 PUNTOS
  </p>
</section>
            <section>
              <h2 style={{ color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.15em', marginBottom: '1.5rem', borderBottom: '2px solid #c8a84b33', paddingBottom: '0.5rem' }}>
                CLASIFICACIÓN
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ranking.map((p, i) => (
                  <div key={p.id}
                    onClick={() => setSelected(selected === p.id ? null : p.id)}
                    style={{
                      background: selected === p.id ? 'linear-gradient(90deg, #c8a84b22, #c8a84b11)' : i === 0 ? 'linear-gradient(90deg, #c8a84b33, #c8a84b11)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selected === p.id ? '#c8a84b' : i === 0 ? '#c8a84b66' : '#ffffff11'}`,
                      borderRadius: '0.75rem', padding: '1rem 1.5rem', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', minWidth: '2rem' }}>{MEDALLAS[i] || `${i + 1}º`}</span>
                      <span style={{ flex: 1, fontSize: '1.4rem', letterSpacing: '0.05em' }}>{p.nombre}</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '2rem', color: '#c8a84b' }}>{p.puntuacion?.total || 0}</span>
                        <span style={{ color: '#ffffff44', fontSize: '1rem' }}> / 500</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem', height: '4px', background: '#ffffff11', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${((p.puntuacion?.total || 0) / 500) * 100}%`, background: 'linear-gradient(90deg, #c8a84b, #f5d76e)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                    </div>
                    {selected === p.id && p.puntuacion && (
                      <>
                        <DesglosePuntos puntuacion={p.puntuacion} porra={p.porra} solucion={solucion} />
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setVerPorra(verPorra === p.id ? null : p.id) }}
                            style={{
                              padding: '0.5rem 1.5rem',
                              background: verPorra === p.id ? '#c8a84b' : 'transparent',
                              border: '1px solid #c8a84b', borderRadius: '0.5rem',
                              color: verPorra === p.id ? '#0a0a0a' : '#c8a84b',
                              cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: '1rem', letterSpacing: '0.1em',
                            }}>
                            {verPorra === p.id ? '▲ OCULTAR PORRA' : '▼ VER PORRA'}
                          </button>
                        </div>
                        {verPorra === p.id && solucion && (
                          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #c8a84b22', paddingTop: '1.5rem' }}
                            onClick={(e) => e.stopPropagation()}>
                            <CuadroTorneo solucion={p.porra} referencia={solucion} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ color: '#ffffff33', fontSize: '0.75rem', fontFamily: 'Georgia, serif', marginTop: '0.75rem', textAlign: 'center' }}>
                Haz clic en un participante para ver el desglose de puntos
              </p>
            </section>

            {solucion && Object.keys(solucion).length > 0 && (
              <section style={{ marginTop: '3rem' }}>
                <h2 style={{ color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.15em', marginBottom: '1.5rem', borderBottom: '2px solid #c8a84b33', paddingBottom: '0.5rem' }}>
                  CUADRO DEL TORNEO
                </h2>
                <CuadroTorneo solucion={solucion} />
              </section>
            )}
            <section style={{ marginBottom: '2rem' }}>
  <h2 style={{ color: '#c8a84b', fontSize: '2rem', letterSpacing: '0.15em', marginBottom: '1.5rem', borderBottom: '2px solid #c8a84b33', paddingBottom: '0.5rem' }}>
    CRITERIOS DE DESEMPATE
  </h2>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {[
      'Haber adivinado al campeón',
      'Haber adivinado más finalistas',
      'Haber adivinado más semifinalistas',
      'Haber adivinado más cuartofinalistas',
      'Haber adivinado al tercero clasificado',
      'Haber adivinado más clasificados a octavos',
    ].map((criterio, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #c8a84b22',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.25rem',
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.5rem',
          color: '#c8a84b',
          minWidth: '2rem',
          textAlign: 'center',
        }}>{i + 1}</span>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#ffffff88' }}>{criterio}</span>
      </div>
    ))}
  </div>
</section>
          </>
        )}
      </div>
    </main>
  )
}

function DesglosePuntos({ puntuacion, porra, solucion }) {
  const [abierto, setAbierto] = useState(null)
  const GRUPOS_KEYS = Object.keys(GRUPOS)

  function FlagInline({ equipo }) {
    const codigo = CODIGOS_PAIS[equipo]
    if (!codigo) return null
    return <img src={`https://flagcdn.com/w20/${codigo}.png`} alt="" style={{ width: 16, height: 12, objectFit: 'cover', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }} />
  }

  function Equipo({ nombre }) {
    if (!nombre) return <span>?</span>
    return <span><FlagInline equipo={nombre} />{nombre}</span>
  }

  const categorias = [
    {
  key: 'puestos_grupos', label: 'Grupos', max: 36,
  detalle: () => GRUPOS_KEYS.map(g => {
    const equipos = GRUPOS[g]
    const p1 = porra[`grupo_${g}_1`], s1 = solucion?.[`grupo_${g}_1`]
    const p2 = porra[`grupo_${g}_2`], s2 = solucion?.[`grupo_${g}_2`]
    const p3 = porra[`grupo_${g}_3`], s3 = solucion?.[`grupo_${g}_3`]
    const p4 = equipos.find(e => e !== p1 && e !== p2 && e !== p3)
    const s4 = solucion ? equipos.find(e => e !== s1 && e !== s2 && e !== s3) : null
    return [
      { nodo: <span>Grupo {g} — 1º: <Equipo nombre={p1} /></span>, ok: p1 && p1 === s1 },
      { nodo: <span>Grupo {g} — 2º: <Equipo nombre={p2} /></span>, ok: p2 && p2 === s2 },
      { nodo: <span>Grupo {g} — 3º: <Equipo nombre={p3} /></span>, ok: p3 && p3 === s3 },
      { nodo: <span>Grupo {g} — 4º: <Equipo nombre={p4} /></span>, ok: p4 && p4 === s4 },
    ]
  }).flat()
    },
    {
      key: 'clasificados_16', label: '1/16', max: 32,
      detalle: () => {
        const solSet = new Set([
          ...GRUPOS_KEYS.map(g => solucion?.[`grupo_${g}_1`]),
          ...GRUPOS_KEYS.map(g => solucion?.[`grupo_${g}_2`]),
          ...Array.from({ length: 8 }, (_, i) => solucion?.[`tercero_${i}`]),
        ].filter(Boolean))
        const equipos = [
          ...GRUPOS_KEYS.map(g => porra[`grupo_${g}_1`]),
          ...GRUPOS_KEYS.map(g => porra[`grupo_${g}_2`]),
          ...Array.from({ length: 8 }, (_, i) => porra[`tercero_${i}`]),
        ].filter(Boolean)
        return equipos.map(e => ({ nodo: <Equipo nombre={e} />, ok: solSet.has(e) }))
      }
    },
    {
      key: 'clasificados_8', label: 'Octavos', max: 32,
      detalle: () => Array.from({ length: 16 }, (_, i) => {
        const e = porra[`dec_${i}`]
        const solSet = new Set(Array.from({ length: 16 }, (_, j) => solucion?.[`dec_${j}`]).filter(Boolean))
        return e ? { nodo: <Equipo nombre={e} />, ok: solSet.has(e) } : null
      }).filter(Boolean)
    },
    {
      key: 'clasificados_4', label: 'Cuartos', max: 32,
      detalle: () => Array.from({ length: 8 }, (_, i) => {
        const e = porra[`oct_${i}`]
        const solSet = new Set(Array.from({ length: 8 }, (_, j) => solucion?.[`oct_${j}`]).filter(Boolean))
        return e ? { nodo: <Equipo nombre={e} />, ok: solSet.has(e) } : null
      }).filter(Boolean)
    },
    {
      key: 'clasificados_semi', label: 'Semis', max: 32,
      detalle: () => Array.from({ length: 4 }, (_, i) => {
        const e = porra[`cua_${i}`]
        const solSet = new Set(Array.from({ length: 4 }, (_, j) => solucion?.[`cua_${j}`]).filter(Boolean))
        return e ? { nodo: <Equipo nombre={e} />, ok: solSet.has(e) } : null
      }).filter(Boolean)
    },
    {
      key: 'finalistas', label: 'Final', max: 32,
      detalle: () => [0, 1].map(i => {
        const e = porra[`semi_${i}`]
        const solSet = new Set([solucion?.['semi_0'], solucion?.['semi_1']].filter(Boolean))
        return e ? { nodo: <Equipo nombre={e} />, ok: solSet.has(e) } : null
      }).filter(Boolean)
    },
    {
      key: 'campeon', label: 'Campeón', max: 32,
      detalle: () => {
        const e = porra['campeon']
        return e ? [{ nodo: <Equipo nombre={e} />, ok: e === solucion?.['campeon'] }] : []
      }
    },
    {
      key: 'tercer_clasificado', label: '3er Puesto', max: 16,
      detalle: () => {
        const e = porra['tercer_clasificado']
        return e ? [{ nodo: <Equipo nombre={e} />, ok: e === solucion?.['tercer_clasificado'] }] : []
      }
    },
    {
      key: 'enfrentamientos_cuartos', label: 'Enfrent. Cuartos', max: 32,
      detalle: () => Array.from({ length: 4 }, (_, i) => {
        const a = porra[`oct_${i*2}`], b = porra[`oct_${i*2+1}`]
        const sa = solucion?.[`oct_${i*2}`], sb = solucion?.[`oct_${i*2+1}`]
        if (!a || !b) return null
        const ok = sa && sb && new Set([a,b]).size === 2 && new Set([sa,sb]).has(a) && new Set([sa,sb]).has(b)
        return { nodo: <span><Equipo nombre={a} /> vs <Equipo nombre={b} /></span>, ok: !!ok }
      }).filter(Boolean)
    },
    {
      key: 'enfrentamientos_semis', label: 'Enfrent. Semis', max: 32,
      detalle: () => Array.from({ length: 2 }, (_, i) => {
        const a = porra[`cua_${i*2}`], b = porra[`cua_${i*2+1}`]
        const sa = solucion?.[`cua_${i*2}`], sb = solucion?.[`cua_${i*2+1}`]
        if (!a || !b) return null
        const ok = sa && sb && new Set([a,b]).size === 2 && new Set([sa,sb]).has(a) && new Set([sa,sb]).has(b)
        return { nodo: <span><Equipo nombre={a} /> vs <Equipo nombre={b} /></span>, ok: !!ok }
      }).filter(Boolean)
    },
    { key: 'balon_oro', label: 'Balón de Oro', max: 32, detalle: () => porra['balon_oro'] ? [{ nodo: <span>{porra['balon_oro']}</span>, ok: puntuacion.desglose['balon_oro'] > 0 }] : [] },
    { key: 'bota_oro', label: 'Bota de Oro', max: 32, detalle: () => porra['bota_oro'] ? [{ nodo: <span>{porra['bota_oro']}</span>, ok: puntuacion.desglose['bota_oro'] > 0 }] : [] },
    { key: 'guante_oro', label: 'Guante de Oro', max: 32, detalle: () => porra['guante_oro'] ? [{ nodo: <span>{porra['guante_oro']}</span>, ok: puntuacion.desglose['guante_oro'] > 0 }] : [] },
    { key: 'mejor_joven', label: 'Mejor Joven', max: 32, detalle: () => porra['mejor_joven'] ? [{ nodo: <span>{porra['mejor_joven']}</span>, ok: puntuacion.desglose['mejor_joven'] > 0 }] : [] },
    {
      key: 'juego_limpio', label: 'Fair Play', max: 32,
      detalle: () => { const e = porra['juego_limpio']; return e ? [{ nodo: <Equipo nombre={e} />, ok: puntuacion.desglose['juego_limpio'] > 0 }] : [] }
    },
    { key: 'gol_torneo', label: 'Gol del Torneo', max: 32, detalle: () => porra['gol_torneo'] ? [{ nodo: <span>{porra['gol_torneo']}</span>, ok: puntuacion.desglose['gol_torneo'] > 0 }] : [] },
  ]

  return (
    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {categorias.map(cat => {
        const pts = puntuacion.desglose[cat.key] || 0
        const isOpen = abierto === cat.key
        const color = pts === cat.max ? '#4ade80' : pts > 0 ? '#c8a84b' : '#ffffff33'
        const detalle = cat.detalle()
        return (
          <div key={cat.key}>
            <div onClick={(e) => { e.stopPropagation(); setAbierto(isOpen ? null : cat.key) }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: isOpen ? 'rgba(200,168,75,0.08)' : 'rgba(0,0,0,0.2)',
                border: `1px solid ${isOpen ? '#c8a84b44' : '#ffffff11'}`,
                borderRadius: isOpen ? '0.4rem 0.4rem 0 0' : '0.4rem',
                padding: '0.4rem 0.75rem', cursor: 'pointer',
                fontFamily: 'Georgia, serif', fontSize: '0.8rem',
              }}>
              <span style={{ color: '#ffffff88' }}>{cat.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color, fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem' }}>{pts}/{cat.max}</span>
                <span style={{ color: '#ffffff33', fontSize: '0.7rem' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>
            {isOpen && detalle.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #c8a84b22', borderTop: 'none', borderRadius: '0 0 0.4rem 0.4rem', padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {detalle.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Georgia, serif', fontSize: '0.75rem', color: item.ok ? '#fff' : '#ffffff44' }}>
                    <span>{item.ok ? '✓' : '✗'}</span>
                    <span>{item.nodo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CuadroTorneo({ solucion, referencia }) {
  // ref es la solución real para comparar (solo se usa en VER PORRA)
  const ref = referencia || null

  const dieciseisavos = generarDieciseisavos(solucion) || Array(16).fill([null, null])
  const oct = Array.from({ length: 16 }, (_, i) => solucion[`dec_${i}`] || null)
  const cua = Array.from({ length: 8 }, (_, i) => solucion[`oct_${i}`] || null)
  const semi = Array.from({ length: 4 }, (_, i) => solucion[`cua_${i}`] || null)
  const final_ = [solucion['semi_0'] || null, solucion['semi_1'] || null]
  const campeon = solucion['campeon'] || null
  const tercero = solucion['tercer_clasificado'] || null
  const segundo = final_[0] && final_[1] ? (final_[0] === campeon ? final_[1] : final_[0]) : null

  // Comprueba si un equipo está en la solución para una ronda concreta
  function equipoOk(equipo, clavePrefix, count) {
    if (!ref || !equipo) return false
    const solSet = new Set(Array.from({ length: count }, (_, i) => ref[`${clavePrefix}_${i}`]).filter(Boolean))
    return solSet.has(equipo)
  }

  function equipoEnDec(equipo) {
  if (!ref || !equipo) return false
  const dec = generarDieciseisavos(ref) || []
  return dec.some(([a, b]) => a === equipo || b === equipo)
}

  // Comprueba si un partido concreto está exactamente en la solución
  function partidoOk(equipoA, equipoB, clavePrefix, partidoIdx) {
  if (!ref || !equipoA || !equipoB) return false
  const sa = ref[`${clavePrefix}_${partidoIdx * 2}`]
  const sb = ref[`${clavePrefix}_${partidoIdx * 2 + 1}`]
  if (!sa || !sb) return false
  return new Set([sa, sb]).has(equipoA) && new Set([sa, sb]).has(equipoB)
}

  const matchStyle = {
    borderRadius: '0.5rem',
    overflow: 'hidden',
    fontSize: '0.65rem',
    fontFamily: 'Georgia, serif',
  }

  function Match({ teamA, teamB, okPrefijo, okCount, partidoOkPrefijo, partidoIdx }) {
    const aOk = ref ? equipoOk(teamA, okPrefijo, okCount) : false
    const bOk = ref ? equipoOk(teamB, okPrefijo, okCount) : false
    const pOk = (partidoOkPrefijo && partidoIdx !== undefined) ? partidoOk(teamA, teamB, partidoOkPrefijo, partidoIdx) : false

    return (
      <div style={{
        ...matchStyle,
        border: pOk ? '3px solid #4ade8088' : aOk || bOk ? '1px solid #4ade8033' : '1px solid #c8a84b33',
        background: pOk ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
      }}>
        <div style={{ padding: '0.25rem 0.5rem', background: aOk ? 'rgba(74,222,128,0.12)' : 'transparent', color: teamA ? '#fff' : '#ffffff22', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderBottom: '1px solid #ffffff0a' }}>
  <Bandera equipo={teamA} />{teamA || '?'}
</div>
<div style={{ padding: '0.25rem 0.5rem', background: bOk ? 'rgba(74,222,128,0.12)' : 'transparent', color: teamB ? '#fff' : '#ffffff22', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
  <Bandera equipo={teamB} />{teamB || '?'}
</div>
      </div>
    )
  }

  const octMatches = Array.from({ length: 8 }, (_, i) => [oct[i * 2], oct[i * 2 + 1]])
  const cuaMatches = Array.from({ length: 4 }, (_, i) => [cua[i * 2], cua[i * 2 + 1]])
  const semiMatches = Array.from({ length: 2 }, (_, i) => [semi[i * 2], semi[i * 2 + 1]])

  const labelStyle = { color: '#c8a84b', fontSize: '0.7rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.5rem' }
  const H = 800

  function Premio({ emoji, label, valor, valorRef }) {
    const ok = ref && valor && valorRef && valor.trim().toLowerCase() === valorRef.trim().toLowerCase()
    return (
      <div style={{ background: ok ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${ok ? '#4ade8044' : '#ffffff11'}`, borderRadius: '0.5rem', padding: '0.4rem 0.6rem' }}>
        <div style={{ color: '#ffffff44', fontSize: '0.6rem', fontFamily: 'Georgia, serif' }}>{emoji} {label}</div>
        <div style={{ color: ok ? '#4ade80' : valor ? '#fff' : '#ffffff22', fontSize: '0.65rem', fontFamily: 'Georgia, serif', marginTop: '0.15rem' }}>
          {valor || '—'}
        </div>
      </div>
    )
  }

  function Podio({ emoji, label, valor, gold, refValor }) {
    const ok = ref && valor && refValor && valor === refValor
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={labelStyle}>{label}</div>
        <div style={{
          background: ok ? 'rgba(74,222,128,0.08)' : gold ? 'linear-gradient(135deg, #c8a84b33, #c8a84b11)' : 'rgba(255,255,255,0.04)',
          border: ok ? '2px solid #4ade80' : gold ? '2px solid #c8a84b' : '1px solid #ffffff22',
          borderRadius: '0.75rem', padding: '0.6rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.25rem' }}>{emoji}</div>
          <div style={{ fontSize: '0.65rem', fontFamily: 'Georgia, serif', marginTop: '0.3rem', color: ok ? '#4ade80' : gold ? '#c8a84b' : '#ffffff88', wordBreak: 'break-word' }}>
            <Bandera equipo={valor} size={12} />{valor || '?'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '0.5rem', minWidth: '1000px' }}>

        {/* 1/16 — sin comparación de equipos individuales, solo mostramos el cuadro */}
        <div style={{ flex: 1.2, minWidth: '100px' }}>
          <div style={labelStyle}>1/16</div>
          <div style={{ display: 'flex', flexDirection: 'column', height: `${H}px`, justifyContent: 'space-around', gap: '0.25rem' }}>
            {dieciseisavos.map(([a, b], i) => {
  const aOkDec = equipoEnDec(a)
  const bOkDec = equipoEnDec(b)
  return (
    <div key={i} style={{
      ...{ borderRadius: '0.5rem', overflow: 'hidden', fontSize: '0.65rem', fontFamily: 'Georgia, serif' },
      border: '1px solid #c8a84b33',
      background: 'rgba(255,255,255,0.04)',
    }}>
      <div style={{ padding: '0.25rem 0.5rem', background: aOkDec ? 'rgba(74,222,128,0.12)' : 'transparent', color: a ? '#fff' : '#ffffff22', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderBottom: '1px solid #ffffff0a' }}>
        <Bandera equipo={a} />{a || '?'}
      </div>
      <div style={{ padding: '0.25rem 0.5rem', background: bOkDec ? 'rgba(74,222,128,0.12)' : 'transparent', color: b ? '#fff' : '#ffffff22', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Bandera equipo={b} />{b || '?'}
      </div>
    </div>
  )
})}
          </div>
        </div>

        {/* Octavos — verde si el equipo pasa a cuartos, partido verde si el emparejamiento es exacto */}
        <div style={{ flex: 1, minWidth: '100px' }}>
          <div style={labelStyle}>Octavos</div>
          <div style={{ display: 'flex', flexDirection: 'column', height: `${H}px`, justifyContent: 'space-around', gap: '0.25rem' }}>
            {octMatches.map(([a, b], i) => (
  <Match key={i} teamA={a} teamB={b} okPrefijo="dec" okCount={16} partidoIdx={i} />
))}
          </div>
        </div>

        {/* Cuartos */}
        <div style={{ flex: 1, minWidth: '100px' }}>
          <div style={labelStyle}>Cuartos</div>
          <div style={{ display: 'flex', flexDirection: 'column', height: `${H}px`, justifyContent: 'space-around', gap: '0.25rem' }}>
            {cuaMatches.map(([a, b], i) => (
  <Match key={i} teamA={a} teamB={b} okPrefijo="oct" okCount={8} partidoOkPrefijo="oct" partidoIdx={i} />
))}
          </div>
        </div>

        {/* Semis */}
        <div style={{ flex: 1, minWidth: '100px' }}>
          <div style={labelStyle}>Semis</div>
          <div style={{ display: 'flex', flexDirection: 'column', height: `${H}px`, justifyContent: 'space-around', gap: '0.25rem' }}>
            {semiMatches.map(([a, b], i) => (
  <Match key={i} teamA={a} teamB={b} okPrefijo="cua" okCount={4} partidoOkPrefijo="cua" partidoIdx={i} />
))}
          </div>
        </div>

        {/* Final */}
        <div style={{ flex: 1, minWidth: '100px' }}>
          <div style={labelStyle}>Final</div>
          <div style={{ display: 'flex', flexDirection: 'column', height: `${H}px`, justifyContent: 'space-around' }}>
            <Match teamA={final_[0]} teamB={final_[1]} okPrefijo="semi" okCount={2} />
          </div>
        </div>

        {/* Podio */}
        <div style={{ minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          <Podio emoji="🏆" label="Campeón" valor={campeon} gold={true} refValor={ref?.['campeon']} />
          <Podio emoji="🥈" label="2º Puesto" valor={segundo} gold={false} refValor={ref ? (ref['semi_0'] === ref['campeon'] ? ref['semi_1'] : ref['semi_0']) : null} />
          <Podio emoji="🥉" label="3er Puesto" valor={tercero} gold={false} refValor={ref?.['tercer_clasificado']} />
        </div>

        {/* Premios individuales */}
        <div style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
          <div style={labelStyle}>Premios</div>
          <Premio emoji="⚽" label="Balón de Oro" valor={solucion['balon_oro']} valorRef={ref?.['balon_oro']} />
          <Premio emoji="👟" label="Bota de Oro" valor={solucion['bota_oro']} valorRef={ref?.['bota_oro']} />
          <Premio emoji="🧤" label="Guante de Oro" valor={solucion['guante_oro']} valorRef={ref?.['guante_oro']} />
          <Premio emoji="⭐" label="Mejor Joven" valor={solucion['mejor_joven']} valorRef={ref?.['mejor_joven']} />
          <Premio emoji="🤝" label="Fair Play" valor={solucion['juego_limpio']} valorRef={ref?.['juego_limpio']} />
          <Premio emoji="🎯" label="Gol del Torneo" valor={solucion['gol_torneo']} valorRef={ref?.['gol_torneo']} />
        </div>

      </div>
    </div>
  )
}