const TABLAS = {
  usuarios: 'bicicamilo_usuarios',
  clientes: 'bicicamilo_clientes',
  inventario: 'bicicamilo_inventario',
  ventas: 'bicicamilo_ventas',
}

export function leerTabla(tabla) {
  const data = localStorage.getItem(TABLAS[tabla])
  return data ? JSON.parse(data) : []
}

export function guardarRegistro(tabla, registro) {
  const registros = leerTabla(tabla)
  registro.id = Date.now()
  registros.push(registro)
  localStorage.setItem(TABLAS[tabla], JSON.stringify(registros))
  return registro
}

export function eliminarRegistro(tabla, id) {
  const registros = leerTabla(tabla).filter((r) => r.id !== id)
  localStorage.setItem(TABLAS[tabla], JSON.stringify(registros))
}

export function actualizarRegistro(tabla, id, datos) {
  const registros = leerTabla(tabla).map((r) => (r.id === id ? { ...r, ...datos } : r))
  localStorage.setItem(TABLAS[tabla], JSON.stringify(registros))
}

export function exportarJSON(tabla) {
  const data = leerTabla(tabla)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${tabla}.json`
  a.click()
  URL.revokeObjectURL(url)
}
