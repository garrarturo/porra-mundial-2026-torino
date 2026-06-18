// ============================================================
// LÓGICA COMPLETA DEL TORNEO MUNDIAL 2026
// ============================================================

const GRUPOS_KEYS = ['A','B','C','D','E','F','G','H','I','J','K','L']

const COMBINACIONES_TERCEROS = [
  { grupos: ["E", "F", "G", "H", "I", "J", "K", "L"], rivales: ["F", "G", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["D", "F", "G", "H", "I", "J", "K", "L"], rivales: ["D", "F", "I", "J", "H", "K", "G", "L"] },
  { grupos: ["D", "E", "G", "H", "I", "J", "K", "L"], rivales: ["D", "G", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["D", "E", "F", "H", "I", "J", "K", "L"], rivales: ["D", "F", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["D", "E", "F", "G", "I", "J", "K", "L"], rivales: ["D", "F", "I", "J", "E", "K", "G", "L"] },
  { grupos: ["D", "E", "F", "G", "H", "J", "K", "L"], rivales: ["D", "F", "J", "H", "E", "K", "G", "L"] },
  { grupos: ["D", "E", "F", "G", "H", "I", "K", "L"], rivales: ["D", "F", "I", "H", "E", "K", "G", "L"] },
  { grupos: ["D", "E", "F", "G", "H", "I", "J", "L"], rivales: ["D", "F", "J", "H", "E", "I", "G", "L"] },
  { grupos: ["D", "E", "F", "G", "H", "I", "J", "K"], rivales: ["D", "F", "J", "H", "E", "K", "G", "I"] },
  { grupos: ["C", "F", "G", "H", "I", "J", "K", "L"], rivales: ["C", "F", "I", "J", "H", "K", "G", "L"] },
  { grupos: ["C", "E", "G", "H", "I", "J", "K", "L"], rivales: ["C", "G", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["C", "E", "F", "H", "I", "J", "K", "L"], rivales: ["C", "F", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["C", "E", "F", "G", "I", "J", "K", "L"], rivales: ["C", "F", "I", "J", "E", "K", "G", "L"] },
  { grupos: ["C", "E", "F", "G", "H", "J", "K", "L"], rivales: ["C", "F", "J", "H", "E", "K", "G", "L"] },
  { grupos: ["C", "E", "F", "G", "H", "I", "K", "L"], rivales: ["C", "F", "I", "H", "E", "K", "G", "L"] },
  { grupos: ["C", "E", "F", "G", "H", "I", "J", "L"], rivales: ["C", "F", "J", "H", "E", "I", "G", "L"] },
  { grupos: ["C", "E", "F", "G", "H", "I", "J", "K"], rivales: ["C", "F", "J", "H", "E", "K", "G", "I"] },
  { grupos: ["C", "D", "G", "H", "I", "J", "K", "L"], rivales: ["C", "D", "I", "J", "H", "K", "G", "L"] },
  { grupos: ["C", "D", "F", "H", "I", "J", "K", "L"], rivales: ["D", "F", "I", "H", "C", "K", "J", "L"] },
  { grupos: ["C", "D", "F", "G", "I", "J", "K", "L"], rivales: ["D", "F", "I", "J", "C", "K", "G", "L"] },
  { grupos: ["C", "D", "F", "G", "H", "J", "K", "L"], rivales: ["D", "F", "J", "H", "C", "K", "G", "L"] },
  { grupos: ["C", "D", "F", "G", "H", "I", "K", "L"], rivales: ["D", "F", "I", "H", "C", "K", "G", "L"] },
  { grupos: ["C", "D", "F", "G", "H", "I", "J", "L"], rivales: ["D", "F", "J", "H", "C", "I", "G", "L"] },
  { grupos: ["C", "D", "F", "G", "H", "I", "J", "K"], rivales: ["D", "F", "J", "H", "C", "K", "G", "I"] },
  { grupos: ["C", "D", "E", "H", "I", "J", "K", "L"], rivales: ["C", "D", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["C", "D", "E", "G", "I", "J", "K", "L"], rivales: ["C", "D", "I", "J", "E", "K", "G", "L"] },
  { grupos: ["C", "D", "E", "G", "H", "J", "K", "L"], rivales: ["C", "D", "J", "H", "E", "K", "G", "L"] },
  { grupos: ["C", "D", "E", "G", "H", "I", "K", "L"], rivales: ["C", "D", "I", "H", "E", "K", "G", "L"] },
  { grupos: ["C", "D", "E", "G", "H", "I", "J", "L"], rivales: ["C", "D", "J", "H", "E", "I", "G", "L"] },
  { grupos: ["C", "D", "E", "G", "H", "I", "J", "K"], rivales: ["C", "D", "J", "H", "E", "K", "G", "I"] },
  { grupos: ["C", "D", "E", "F", "I", "J", "K", "L"], rivales: ["D", "F", "E", "I", "C", "K", "J", "L"] },
  { grupos: ["C", "D", "E", "F", "H", "J", "K", "L"], rivales: ["D", "F", "E", "H", "C", "K", "J", "L"] },
  { grupos: ["C", "D", "E", "F", "H", "I", "K", "L"], rivales: ["D", "F", "I", "H", "C", "K", "E", "L"] },
  { grupos: ["C", "D", "E", "F", "H", "I", "J", "L"], rivales: ["D", "F", "E", "H", "C", "I", "J", "L"] },
  { grupos: ["C", "D", "E", "F", "H", "I", "J", "K"], rivales: ["D", "F", "E", "H", "C", "K", "J", "I"] },
  { grupos: ["C", "D", "E", "F", "G", "J", "K", "L"], rivales: ["D", "F", "E", "J", "C", "K", "G", "L"] },
  { grupos: ["C", "D", "E", "F", "G", "I", "K", "L"], rivales: ["D", "F", "E", "I", "C", "K", "G", "L"] },
  { grupos: ["C", "D", "E", "F", "G", "I", "J", "L"], rivales: ["D", "F", "E", "J", "C", "I", "G", "L"] },
  { grupos: ["C", "D", "E", "F", "G", "I", "J", "K"], rivales: ["D", "F", "E", "J", "C", "K", "G", "I"] },
  { grupos: ["C", "D", "E", "F", "G", "H", "K", "L"], rivales: ["D", "F", "E", "H", "C", "K", "G", "L"] },
  { grupos: ["C", "D", "E", "F", "G", "H", "J", "L"], rivales: ["D", "F", "J", "H", "C", "E", "G", "L"] },
  { grupos: ["C", "D", "E", "F", "G", "H", "J", "K"], rivales: ["D", "F", "J", "H", "C", "K", "G", "E"] },
  { grupos: ["C", "D", "E", "F", "G", "H", "I", "L"], rivales: ["D", "F", "E", "H", "C", "I", "G", "L"] },
  { grupos: ["C", "D", "E", "F", "G", "H", "I", "K"], rivales: ["D", "F", "E", "H", "C", "K", "G", "I"] },
  { grupos: ["C", "D", "E", "F", "G", "H", "I", "J"], rivales: ["D", "F", "J", "H", "C", "I", "G", "E"] },
  { grupos: ["B", "F", "G", "H", "I", "J", "K", "L"], rivales: ["F", "G", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["B", "E", "G", "H", "I", "J", "K", "L"], rivales: ["B", "G", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "E", "F", "H", "I", "J", "K", "L"], rivales: ["F", "H", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "E", "F", "G", "I", "J", "K", "L"], rivales: ["F", "G", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "E", "F", "G", "H", "J", "K", "L"], rivales: ["F", "G", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "E", "F", "G", "H", "I", "K", "L"], rivales: ["F", "H", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["B", "E", "F", "G", "H", "I", "J", "L"], rivales: ["F", "G", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["B", "E", "F", "G", "H", "I", "J", "K"], rivales: ["F", "G", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["B", "D", "G", "H", "I", "J", "K", "L"], rivales: ["D", "G", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["B", "D", "F", "H", "I", "J", "K", "L"], rivales: ["D", "F", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["B", "D", "F", "G", "I", "J", "K", "L"], rivales: ["D", "F", "B", "J", "I", "K", "G", "L"] },
  { grupos: ["B", "D", "F", "G", "H", "J", "K", "L"], rivales: ["D", "F", "B", "J", "H", "K", "G", "L"] },
  { grupos: ["B", "D", "F", "G", "H", "I", "K", "L"], rivales: ["D", "F", "B", "I", "H", "K", "G", "L"] },
  { grupos: ["B", "D", "F", "G", "H", "I", "J", "L"], rivales: ["D", "F", "B", "J", "H", "I", "G", "L"] },
  { grupos: ["B", "D", "F", "G", "H", "I", "J", "K"], rivales: ["D", "F", "B", "J", "H", "K", "G", "I"] },
  { grupos: ["B", "D", "E", "H", "I", "J", "K", "L"], rivales: ["D", "H", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "D", "E", "G", "I", "J", "K", "L"], rivales: ["D", "G", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "D", "E", "G", "H", "J", "K", "L"], rivales: ["D", "G", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "D", "E", "G", "H", "I", "K", "L"], rivales: ["D", "H", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["B", "D", "E", "G", "H", "I", "J", "L"], rivales: ["D", "G", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["B", "D", "E", "G", "H", "I", "J", "K"], rivales: ["D", "G", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["B", "D", "E", "F", "I", "J", "K", "L"], rivales: ["D", "F", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "D", "E", "F", "H", "J", "K", "L"], rivales: ["D", "F", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "D", "E", "F", "H", "I", "K", "L"], rivales: ["D", "F", "B", "H", "E", "K", "I", "L"] },
  { grupos: ["B", "D", "E", "F", "H", "I", "J", "L"], rivales: ["D", "F", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["B", "D", "E", "F", "H", "I", "J", "K"], rivales: ["D", "F", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["B", "D", "E", "F", "G", "J", "K", "L"], rivales: ["D", "F", "B", "J", "E", "K", "G", "L"] },
  { grupos: ["B", "D", "E", "F", "G", "I", "K", "L"], rivales: ["D", "F", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["B", "D", "E", "F", "G", "I", "J", "L"], rivales: ["D", "F", "B", "J", "E", "I", "G", "L"] },
  { grupos: ["B", "D", "E", "F", "G", "I", "J", "K"], rivales: ["D", "F", "B", "J", "E", "K", "G", "I"] },
  { grupos: ["B", "D", "E", "F", "G", "H", "K", "L"], rivales: ["D", "F", "B", "H", "E", "K", "G", "L"] },
  { grupos: ["B", "D", "E", "F", "G", "H", "J", "L"], rivales: ["D", "F", "B", "J", "H", "E", "G", "L"] },
  { grupos: ["B", "D", "E", "F", "G", "H", "J", "K"], rivales: ["D", "F", "B", "J", "H", "K", "G", "E"] },
  { grupos: ["B", "D", "E", "F", "G", "H", "I", "L"], rivales: ["D", "F", "B", "H", "E", "I", "G", "L"] },
  { grupos: ["B", "D", "E", "F", "G", "H", "I", "K"], rivales: ["D", "F", "B", "H", "E", "K", "G", "I"] },
  { grupos: ["B", "D", "E", "F", "G", "H", "I", "J"], rivales: ["D", "F", "B", "J", "H", "I", "G", "E"] },
  { grupos: ["B", "C", "G", "H", "I", "J", "K", "L"], rivales: ["C", "G", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["B", "C", "F", "H", "I", "J", "K", "L"], rivales: ["C", "F", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["B", "C", "F", "G", "I", "J", "K", "L"], rivales: ["C", "F", "B", "J", "I", "K", "G", "L"] },
  { grupos: ["B", "C", "F", "G", "H", "J", "K", "L"], rivales: ["C", "F", "B", "J", "H", "K", "G", "L"] },
  { grupos: ["B", "C", "F", "G", "H", "I", "K", "L"], rivales: ["C", "F", "B", "I", "H", "K", "G", "L"] },
  { grupos: ["B", "C", "F", "G", "H", "I", "J", "L"], rivales: ["C", "F", "B", "J", "H", "I", "G", "L"] },
  { grupos: ["B", "C", "F", "G", "H", "I", "J", "K"], rivales: ["C", "F", "B", "J", "H", "K", "G", "I"] },
  { grupos: ["B", "C", "E", "H", "I", "J", "K", "L"], rivales: ["C", "H", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "E", "G", "I", "J", "K", "L"], rivales: ["C", "G", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "E", "G", "H", "J", "K", "L"], rivales: ["C", "G", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "E", "G", "H", "I", "K", "L"], rivales: ["C", "H", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "E", "G", "H", "I", "J", "L"], rivales: ["C", "G", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["B", "C", "E", "G", "H", "I", "J", "K"], rivales: ["C", "G", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["B", "C", "E", "F", "I", "J", "K", "L"], rivales: ["C", "F", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "E", "F", "H", "J", "K", "L"], rivales: ["C", "F", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "E", "F", "H", "I", "K", "L"], rivales: ["C", "F", "B", "H", "E", "K", "I", "L"] },
  { grupos: ["B", "C", "E", "F", "H", "I", "J", "L"], rivales: ["C", "F", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["B", "C", "E", "F", "H", "I", "J", "K"], rivales: ["C", "F", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["B", "C", "E", "F", "G", "J", "K", "L"], rivales: ["C", "F", "B", "J", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "E", "F", "G", "I", "K", "L"], rivales: ["C", "F", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "E", "F", "G", "I", "J", "L"], rivales: ["C", "F", "B", "J", "E", "I", "G", "L"] },
  { grupos: ["B", "C", "E", "F", "G", "I", "J", "K"], rivales: ["C", "F", "B", "J", "E", "K", "G", "I"] },
  { grupos: ["B", "C", "E", "F", "G", "H", "K", "L"], rivales: ["C", "F", "B", "H", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "E", "F", "G", "H", "J", "L"], rivales: ["C", "F", "B", "J", "H", "E", "G", "L"] },
  { grupos: ["B", "C", "E", "F", "G", "H", "J", "K"], rivales: ["C", "F", "B", "J", "H", "K", "G", "E"] },
  { grupos: ["B", "C", "E", "F", "G", "H", "I", "L"], rivales: ["C", "F", "B", "H", "E", "I", "G", "L"] },
  { grupos: ["B", "C", "E", "F", "G", "H", "I", "K"], rivales: ["C", "F", "B", "H", "E", "K", "G", "I"] },
  { grupos: ["B", "C", "E", "F", "G", "H", "I", "J"], rivales: ["C", "F", "B", "J", "H", "I", "G", "E"] },
  { grupos: ["B", "C", "D", "H", "I", "J", "K", "L"], rivales: ["C", "D", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["B", "C", "D", "G", "I", "J", "K", "L"], rivales: ["C", "D", "B", "J", "I", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "G", "H", "J", "K", "L"], rivales: ["C", "D", "B", "J", "H", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "G", "H", "I", "K", "L"], rivales: ["C", "D", "B", "I", "H", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "G", "H", "I", "J", "L"], rivales: ["C", "D", "B", "J", "H", "I", "G", "L"] },
  { grupos: ["B", "C", "D", "G", "H", "I", "J", "K"], rivales: ["C", "D", "B", "J", "H", "K", "G", "I"] },
  { grupos: ["B", "C", "D", "F", "I", "J", "K", "L"], rivales: ["D", "F", "B", "I", "C", "K", "J", "L"] },
  { grupos: ["B", "C", "D", "F", "H", "J", "K", "L"], rivales: ["D", "F", "B", "H", "C", "K", "J", "L"] },
  { grupos: ["B", "C", "D", "F", "H", "I", "K", "L"], rivales: ["D", "F", "B", "H", "C", "K", "I", "L"] },
  { grupos: ["B", "C", "D", "F", "H", "I", "J", "L"], rivales: ["D", "F", "B", "H", "C", "I", "J", "L"] },
  { grupos: ["B", "C", "D", "F", "H", "I", "J", "K"], rivales: ["D", "F", "B", "H", "C", "K", "J", "I"] },
  { grupos: ["B", "C", "D", "F", "G", "J", "K", "L"], rivales: ["D", "F", "B", "J", "C", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "F", "G", "I", "K", "L"], rivales: ["D", "F", "B", "I", "C", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "F", "G", "I", "J", "L"], rivales: ["D", "F", "B", "J", "C", "I", "G", "L"] },
  { grupos: ["B", "C", "D", "F", "G", "I", "J", "K"], rivales: ["D", "F", "B", "J", "C", "K", "G", "I"] },
  { grupos: ["B", "C", "D", "F", "G", "H", "K", "L"], rivales: ["D", "F", "B", "H", "C", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "F", "G", "H", "J", "L"], rivales: ["D", "F", "B", "H", "C", "J", "G", "L"] },
  { grupos: ["B", "C", "D", "F", "G", "H", "J", "K"], rivales: ["C", "F", "B", "J", "H", "K", "G", "D"] },
  { grupos: ["B", "C", "D", "F", "G", "H", "I", "L"], rivales: ["D", "F", "B", "H", "C", "I", "G", "L"] },
  { grupos: ["B", "C", "D", "F", "G", "H", "I", "K"], rivales: ["D", "F", "B", "H", "C", "K", "G", "I"] },
  { grupos: ["B", "C", "D", "F", "G", "H", "I", "J"], rivales: ["C", "F", "B", "J", "H", "I", "G", "D"] },
  { grupos: ["B", "C", "D", "E", "I", "J", "K", "L"], rivales: ["C", "D", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "D", "E", "H", "J", "K", "L"], rivales: ["C", "D", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["B", "C", "D", "E", "H", "I", "K", "L"], rivales: ["C", "D", "B", "H", "E", "K", "I", "L"] },
  { grupos: ["B", "C", "D", "E", "H", "I", "J", "L"], rivales: ["C", "D", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["B", "C", "D", "E", "H", "I", "J", "K"], rivales: ["C", "D", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["B", "C", "D", "E", "G", "J", "K", "L"], rivales: ["C", "D", "B", "J", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "G", "I", "K", "L"], rivales: ["C", "D", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "G", "I", "J", "L"], rivales: ["C", "D", "B", "J", "E", "I", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "G", "I", "J", "K"], rivales: ["C", "D", "B", "J", "E", "K", "G", "I"] },
  { grupos: ["B", "C", "D", "E", "G", "H", "K", "L"], rivales: ["C", "D", "B", "H", "E", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "G", "H", "J", "L"], rivales: ["C", "D", "B", "J", "H", "E", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "G", "H", "J", "K"], rivales: ["C", "D", "B", "J", "H", "K", "G", "E"] },
  { grupos: ["B", "C", "D", "E", "G", "H", "I", "L"], rivales: ["C", "D", "B", "H", "E", "I", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "G", "H", "I", "K"], rivales: ["C", "D", "B", "H", "E", "K", "G", "I"] },
  { grupos: ["B", "C", "D", "E", "G", "H", "I", "J"], rivales: ["C", "D", "B", "J", "H", "I", "G", "E"] },
  { grupos: ["B", "C", "D", "E", "F", "J", "K", "L"], rivales: ["D", "F", "B", "E", "C", "K", "J", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "I", "K", "L"], rivales: ["D", "F", "B", "I", "C", "K", "E", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "I", "J", "L"], rivales: ["D", "F", "B", "E", "C", "I", "J", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "I", "J", "K"], rivales: ["D", "F", "B", "E", "C", "K", "J", "I"] },
  { grupos: ["B", "C", "D", "E", "F", "H", "K", "L"], rivales: ["D", "F", "B", "H", "C", "K", "E", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "H", "J", "L"], rivales: ["D", "F", "B", "H", "C", "E", "J", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "H", "J", "K"], rivales: ["D", "F", "B", "H", "C", "K", "J", "E"] },
  { grupos: ["B", "C", "D", "E", "F", "H", "I", "L"], rivales: ["D", "F", "B", "H", "C", "I", "E", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "H", "I", "K"], rivales: ["D", "F", "B", "H", "C", "K", "E", "I"] },
  { grupos: ["B", "C", "D", "E", "F", "H", "I", "J"], rivales: ["D", "F", "B", "H", "C", "I", "J", "E"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "K", "L"], rivales: ["D", "F", "B", "E", "C", "K", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "J", "L"], rivales: ["D", "F", "B", "J", "C", "E", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "J", "K"], rivales: ["D", "F", "B", "J", "C", "K", "G", "E"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "I", "L"], rivales: ["D", "F", "B", "E", "C", "I", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "I", "K"], rivales: ["D", "F", "B", "E", "C", "K", "G", "I"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "I", "J"], rivales: ["D", "F", "B", "J", "C", "I", "G", "E"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "H", "L"], rivales: ["D", "F", "B", "H", "C", "E", "G", "L"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "H", "K"], rivales: ["D", "F", "B", "H", "C", "K", "G", "E"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "H", "J"], rivales: ["C", "F", "B", "J", "H", "E", "G", "D"] },
  { grupos: ["B", "C", "D", "E", "F", "G", "H", "I"], rivales: ["D", "F", "B", "H", "C", "I", "G", "E"] },
  { grupos: ["A", "F", "G", "H", "I", "J", "K", "L"], rivales: ["F", "G", "I", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "E", "G", "H", "I", "J", "K", "L"], rivales: ["A", "G", "I", "H", "E", "K", "J", "L"] },
  { grupos: ["A", "E", "F", "H", "I", "J", "K", "L"], rivales: ["F", "H", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "E", "F", "G", "I", "J", "K", "L"], rivales: ["F", "G", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "E", "F", "G", "H", "J", "K", "L"], rivales: ["F", "H", "J", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "E", "F", "G", "H", "I", "K", "L"], rivales: ["F", "H", "I", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "E", "F", "G", "H", "I", "J", "L"], rivales: ["F", "H", "J", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "E", "F", "G", "H", "I", "J", "K"], rivales: ["F", "H", "J", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "D", "G", "H", "I", "J", "K", "L"], rivales: ["D", "G", "I", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "D", "F", "H", "I", "J", "K", "L"], rivales: ["D", "F", "I", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "D", "F", "G", "I", "J", "K", "L"], rivales: ["D", "F", "J", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "D", "F", "G", "H", "J", "K", "L"], rivales: ["D", "F", "J", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "D", "F", "G", "H", "I", "K", "L"], rivales: ["D", "F", "I", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "D", "F", "G", "H", "I", "J", "L"], rivales: ["D", "F", "J", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "D", "F", "G", "H", "I", "J", "K"], rivales: ["D", "F", "J", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "D", "E", "H", "I", "J", "K", "L"], rivales: ["D", "H", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "D", "E", "G", "I", "J", "K", "L"], rivales: ["D", "G", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "D", "E", "G", "H", "J", "K", "L"], rivales: ["D", "H", "J", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "D", "E", "G", "H", "I", "K", "L"], rivales: ["D", "H", "I", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "D", "E", "G", "H", "I", "J", "L"], rivales: ["D", "H", "J", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "D", "E", "G", "H", "I", "J", "K"], rivales: ["D", "H", "J", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "D", "E", "F", "I", "J", "K", "L"], rivales: ["D", "F", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "D", "E", "F", "H", "J", "K", "L"], rivales: ["D", "F", "E", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "D", "E", "F", "H", "I", "K", "L"], rivales: ["D", "F", "I", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "D", "E", "F", "H", "I", "J", "L"], rivales: ["D", "F", "E", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "D", "E", "F", "H", "I", "J", "K"], rivales: ["D", "F", "E", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "D", "E", "F", "G", "J", "K", "L"], rivales: ["D", "F", "J", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "D", "E", "F", "G", "I", "K", "L"], rivales: ["D", "F", "I", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "D", "E", "F", "G", "I", "J", "L"], rivales: ["D", "F", "J", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "D", "E", "F", "G", "I", "J", "K"], rivales: ["D", "F", "J", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "D", "E", "F", "G", "H", "K", "L"], rivales: ["D", "F", "E", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "D", "E", "F", "G", "H", "J", "L"], rivales: ["D", "F", "J", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "D", "E", "F", "G", "H", "J", "K"], rivales: ["D", "F", "J", "A", "H", "K", "G", "E"] },
  { grupos: ["A", "D", "E", "F", "G", "H", "I", "L"], rivales: ["D", "F", "E", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "D", "E", "F", "G", "H", "I", "K"], rivales: ["D", "F", "E", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "D", "E", "F", "G", "H", "I", "J"], rivales: ["D", "F", "J", "A", "H", "I", "G", "E"] },
  { grupos: ["A", "C", "G", "H", "I", "J", "K", "L"], rivales: ["C", "G", "I", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "C", "F", "H", "I", "J", "K", "L"], rivales: ["C", "F", "I", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "C", "F", "G", "I", "J", "K", "L"], rivales: ["C", "F", "J", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "C", "F", "G", "H", "J", "K", "L"], rivales: ["C", "F", "J", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "F", "G", "H", "I", "K", "L"], rivales: ["C", "F", "I", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "F", "G", "H", "I", "J", "L"], rivales: ["C", "F", "J", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "C", "F", "G", "H", "I", "J", "K"], rivales: ["C", "F", "J", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "C", "E", "H", "I", "J", "K", "L"], rivales: ["C", "H", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "C", "E", "G", "I", "J", "K", "L"], rivales: ["C", "G", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "C", "E", "G", "H", "J", "K", "L"], rivales: ["C", "H", "J", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "C", "E", "G", "H", "I", "K", "L"], rivales: ["C", "H", "I", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "C", "E", "G", "H", "I", "J", "L"], rivales: ["C", "H", "J", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "C", "E", "G", "H", "I", "J", "K"], rivales: ["C", "H", "J", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "C", "E", "F", "I", "J", "K", "L"], rivales: ["C", "F", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "C", "E", "F", "H", "J", "K", "L"], rivales: ["C", "F", "E", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "C", "E", "F", "H", "I", "K", "L"], rivales: ["C", "F", "I", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "C", "E", "F", "H", "I", "J", "L"], rivales: ["C", "F", "E", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "C", "E", "F", "H", "I", "J", "K"], rivales: ["C", "F", "E", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "C", "E", "F", "G", "J", "K", "L"], rivales: ["C", "F", "J", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "C", "E", "F", "G", "I", "K", "L"], rivales: ["C", "F", "I", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "C", "E", "F", "G", "I", "J", "L"], rivales: ["C", "F", "J", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "C", "E", "F", "G", "I", "J", "K"], rivales: ["C", "F", "J", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "C", "E", "F", "G", "H", "K", "L"], rivales: ["C", "F", "E", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "E", "F", "G", "H", "J", "L"], rivales: ["C", "F", "J", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "C", "E", "F", "G", "H", "J", "K"], rivales: ["C", "F", "J", "A", "H", "K", "G", "E"] },
  { grupos: ["A", "C", "E", "F", "G", "H", "I", "L"], rivales: ["C", "F", "E", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "C", "E", "F", "G", "H", "I", "K"], rivales: ["C", "F", "E", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "C", "E", "F", "G", "H", "I", "J"], rivales: ["C", "F", "J", "A", "H", "I", "G", "E"] },
  { grupos: ["A", "C", "D", "H", "I", "J", "K", "L"], rivales: ["C", "D", "I", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "C", "D", "G", "I", "J", "K", "L"], rivales: ["C", "D", "J", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "G", "H", "J", "K", "L"], rivales: ["C", "D", "J", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "G", "H", "I", "K", "L"], rivales: ["C", "D", "I", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "G", "H", "I", "J", "L"], rivales: ["C", "D", "J", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "C", "D", "G", "H", "I", "J", "K"], rivales: ["C", "D", "J", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "C", "D", "F", "I", "J", "K", "L"], rivales: ["D", "F", "I", "A", "C", "K", "J", "L"] },
  { grupos: ["A", "C", "D", "F", "H", "J", "K", "L"], rivales: ["C", "D", "F", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "C", "D", "F", "H", "I", "K", "L"], rivales: ["C", "D", "I", "A", "H", "K", "F", "L"] },
  { grupos: ["A", "C", "D", "F", "H", "I", "J", "L"], rivales: ["C", "D", "F", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "C", "D", "F", "H", "I", "J", "K"], rivales: ["C", "D", "F", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "C", "D", "F", "G", "J", "K", "L"], rivales: ["D", "F", "J", "A", "C", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "F", "G", "I", "K", "L"], rivales: ["D", "F", "I", "A", "C", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "F", "G", "I", "J", "L"], rivales: ["D", "F", "J", "A", "C", "I", "G", "L"] },
  { grupos: ["A", "C", "D", "F", "G", "I", "J", "K"], rivales: ["D", "F", "J", "A", "C", "K", "G", "I"] },
  { grupos: ["A", "C", "D", "F", "G", "H", "K", "L"], rivales: ["C", "D", "F", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "F", "G", "H", "J", "L"], rivales: ["D", "F", "J", "A", "C", "H", "G", "L"] },
  { grupos: ["A", "C", "D", "F", "G", "H", "J", "K"], rivales: ["C", "F", "J", "A", "H", "K", "G", "D"] },
  { grupos: ["A", "C", "D", "F", "G", "H", "I", "L"], rivales: ["C", "D", "F", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "C", "D", "F", "G", "H", "I", "K"], rivales: ["C", "D", "F", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "C", "D", "F", "G", "H", "I", "J"], rivales: ["C", "F", "J", "A", "H", "I", "G", "D"] },
  { grupos: ["A", "C", "D", "E", "I", "J", "K", "L"], rivales: ["C", "D", "I", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "C", "D", "E", "H", "J", "K", "L"], rivales: ["C", "D", "E", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "C", "D", "E", "H", "I", "K", "L"], rivales: ["C", "D", "I", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "C", "D", "E", "H", "I", "J", "L"], rivales: ["C", "D", "E", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "C", "D", "E", "H", "I", "J", "K"], rivales: ["C", "D", "E", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "C", "D", "E", "G", "J", "K", "L"], rivales: ["C", "D", "J", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "G", "I", "K", "L"], rivales: ["C", "D", "I", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "G", "I", "J", "L"], rivales: ["C", "D", "J", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "G", "I", "J", "K"], rivales: ["C", "D", "J", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "C", "D", "E", "G", "H", "K", "L"], rivales: ["C", "D", "E", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "G", "H", "J", "L"], rivales: ["C", "D", "J", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "G", "H", "J", "K"], rivales: ["C", "D", "J", "A", "H", "K", "G", "E"] },
  { grupos: ["A", "C", "D", "E", "G", "H", "I", "L"], rivales: ["C", "D", "E", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "G", "H", "I", "K"], rivales: ["C", "D", "E", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "C", "D", "E", "G", "H", "I", "J"], rivales: ["C", "D", "J", "A", "H", "I", "G", "E"] },
  { grupos: ["A", "C", "D", "E", "F", "J", "K", "L"], rivales: ["D", "F", "E", "A", "C", "K", "J", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "I", "K", "L"], rivales: ["D", "F", "I", "A", "C", "K", "E", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "I", "J", "L"], rivales: ["D", "F", "E", "A", "C", "I", "J", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "I", "J", "K"], rivales: ["D", "F", "E", "A", "C", "K", "J", "I"] },
  { grupos: ["A", "C", "D", "E", "F", "H", "K", "L"], rivales: ["C", "D", "F", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "H", "J", "L"], rivales: ["C", "D", "F", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "H", "J", "K"], rivales: ["C", "F", "E", "A", "H", "K", "J", "D"] },
  { grupos: ["A", "C", "D", "E", "F", "H", "I", "L"], rivales: ["C", "D", "F", "A", "H", "I", "E", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "H", "I", "K"], rivales: ["C", "D", "F", "A", "H", "K", "E", "I"] },
  { grupos: ["A", "C", "D", "E", "F", "H", "I", "J"], rivales: ["C", "F", "E", "A", "H", "I", "J", "D"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "K", "L"], rivales: ["D", "F", "E", "A", "C", "K", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "J", "L"], rivales: ["D", "F", "J", "A", "C", "E", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "J", "K"], rivales: ["D", "F", "J", "A", "C", "K", "G", "E"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "I", "L"], rivales: ["D", "F", "E", "A", "C", "I", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "I", "K"], rivales: ["D", "F", "E", "A", "C", "K", "G", "I"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "I", "J"], rivales: ["D", "F", "J", "A", "C", "I", "G", "E"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "H", "L"], rivales: ["C", "D", "F", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "H", "K"], rivales: ["C", "F", "E", "A", "H", "K", "G", "D"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "H", "J"], rivales: ["C", "F", "J", "A", "H", "E", "G", "D"] },
  { grupos: ["A", "C", "D", "E", "F", "G", "H", "I"], rivales: ["C", "F", "E", "A", "H", "I", "G", "D"] },
  { grupos: ["A", "B", "G", "H", "I", "J", "K", "L"], rivales: ["A", "G", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "F", "H", "I", "J", "K", "L"], rivales: ["A", "F", "B", "I", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "F", "G", "I", "J", "K", "L"], rivales: ["F", "G", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "F", "G", "H", "J", "K", "L"], rivales: ["F", "G", "B", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "F", "G", "H", "I", "K", "L"], rivales: ["A", "F", "B", "I", "H", "K", "G", "L"] },
  { grupos: ["A", "B", "F", "G", "H", "I", "J", "L"], rivales: ["F", "G", "B", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "B", "F", "G", "H", "I", "J", "K"], rivales: ["F", "G", "B", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "B", "E", "H", "I", "J", "K", "L"], rivales: ["A", "H", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "E", "G", "I", "J", "K", "L"], rivales: ["A", "G", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "E", "G", "H", "J", "K", "L"], rivales: ["A", "G", "B", "H", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "E", "G", "H", "I", "K", "L"], rivales: ["A", "H", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "E", "G", "H", "I", "J", "L"], rivales: ["A", "G", "B", "H", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "E", "G", "H", "I", "J", "K"], rivales: ["A", "G", "B", "H", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "E", "F", "I", "J", "K", "L"], rivales: ["A", "F", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "E", "F", "H", "J", "K", "L"], rivales: ["F", "H", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "E", "F", "H", "I", "K", "L"], rivales: ["F", "H", "B", "A", "E", "K", "I", "L"] },
  { grupos: ["A", "B", "E", "F", "H", "I", "J", "L"], rivales: ["F", "H", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "E", "F", "H", "I", "J", "K"], rivales: ["F", "H", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "E", "F", "G", "J", "K", "L"], rivales: ["F", "G", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "E", "F", "G", "I", "K", "L"], rivales: ["A", "F", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "E", "F", "G", "I", "J", "L"], rivales: ["F", "G", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "E", "F", "G", "I", "J", "K"], rivales: ["F", "G", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "E", "F", "G", "H", "K", "L"], rivales: ["F", "H", "B", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "E", "F", "G", "H", "J", "L"], rivales: ["F", "G", "B", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "B", "E", "F", "G", "H", "J", "K"], rivales: ["F", "G", "B", "A", "H", "K", "J", "E"] },
  { grupos: ["A", "B", "E", "F", "G", "H", "I", "L"], rivales: ["F", "H", "B", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "B", "E", "F", "G", "H", "I", "K"], rivales: ["F", "H", "B", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "B", "E", "F", "G", "H", "I", "J"], rivales: ["F", "G", "B", "A", "H", "I", "J", "E"] },
  { grupos: ["A", "B", "D", "H", "I", "J", "K", "L"], rivales: ["D", "H", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "G", "I", "J", "K", "L"], rivales: ["D", "G", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "G", "H", "J", "K", "L"], rivales: ["D", "G", "B", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "G", "H", "I", "K", "L"], rivales: ["D", "H", "B", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "B", "D", "G", "H", "I", "J", "L"], rivales: ["D", "G", "B", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "B", "D", "G", "H", "I", "J", "K"], rivales: ["D", "G", "B", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "B", "D", "F", "I", "J", "K", "L"], rivales: ["D", "F", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "F", "H", "J", "K", "L"], rivales: ["D", "F", "B", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "F", "H", "I", "K", "L"], rivales: ["D", "F", "B", "A", "H", "K", "I", "L"] },
  { grupos: ["A", "B", "D", "F", "H", "I", "J", "L"], rivales: ["D", "F", "B", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "B", "D", "F", "H", "I", "J", "K"], rivales: ["D", "F", "B", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "B", "D", "F", "G", "J", "K", "L"], rivales: ["D", "G", "B", "A", "F", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "F", "G", "I", "K", "L"], rivales: ["D", "F", "B", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "B", "D", "F", "G", "I", "J", "L"], rivales: ["D", "G", "B", "A", "F", "I", "J", "L"] },
  { grupos: ["A", "B", "D", "F", "G", "I", "J", "K"], rivales: ["D", "G", "B", "A", "F", "K", "J", "I"] },
  { grupos: ["A", "B", "D", "F", "G", "H", "K", "L"], rivales: ["D", "F", "B", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "B", "D", "F", "G", "H", "J", "L"], rivales: ["D", "F", "B", "A", "H", "J", "G", "L"] },
  { grupos: ["A", "B", "D", "F", "G", "H", "J", "K"], rivales: ["D", "F", "B", "A", "H", "K", "G", "J"] },
  { grupos: ["A", "B", "D", "F", "G", "H", "I", "L"], rivales: ["D", "F", "B", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "B", "D", "F", "G", "H", "I", "K"], rivales: ["D", "F", "B", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "B", "D", "F", "G", "H", "I", "J"], rivales: ["D", "F", "B", "A", "H", "J", "G", "I"] },
  { grupos: ["A", "B", "D", "E", "I", "J", "K", "L"], rivales: ["A", "D", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "H", "J", "K", "L"], rivales: ["D", "H", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "H", "I", "K", "L"], rivales: ["D", "H", "B", "A", "E", "K", "I", "L"] },
  { grupos: ["A", "B", "D", "E", "H", "I", "J", "L"], rivales: ["D", "H", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "H", "I", "J", "K"], rivales: ["D", "H", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "D", "E", "G", "J", "K", "L"], rivales: ["D", "G", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "G", "I", "K", "L"], rivales: ["A", "D", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "G", "I", "J", "L"], rivales: ["D", "G", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "G", "I", "J", "K"], rivales: ["D", "G", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "D", "E", "G", "H", "K", "L"], rivales: ["D", "H", "B", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "G", "H", "J", "L"], rivales: ["D", "G", "B", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "G", "H", "J", "K"], rivales: ["D", "G", "B", "A", "H", "K", "J", "E"] },
  { grupos: ["A", "B", "D", "E", "G", "H", "I", "L"], rivales: ["D", "H", "B", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "G", "H", "I", "K"], rivales: ["D", "H", "B", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "B", "D", "E", "G", "H", "I", "J"], rivales: ["D", "G", "B", "A", "H", "I", "J", "E"] },
  { grupos: ["A", "B", "D", "E", "F", "J", "K", "L"], rivales: ["D", "F", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "I", "K", "L"], rivales: ["D", "F", "B", "A", "E", "K", "I", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "I", "J", "L"], rivales: ["D", "F", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "I", "J", "K"], rivales: ["D", "F", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "D", "E", "F", "H", "K", "L"], rivales: ["D", "F", "B", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "H", "J", "L"], rivales: ["D", "F", "B", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "H", "J", "K"], rivales: ["D", "F", "B", "A", "H", "K", "J", "E"] },
  { grupos: ["A", "B", "D", "E", "F", "H", "I", "L"], rivales: ["D", "F", "B", "A", "H", "I", "E", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "H", "I", "K"], rivales: ["D", "F", "B", "A", "H", "K", "E", "I"] },
  { grupos: ["A", "B", "D", "E", "F", "H", "I", "J"], rivales: ["D", "F", "B", "A", "H", "I", "J", "E"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "K", "L"], rivales: ["D", "F", "B", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "J", "L"], rivales: ["D", "F", "B", "A", "E", "J", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "J", "K"], rivales: ["D", "F", "B", "A", "E", "K", "G", "J"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "I", "L"], rivales: ["D", "F", "B", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "I", "K"], rivales: ["D", "F", "B", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "I", "J"], rivales: ["D", "F", "B", "A", "E", "J", "G", "I"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "H", "L"], rivales: ["D", "F", "B", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "H", "K"], rivales: ["D", "F", "B", "A", "H", "K", "G", "E"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "H", "J"], rivales: ["D", "F", "B", "A", "H", "J", "G", "E"] },
  { grupos: ["A", "B", "D", "E", "F", "G", "H", "I"], rivales: ["D", "F", "B", "A", "H", "I", "G", "E"] },
  { grupos: ["A", "B", "C", "H", "I", "J", "K", "L"], rivales: ["C", "H", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "G", "I", "J", "K", "L"], rivales: ["C", "G", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "G", "H", "J", "K", "L"], rivales: ["C", "G", "B", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "G", "H", "I", "K", "L"], rivales: ["C", "H", "B", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "G", "H", "I", "J", "L"], rivales: ["C", "G", "B", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "G", "H", "I", "J", "K"], rivales: ["C", "G", "B", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "F", "I", "J", "K", "L"], rivales: ["C", "F", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "F", "H", "J", "K", "L"], rivales: ["C", "F", "B", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "F", "H", "I", "K", "L"], rivales: ["C", "F", "B", "A", "H", "K", "I", "L"] },
  { grupos: ["A", "B", "C", "F", "H", "I", "J", "L"], rivales: ["C", "F", "B", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "F", "H", "I", "J", "K"], rivales: ["C", "F", "B", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "F", "G", "J", "K", "L"], rivales: ["F", "G", "B", "A", "C", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "F", "G", "I", "K", "L"], rivales: ["C", "F", "B", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "F", "G", "I", "J", "L"], rivales: ["F", "G", "B", "A", "C", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "F", "G", "I", "J", "K"], rivales: ["F", "G", "B", "A", "C", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "F", "G", "H", "K", "L"], rivales: ["C", "F", "B", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "F", "G", "H", "J", "L"], rivales: ["C", "F", "B", "A", "H", "J", "G", "L"] },
  { grupos: ["A", "B", "C", "F", "G", "H", "J", "K"], rivales: ["C", "F", "B", "A", "H", "K", "G", "J"] },
  { grupos: ["A", "B", "C", "F", "G", "H", "I", "L"], rivales: ["C", "F", "B", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "B", "C", "F", "G", "H", "I", "K"], rivales: ["C", "F", "B", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "B", "C", "F", "G", "H", "I", "J"], rivales: ["C", "F", "B", "A", "H", "J", "G", "I"] },
  { grupos: ["A", "B", "C", "E", "I", "J", "K", "L"], rivales: ["A", "C", "B", "I", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "H", "J", "K", "L"], rivales: ["C", "H", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "H", "I", "K", "L"], rivales: ["C", "H", "B", "A", "E", "K", "I", "L"] },
  { grupos: ["A", "B", "C", "E", "H", "I", "J", "L"], rivales: ["C", "H", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "H", "I", "J", "K"], rivales: ["C", "H", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "E", "G", "J", "K", "L"], rivales: ["C", "G", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "G", "I", "K", "L"], rivales: ["A", "C", "B", "I", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "G", "I", "J", "L"], rivales: ["C", "G", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "G", "I", "J", "K"], rivales: ["C", "G", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "E", "G", "H", "K", "L"], rivales: ["C", "H", "B", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "G", "H", "J", "L"], rivales: ["C", "G", "B", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "G", "H", "J", "K"], rivales: ["C", "G", "B", "A", "H", "K", "J", "E"] },
  { grupos: ["A", "B", "C", "E", "G", "H", "I", "L"], rivales: ["C", "H", "B", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "G", "H", "I", "K"], rivales: ["C", "H", "B", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "B", "C", "E", "G", "H", "I", "J"], rivales: ["C", "G", "B", "A", "H", "I", "J", "E"] },
  { grupos: ["A", "B", "C", "E", "F", "J", "K", "L"], rivales: ["C", "F", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "I", "K", "L"], rivales: ["C", "F", "B", "A", "E", "K", "I", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "I", "J", "L"], rivales: ["C", "F", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "I", "J", "K"], rivales: ["C", "F", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "E", "F", "H", "K", "L"], rivales: ["C", "F", "B", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "H", "J", "L"], rivales: ["C", "F", "B", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "H", "J", "K"], rivales: ["C", "F", "B", "A", "H", "K", "J", "E"] },
  { grupos: ["A", "B", "C", "E", "F", "H", "I", "L"], rivales: ["C", "F", "B", "A", "H", "I", "E", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "H", "I", "K"], rivales: ["C", "F", "B", "A", "H", "K", "E", "I"] },
  { grupos: ["A", "B", "C", "E", "F", "H", "I", "J"], rivales: ["C", "F", "B", "A", "H", "I", "J", "E"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "K", "L"], rivales: ["C", "F", "B", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "J", "L"], rivales: ["C", "F", "B", "A", "E", "J", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "J", "K"], rivales: ["C", "F", "B", "A", "E", "K", "G", "J"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "I", "L"], rivales: ["C", "F", "B", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "I", "K"], rivales: ["C", "F", "B", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "I", "J"], rivales: ["C", "F", "B", "A", "E", "J", "G", "I"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "H", "L"], rivales: ["C", "F", "B", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "H", "K"], rivales: ["C", "F", "B", "A", "H", "K", "G", "E"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "H", "J"], rivales: ["C", "F", "B", "A", "H", "J", "G", "E"] },
  { grupos: ["A", "B", "C", "E", "F", "G", "H", "I"], rivales: ["C", "F", "B", "A", "H", "I", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "I", "J", "K", "L"], rivales: ["C", "D", "B", "A", "I", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "H", "J", "K", "L"], rivales: ["C", "D", "B", "A", "H", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "H", "I", "K", "L"], rivales: ["C", "D", "B", "A", "H", "K", "I", "L"] },
  { grupos: ["A", "B", "C", "D", "H", "I", "J", "L"], rivales: ["C", "D", "B", "A", "H", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "H", "I", "J", "K"], rivales: ["C", "D", "B", "A", "H", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "D", "G", "J", "K", "L"], rivales: ["D", "G", "B", "A", "C", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "G", "I", "K", "L"], rivales: ["C", "D", "B", "A", "I", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "G", "I", "J", "L"], rivales: ["D", "G", "B", "A", "C", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "G", "I", "J", "K"], rivales: ["D", "G", "B", "A", "C", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "D", "G", "H", "K", "L"], rivales: ["C", "D", "B", "A", "H", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "G", "H", "J", "L"], rivales: ["C", "D", "B", "A", "H", "J", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "G", "H", "J", "K"], rivales: ["C", "D", "B", "A", "H", "K", "G", "J"] },
  { grupos: ["A", "B", "C", "D", "G", "H", "I", "L"], rivales: ["C", "D", "B", "A", "H", "I", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "G", "H", "I", "K"], rivales: ["C", "D", "B", "A", "H", "K", "G", "I"] },
  { grupos: ["A", "B", "C", "D", "G", "H", "I", "J"], rivales: ["C", "D", "B", "A", "H", "J", "G", "I"] },
  { grupos: ["A", "B", "C", "D", "F", "J", "K", "L"], rivales: ["D", "F", "B", "A", "C", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "I", "K", "L"], rivales: ["D", "F", "B", "A", "C", "K", "I", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "I", "J", "L"], rivales: ["D", "F", "B", "A", "C", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "I", "J", "K"], rivales: ["D", "F", "B", "A", "C", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "D", "F", "H", "K", "L"], rivales: ["C", "D", "B", "A", "H", "K", "F", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "H", "J", "L"], rivales: ["D", "F", "B", "A", "C", "H", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "H", "J", "K"], rivales: ["C", "F", "B", "A", "H", "K", "J", "D"] },
  { grupos: ["A", "B", "C", "D", "F", "H", "I", "L"], rivales: ["C", "D", "B", "A", "H", "I", "F", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "H", "I", "K"], rivales: ["C", "D", "B", "A", "H", "K", "F", "I"] },
  { grupos: ["A", "B", "C", "D", "F", "H", "I", "J"], rivales: ["C", "F", "B", "A", "H", "I", "J", "D"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "K", "L"], rivales: ["D", "F", "B", "A", "C", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "J", "L"], rivales: ["D", "F", "B", "A", "C", "J", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "J", "K"], rivales: ["D", "F", "B", "A", "C", "K", "G", "J"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "I", "L"], rivales: ["D", "F", "B", "A", "C", "I", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "I", "K"], rivales: ["D", "F", "B", "A", "C", "K", "G", "I"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "I", "J"], rivales: ["D", "F", "B", "A", "C", "J", "G", "I"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "H", "L"], rivales: ["D", "F", "B", "A", "C", "H", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "H", "K"], rivales: ["C", "F", "B", "A", "H", "K", "G", "D"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "H", "J"], rivales: ["C", "F", "B", "A", "H", "J", "G", "D"] },
  { grupos: ["A", "B", "C", "D", "F", "G", "H", "I"], rivales: ["C", "F", "B", "A", "H", "I", "G", "D"] },
  { grupos: ["A", "B", "C", "D", "E", "J", "K", "L"], rivales: ["C", "D", "B", "A", "E", "K", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "I", "K", "L"], rivales: ["C", "D", "B", "A", "E", "K", "I", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "I", "J", "L"], rivales: ["C", "D", "B", "A", "E", "I", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "I", "J", "K"], rivales: ["C", "D", "B", "A", "E", "K", "J", "I"] },
  { grupos: ["A", "B", "C", "D", "E", "H", "K", "L"], rivales: ["C", "D", "B", "A", "H", "K", "E", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "H", "J", "L"], rivales: ["C", "D", "B", "A", "H", "E", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "H", "J", "K"], rivales: ["C", "D", "B", "A", "H", "K", "J", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "H", "I", "L"], rivales: ["C", "D", "B", "A", "H", "I", "E", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "H", "I", "K"], rivales: ["C", "D", "B", "A", "H", "K", "E", "I"] },
  { grupos: ["A", "B", "C", "D", "E", "H", "I", "J"], rivales: ["C", "D", "B", "A", "H", "I", "J", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "K", "L"], rivales: ["C", "D", "B", "A", "E", "K", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "J", "L"], rivales: ["C", "D", "B", "A", "E", "J", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "J", "K"], rivales: ["C", "D", "B", "A", "E", "K", "G", "J"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "I", "L"], rivales: ["C", "D", "B", "A", "E", "I", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "I", "K"], rivales: ["C", "D", "B", "A", "E", "K", "G", "I"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "I", "J"], rivales: ["C", "D", "B", "A", "E", "J", "G", "I"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "H", "L"], rivales: ["C", "D", "B", "A", "H", "E", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "H", "K"], rivales: ["C", "D", "B", "A", "H", "K", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "H", "J"], rivales: ["C", "D", "B", "A", "H", "J", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "G", "H", "I"], rivales: ["C", "D", "B", "A", "H", "I", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "K", "L"], rivales: ["D", "F", "B", "A", "C", "K", "E", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "J", "L"], rivales: ["D", "F", "B", "A", "C", "E", "J", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "J", "K"], rivales: ["D", "F", "B", "A", "C", "K", "J", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "I", "L"], rivales: ["D", "F", "B", "A", "C", "I", "E", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "I", "K"], rivales: ["D", "F", "B", "A", "C", "K", "E", "I"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "I", "J"], rivales: ["D", "F", "B", "A", "C", "I", "J", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "H", "L"], rivales: ["C", "D", "B", "A", "H", "E", "F", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "H", "K"], rivales: ["C", "F", "B", "A", "H", "K", "E", "D"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "H", "J"], rivales: ["C", "F", "B", "A", "H", "E", "J", "D"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "H", "I"], rivales: ["C", "F", "B", "A", "H", "I", "E", "D"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "G", "L"], rivales: ["D", "F", "B", "A", "C", "E", "G", "L"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "G", "K"], rivales: ["D", "F", "B", "A", "C", "K", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "G", "J"], rivales: ["D", "F", "B", "A", "C", "J", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "G", "I"], rivales: ["D", "F", "B", "A", "C", "I", "G", "E"] },
  { grupos: ["A", "B", "C", "D", "E", "F", "G", "H"], rivales: ["C", "F", "B", "A", "H", "E", "G", "D"] },
];

/**
 * Extrae primeros, segundos y terceros de la porra
 */
export function getClasificados(porra) {
  const primeros = {}, segundos = {}, terceros = {}
  for (const g of GRUPOS_KEYS) {
    primeros[g] = porra[`grupo_${g}_1`] || null
    segundos[g] = porra[`grupo_${g}_2`] || null
    terceros[g] = porra[`grupo_${g}_3`] || null
  }
  const tercerosClasificados = []
  for (let i = 0; i < 8; i++) {
    const t = porra[`tercero_${i}`]
    if (t) tercerosClasificados.push(t)
  }
  return { primeros, segundos, terceros, tercerosClasificados }
}

/**
 * Identifica la combinación de terceros y devuelve los 8 rivales
 * rivales[i] = grupo del 3º que juega contra: [1E, 1I, 1D, 1G, 1A, 1L, 1B, 1K]
 */
export function getRivalesTerceros(tercerosClasificados, terceros) {
  const gruposClasificados = []
  for (const equipo of tercerosClasificados) {
    for (const g of GRUPOS_KEYS) {
      if (terceros[g] === equipo) {
        gruposClasificados.push(g)
        break
      }
    }
  }
  const key = [...gruposClasificados].sort().join(',')
  for (const comb of COMBINACIONES_TERCEROS) {
    if (comb.grupos.join(',') === key) return comb.rivales
  }
  return null
}

/**
 * Genera los 16 partidos de dieciseisavos
 * Estructura exacta del cuadro del Excel:
 * LADO IZQUIERDO (partidos 0-7):
 *   0: 1E vs 3[r0]   1: 1I vs 3[r1]
 *   2: 2A vs 2B      3: 1F vs 2C
 *   4: 2K vs 2L      5: 1H vs 2J
 *   6: 1D vs 3[r2]   7: 1G vs 3[r3]
 * LADO DERECHO (partidos 8-15):
 *   8: 1C vs 2F      9: 2E vs 2I
 *   10: 1A vs 3[r4]  11: 1L vs 3[r5]
 *   12: 1J vs 2H     13: 2D vs 2G
 *   14: 1B vs 3[r6]  15: 1K vs 3[r7]
 */
export function generarDieciseisavos(porra) {
  const { primeros, segundos, terceros, tercerosClasificados } = getClasificados(porra)
  if (tercerosClasificados.length < 8) return null
  const r = getRivalesTerceros(tercerosClasificados, terceros)
  if (!r) return null

  return [
    // LADO IZQUIERDO
    [primeros['E'], terceros[r[0]]],   // 0: 1E vs 3[r0]
    [primeros['I'], terceros[r[1]]],   // 1: 1I vs 3[r1]
    [segundos['A'], segundos['B']],    // 2: 2A vs 2B (fijo)
    [primeros['F'], segundos['C']],    // 3: 1F vs 2C (fijo)
    [segundos['K'], segundos['L']],    // 4: 2K vs 2L (fijo)
    [primeros['H'], segundos['J']],    // 5: 1H vs 2J (fijo)
    [primeros['D'], terceros[r[2]]],   // 6: 1D vs 3[r2]
    [primeros['G'], terceros[r[3]]],   // 7: 1G vs 3[r3]
    // LADO DERECHO
    [primeros['C'], segundos['F']],    // 8: 1C vs 2F (fijo)
    [segundos['E'], segundos['I']],    // 9: 2E vs 2I (fijo)
    [primeros['A'], terceros[r[4]]],   // 10: 1A vs 3[r4]
    [primeros['L'], terceros[r[5]]],   // 11: 1L vs 3[r5]
    [primeros['J'], segundos['H']],    // 12: 1J vs 2H (fijo)
    [segundos['D'], segundos['G']],    // 13: 2D vs 2G (fijo)
    [primeros['B'], terceros[r[6]]],   // 14: 1B vs 3[r6]
    [primeros['K'], terceros[r[7]]],   // 15: 1K vs 3[r7]
  ]
}

/**
 * Verifica si un equipo está en una lista (null-safe)
 */
function estaEn(equipo, lista) {
  if (!equipo) return false
  return lista.some(e => e === equipo)
}

/**
 * Calcula puntuación de puestos de grupo (máx 36: 1 punto por puesto correcto)
 */
export function calcularPuestosGrupos(porra, solucion) {
  let puntos = 0
  for (const g of GRUPOS_KEYS) {
    if (porra[`grupo_${g}_1`] && porra[`grupo_${g}_1`] === solucion[`grupo_${g}_1`]) puntos++
    if (porra[`grupo_${g}_2`] && porra[`grupo_${g}_2`] === solucion[`grupo_${g}_2`]) puntos++
    if (porra[`grupo_${g}_3`] && porra[`grupo_${g}_3`] === solucion[`grupo_${g}_3`]) puntos++
  }
  return puntos
}

/**
 * Calcula clasificados a dieciseisavos (máx 32: 1 punto por equipo)
 * Cuenta cuántos equipos de la porra coinciden con los de la solución en dieciseisavos
 */
export function calcularClasificados16(porra, solucion) {
  // Obtener los 32 clasificados de la porra
  const { primeros: pP, segundos: pS, tercerosClasificados: pT3 } = getClasificados(porra)
  const { primeros: sP, segundos: sS, tercerosClasificados: sT3 } = getClasificados(solucion)

  const porraSet = new Set([
    ...Object.values(pP), ...Object.values(pS), ...pT3
  ].filter(Boolean))

  const solSet = new Set([
    ...Object.values(sP), ...Object.values(sS), ...sT3
  ].filter(Boolean))

  let puntos = 0
  for (const equipo of porraSet) {
    if (solSet.has(equipo)) puntos++
  }
  return puntos
}

/**
 * Calcula clasificados a octavos (máx 32: 2 puntos por equipo)
 * Un equipo puntúa si aparece en octavos de la solución (independientemente de posición)
 */
export function calcularClasificadosOctavos(porra, solucion) {
  // Los 16 clasificados a octavos son los ganadores de dieciseisavos
  // En la porra el usuario selecciona quiénes pasan, en claves octavos_0..15
  const porraOctavos = new Set()
  const solOctavos = new Set()
  for (let i = 0; i < 16; i++) {
    if (porra[`octavos_${i}`]) porraOctavos.add(porra[`octavos_${i}`])
    if (solucion[`octavos_${i}`]) solOctavos.add(solucion[`octavos_${i}`])
  }
  let puntos = 0
  for (const e of porraOctavos) {
    if (solOctavos.has(e)) puntos += 2
  }
  return puntos
}

/**
 * Calcula clasificados a cuartos (máx 32: 4 puntos por equipo)
 */
export function calcularClasificadosCuartos(porra, solucion) {
  const porraSet = new Set()
  const solSet = new Set()
  for (let i = 0; i < 8; i++) {
    if (porra[`cuartos_${i}`]) porraSet.add(porra[`cuartos_${i}`])
    if (solucion[`cuartos_${i}`]) solSet.add(solucion[`cuartos_${i}`])
  }
  let puntos = 0
  for (const e of porraSet) {
    if (solSet.has(e)) puntos += 4
  }
  return puntos
}

/**
 * Calcula clasificados a semifinal (máx 32: 8 puntos por equipo)
 */
export function calcularClasificadosSemis(porra, solucion) {
  const porraSet = new Set()
  const solSet = new Set()
  for (let i = 0; i < 4; i++) {
    if (porra[`semis_${i}`]) porraSet.add(porra[`semis_${i}`])
    if (solucion[`semis_${i}`]) solSet.add(solucion[`semis_${i}`])
  }
  let puntos = 0
  for (const e of porraSet) {
    if (solSet.has(e)) puntos += 8
  }
  return puntos
}

/**
 * Calcula finalistas (máx 32: 16 puntos por equipo)
 */
export function calcularFinalistas(porra, solucion) {
  const pF0 = porra['final_0'], pF1 = porra['final_1']
  const sF0 = solucion['final_0'], sF1 = solucion['final_1']
  const solFinales = new Set([sF0, sF1].filter(Boolean))
  let puntos = 0
  if (pF0 && solFinales.has(pF0)) puntos += 16
  if (pF1 && solFinales.has(pF1)) puntos += 16
  return puntos
}

/**
 * Calcula enfrentamientos de cuartos (máx 32: 8 puntos por partido correcto)
 * Un partido es correcto si los dos equipos son los correctos (en cualquier orden)
 * Los 4 partidos de cuartos: izq-arriba, izq-abajo, der-arriba, der-abajo
 * Claves: cuartos_partido_0_a, cuartos_partido_0_b, etc.
 */
export function calcularEnfrentamientosCuartos(porra, solucion) {
  let puntos = 0
  for (let i = 0; i < 4; i++) {
    const pA = porra[`cuartos_p${i}_a`]
    const pB = porra[`cuartos_p${i}_b`]
    const sA = solucion[`cuartos_p${i}_a`]
    const sB = solucion[`cuartos_p${i}_b`]
    if (!pA || !pB || !sA || !sB) continue
    const pPair = new Set([pA, pB])
    const sPair = new Set([sA, sB])
    if ([...pPair].every(e => sPair.has(e))) puntos += 8
  }
  return puntos
}

/**
 * Calcula enfrentamientos de semis (máx 32: 16 puntos por partido correcto)
 */
export function calcularEnfrentamientosSemis(porra, solucion) {
  let puntos = 0
  for (let i = 0; i < 2; i++) {
    const pA = porra[`semis_p${i}_a`]
    const pB = porra[`semis_p${i}_b`]
    const sA = solucion[`semis_p${i}_a`]
    const sB = solucion[`semis_p${i}_b`]
    if (!pA || !pB || !sA || !sB) continue
    const pPair = new Set([pA, pB])
    const sPair = new Set([sA, sB])
    if ([...pPair].every(e => sPair.has(e))) puntos += 16
  }
  return puntos
}

function calcularPremio(porra, solucion, key, puntos) {
  if (!porra[key] || !solucion[key]) return 0
  return porra[key].trim().toLowerCase() === solucion[key].trim().toLowerCase() ? puntos : 0
}

/**
 * Función principal: calcula puntuación total y desglose
 */
export function calcularPuntuacion(porra, solucion) {
  if (!porra || !solucion) return null

  const desglose = {
    puestos_grupos: calcularPuestosGrupos(porra, solucion),
    clasificados_16: calcularClasificados16(porra, solucion),
    clasificados_8: calcularClasificadosOctavos(porra, solucion),
    clasificados_4: calcularClasificadosCuartos(porra, solucion),
    clasificados_semi: calcularClasificadosSemis(porra, solucion),
    finalistas: calcularFinalistas(porra, solucion),
    campeon: calcularPremio(porra, solucion, 'campeon', 32),
    tercer_clasificado: calcularPremio(porra, solucion, 'tercer_clasificado', 16),
    balon_oro: calcularPremio(porra, solucion, 'balon_oro', 32),
    bota_oro: calcularPremio(porra, solucion, 'bota_oro', 32),
    guante_oro: calcularPremio(porra, solucion, 'guante_oro', 32),
    mejor_joven: calcularPremio(porra, solucion, 'mejor_joven', 32),
    juego_limpio: calcularPremio(porra, solucion, 'juego_limpio', 32),
    gol_torneo: calcularPremio(porra, solucion, 'gol_torneo', 32),
    enfrentamientos_cuartos: calcularEnfrentamientosCuartos(porra, solucion),
    enfrentamientos_semis: calcularEnfrentamientosSemis(porra, solucion),
  }

  const total = Object.values(desglose).reduce((a, b) => a + b, 0)
  return { desglose, total }
}
