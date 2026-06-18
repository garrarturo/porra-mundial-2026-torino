import { getClasificados } from './torneo'

const GRUPOS_KEYS = ['A','B','C','D','E','F','G','H','I','J','K','L']

export function calcularPuntuacion(porra, solucion) {
  if (!porra || !solucion) return null

  const desglose = {
    puestos_grupos: calcularPuestosGrupos(porra, solucion),
    clasificados_16: calcularClasificados16(porra, solucion),
    clasificados_8: calcularRonda(porra, solucion, 'dec', 16, 2),
    clasificados_4: calcularRonda(porra, solucion, 'oct', 8, 4),
    clasificados_semi: calcularRonda(porra, solucion, 'cua', 4, 8),
    finalistas: calcularRonda(porra, solucion, 'semi', 2, 16),
    campeon: calcularPremio(porra, solucion, 'campeon', 32),
    tercer_clasificado: calcularPremio(porra, solucion, 'tercer_clasificado', 16),
    balon_oro: calcularPremio(porra, solucion, 'balon_oro', 32),
    bota_oro: calcularPremio(porra, solucion, 'bota_oro', 32),
    guante_oro: calcularPremio(porra, solucion, 'guante_oro', 32),
    mejor_joven: calcularPremio(porra, solucion, 'mejor_joven', 32),
    juego_limpio: calcularPremio(porra, solucion, 'juego_limpio', 32),
    gol_torneo: calcularPremio(porra, solucion, 'gol_torneo', 32),
    enfrentamientos_cuartos: calcularEnfrentamientos(porra, solucion, 'oct', 4, 8),
    enfrentamientos_semis: calcularEnfrentamientos(porra, solucion, 'cua', 2, 16),
  }

  const total = Object.values(desglose).reduce((a, b) => a + b, 0)
  return { desglose, total }
}

function calcularPuestosGrupos(porra, solucion) {
  let puntos = 0
  for (const g of GRUPOS_KEYS) {
    if (porra[`grupo_${g}_1`] && porra[`grupo_${g}_1`] === solucion[`grupo_${g}_1`]) puntos++
    if (porra[`grupo_${g}_2`] && porra[`grupo_${g}_2`] === solucion[`grupo_${g}_2`]) puntos++
    if (porra[`grupo_${g}_3`] && porra[`grupo_${g}_3`] === solucion[`grupo_${g}_3`]) puntos++
  }
  return puntos
}

function calcularClasificados16(porra, solucion) {
  const { primeros: pP, segundos: pS, tercerosClasificados: pT } = getClasificados(porra)
  const { primeros: sP, segundos: sS, tercerosClasificados: sT } = getClasificados(solucion)
  const pSet = new Set([...Object.values(pP), ...Object.values(pS), ...pT].filter(Boolean))
  const sSet = new Set([...Object.values(sP), ...Object.values(sS), ...sT].filter(Boolean))
  let puntos = 0
  for (const e of pSet) { if (sSet.has(e)) puntos++ }
  return puntos
}

// Calcula puntos por clasificados en una ronda
// prefijo: 'dec' (ganadores de dieciseisavos = clasificados a octavos), etc.
// num: cuántos ganadores hay
// pts: puntos por acierto
function calcularRonda(porra, solucion, prefijo, num, pts) {
  const pSet = new Set()
  const sSet = new Set()
  for (let i = 0; i < num; i++) {
    if (porra[`${prefijo}_${i}`]) pSet.add(porra[`${prefijo}_${i}`])
    if (solucion[`${prefijo}_${i}`]) sSet.add(solucion[`${prefijo}_${i}`])
  }
  let puntos = 0
  for (const e of pSet) { if (sSet.has(e)) puntos += pts }
  return puntos
}

// Calcula puntos por enfrentamientos correctos
// prefijo: 'oct' (partidos de octavos generados a partir de ganadores de dec), etc.
// Para cuartos: los 4 partidos son (oct_0 vs oct_1), (oct_2 vs oct_3), etc.
// Para semis: los 2 partidos son (cua_0 vs cua_1), (cua_2 vs cua_3)
function calcularEnfrentamientos(porra, solucion, prefijo, numPartidos, pts) {
  let puntos = 0
  for (let i = 0; i < numPartidos; i++) {
    const pA = porra[`${prefijo}_${i * 2}`]
    const pB = porra[`${prefijo}_${i * 2 + 1}`]
    const sA = solucion[`${prefijo}_${i * 2}`]
    const sB = solucion[`${prefijo}_${i * 2 + 1}`]
    if (!pA || !pB || !sA || !sB) continue
    const pPair = new Set([pA, pB])
    const sPair = new Set([sA, sB])
    if ([...pPair].every(e => sPair.has(e))) puntos += pts
  }
  return puntos
}

function calcularPremio(porra, solucion, key, pts) {
  if (!porra[key] || !solucion[key]) return 0
  const soluciones = solucion[key].split(',').map(s => s.trim().toLowerCase())
  const porraVal = porra[key].trim().toLowerCase()
  return soluciones.includes(porraVal) ? pts : 0
}
