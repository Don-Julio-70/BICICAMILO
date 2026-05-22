<script>
import {
  leerTabla,
  guardarRegistro,
  eliminarRegistro,
  actualizarRegistro,
  exportarJSON,
} from '../services/db.js'

export default {
  name: 'VentasView',
  data() {
    return {
      ventas: [],
      clientes: [],
      productos: [],
      mostrarFormulario: false,
      form: {
        clienteId: '',
        productoId: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
      },
      totalVentas: 0,
    }
  },
  mounted() {
    this.cargarDatos()
  },
  computed: {
    clienteSeleccionado() {
      return this.clientes.find((c) => c.id === parseInt(this.form.clienteId)) || null
    },
    productoSeleccionado() {
      return this.productos.find((p) => p.id === parseInt(this.form.productoId)) || null
    },
    subtotal() {
      if (this.productoSeleccionado && this.form.cantidad) {
        return this.productoSeleccionado.precio * this.form.cantidad
      }
      return 0
    },
  },
  methods: {
    cargarDatos() {
      this.ventas = leerTabla('ventas')
      this.clientes = leerTabla('clientes')
      this.productos = leerTabla('inventario')
      this.calcularTotal()
    },
    calcularTotal() {
      this.totalVentas = this.ventas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0)
    },
    abrirFormulario() {
      this.form = {
        clienteId: '',
        productoId: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
      }
      this.mostrarFormulario = true
    },
    guardarVenta() {
      if (!this.clienteSeleccionado || !this.productoSeleccionado || !this.form.cantidad) {
        alert('Por favor completa todos los campos')
        return
      }
      if (parseInt(this.form.cantidad) > parseInt(this.productoSeleccionado.stock)) {
        alert('No hay suficiente stock disponible')
        return
      }

      // Registrar la venta
      guardarRegistro('ventas', {
        clienteNombre: this.clienteSeleccionado.nombre,
        clienteCedula: this.clienteSeleccionado.cedula,
        productoNombre: this.productoSeleccionado.nombre,
        productoPrecio: this.productoSeleccionado.precio,
        cantidad: this.form.cantidad,
        total: this.subtotal,
        fecha: this.form.fecha,
      })

      // Descontar del stock en inventario
      const nuevoStock = parseInt(this.productoSeleccionado.stock) - parseInt(this.form.cantidad)
      actualizarRegistro('inventario', this.productoSeleccionado.id, {
        ...this.productoSeleccionado,
        stock: nuevoStock,
      })

      this.mostrarFormulario = false
      this.cargarDatos()
    },
    eliminarVenta(id) {
      if (confirm('¿Seguro que deseas eliminar esta venta?')) {
        eliminarRegistro('ventas', id)
        this.cargarDatos()
      }
    },
    exportar() {
      exportarJSON('ventas')
    },
    cerrarSesion() {
      localStorage.removeItem('usuarioActivo')
      this.$router.push('/login')
    },
  },
}
</script>

