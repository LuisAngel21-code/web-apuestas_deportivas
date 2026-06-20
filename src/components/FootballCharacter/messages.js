export const EMPTY_DATE = [
  'Ey furbolero... no hay partidos pa hoy.',
  'Hasta el mas grande descansa. No hay partidos hoy.',
  'Roja directa. No hay partidos en esta fecha.',
  'Cancha vacia. Mejor elige otro dia.',
  'Partidos en la ducha nomas hay hoy.',
  'Fecha libre. Vuelve otro dia.',
  'Ni un solo partido. Que dia mas tranquilo.',
  'Hoy no juega ni la reserva. Selecciona otra fecha.',
];

export const EMPTY_SEARCH = [
  'Ese equipo no existe. O juega en otra liga.',
  'Ni en el FIFA encontre a ese equipo.',
  'Seguro juega en la Liga del Parque. Busca otro.',
  'No hay equipo con ese nombre. Tipea bien, furbolero.',
  'Ese nombre no me suena. Y yo veo todos los partidos.',
];

export const EMPTY_LEAGUE = [
  'Primero elegi una liga, papa.',
  'Sin liga no hay partido. Dale al selector.',
  'No seas timido. Escoge una liga.',
  'Arriba, elegi una liga para empezar.',
];

export const LOADING = [
  'Calentando motores...',
  'Sacando las cuentas...',
  'Amarrando los chimpunes...',
  'Revisando el VAR...',
  'Hidratando al plantel...',
];

export const ERROR = [
  'Se malogro la cancha. Vuelve a intentar.',
  'El arbitro cobro falta. Error de conexion.',
  'Se fue la senal. Intenta de nuevo.',
  'La pelota se desinfle. Hubo un error.',
];

export function randomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}