<template>
  <div class="page">
    <div class="header">
      <div>
        <h1 class="brand">BICICAMILO</h1>
        <p class="slogan">CALIDAD Y TRADICION</p>
      </div>
      <div class="acciones-header">
        <router-link to="/dashboard" class="btn-volver">← Dashboard</router-link>
        <button @click="cerrarSesion" class="btn-cerrar">Cerrar sesión</button>
      </div>
    </div>

    <div class="modulo-header">
      <h2>💰 Módulo de Ventas</h2>
      <div class="botones">
        <button @click="abrirFormulario" class="btn-primario">+ Nueva Venta</button>
        <button @click="exportar" class="btn-exportar">⬇ Exportar JSON</button>
      </div>
    </div>

    <!-- Resumen -->
    <div class="resumen">
      <div class="resumen-card">
        <p class="resumen-label">Total ventas registradas</p>
        <p class="resumen-valor">{{ ventas.length }}</p>
      </div>
      <div class="resumen-card">
        <p class="resumen-label">Ingresos totales</p>
        <p class="resumen-valor">${{ totalVentas.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Formulario -->
    <div v-if="mostrarFormulario" class="formulario">
      <h3>Nueva Venta</h3>

      <div class="form-group">
        <label>Cliente:</label>
        <select v-model="form.clienteId">
          <option value="">Seleccionar cliente...</option>
          <option v-for="c in clientes" :key="c.id" :value="c.id">
            {{ c.nombre }} — {{ c.cedula }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Producto:</label>
        <select v-model="form.productoId">
          <option value="">Seleccionar producto...</option>
          <option v-for="p in productos" :key="p.id" :value="p.id">
            {{ p.nombre }} — ${{ p.precio }} (Stock: {{ p.stock }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Cantidad:</label>
        <input type="number" v-model="form.cantidad" min="1" />
      </div>

      <div class="form-group">
        <label>Fecha:</label>
        <input type="date" v-model="form.fecha" />
      </div>

      <div v-if="subtotal > 0" class="subtotal">
        Total a cobrar: <strong>${{ subtotal.toLocaleString() }}</strong>
      </div>

      <div class="form-botones">
        <button @click="guardarVenta" class="btn-primario">Registrar Venta</button>
        <button @click="mostrarFormulario = false" class="btn-cancelar">Cancelar</button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="tabla-container">
      <p v-if="ventas.length === 0" class="vacio">No hay ventas registradas aún.</p>
      <table v-else>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Cédula</th>
            <th>Producto</th>
            <th>Precio unit.</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in ventas" :key="venta.id">
            <td>{{ venta.fecha }}</td>
            <td>{{ venta.clienteNombre }}</td>
            <td>{{ venta.clienteCedula }}</td>
            <td>{{ venta.productoNombre }}</td>
            <td>${{ parseFloat(venta.productoPrecio).toLocaleString() }}</td>
            <td>{{ venta.cantidad }}</td>
            <td>
              <strong>${{ parseFloat(venta.total).toLocaleString() }}</strong>
            </td>
            <td>
              <button @click="eliminarVenta(venta.id)" class="btn-eliminar">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  font-family: 'Times New Roman', Times, serif;
  background-color: #000;
  min-height: 100vh;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.brand {
  color: #fd2525;
  margin: 0;
}
.slogan {
  color: white;
  margin: 2px 0;
}
.acciones-header {
  display: flex;
  gap: 10px;
  align-items: center;
}
.btn-volver {
  color: #fd2525;
  text-decoration: none;
  font-size: 14px;
}
.btn-cerrar {
  background-color: #fd2525;
  color: white;
  border: none;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 14px;
}
.modulo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}
h2 {
  color: white;
  margin: 0;
}
.botones {
  display: flex;
  gap: 10px;
}
.btn-primario {
  background-color: #fd2525;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.btn-exportar {
  background-color: #333;
  color: white;
  border: 1px solid #fd2525;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.resumen {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.resumen-card {
  background-color: #1a1a1a;
  border: 1px solid #fd2525;
  padding: 16px 24px;
  text-align: center;
  min-width: 180px;
}
.resumen-label {
  color: #aaa;
  margin: 0 0 6px 0;
  font-size: 13px;
}
.resumen-valor {
  color: #fd2525;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}
.formulario {
  background-color: #1a1a1a;
  border: 1px solid #fd2525;
  padding: 20px;
  margin-bottom: 20px;
}
.formulario h3 {
  color: #fd2525;
  margin-top: 0;
}
.form-group {
  margin-bottom: 12px;
}
.form-group label {
  color: white;
  display: block;
  margin-bottom: 4px;
}
.form-group input,
.form-group select {
  background-color: gray;
  color: white;
  border: none;
  padding: 6px 10px;
  font-size: 15px;
  width: 300px;
}
.subtotal {
  color: white;
  font-size: 18px;
  margin: 16px 0;
  padding: 10px;
  background-color: #2a2a2a;
  border-left: 3px solid #fd2525;
}
.subtotal strong {
  color: #fd2525;
}
.form-botones {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.btn-cancelar {
  background-color: #555;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.tabla-container {
  margin-top: 10px;
  overflow-x: auto;
}
.vacio {
  color: white;
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background-color: #fd2525;
}
th {
  color: white;
  padding: 10px 14px;
  text-align: left;
  font-size: 14px;
}
td {
  color: white;
  padding: 8px 14px;
  border-bottom: 1px solid #333;
  font-size: 14px;
}
tr:hover {
  background-color: #1a1a1a;
}
.btn-eliminar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
</style>
