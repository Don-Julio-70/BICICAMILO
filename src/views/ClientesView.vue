<script>
import {
  leerTabla,
  guardarRegistro,
  eliminarRegistro,
  actualizarRegistro,
  exportarJSON,
} from '../services/db.js'

export default {
  name: 'ClientesView',
  data() {
    return {
      clientes: [],
      mostrarFormulario: false,
      editando: false,
      form: {
        id: null,
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        direccion: '',
      },
    }
  },
  mounted() {
    this.cargarClientes()
  },
  methods: {
    cargarClientes() {
      this.clientes = leerTabla('clientes')
    },
    abrirFormulario() {
      this.editando = false
      this.form = { id: null, nombre: '', cedula: '', telefono: '', email: '', direccion: '' }
      this.mostrarFormulario = true
    },
    editarCliente(cliente) {
      this.editando = true
      this.form = { ...cliente }
      this.mostrarFormulario = true
    },
    guardarCliente() {
      if (this.editando) {
        actualizarRegistro('clientes', this.form.id, this.form)
      } else {
        guardarRegistro('clientes', { ...this.form })
      }
      this.mostrarFormulario = false
      this.cargarClientes()
    },
    eliminarCliente(id) {
      if (confirm('¿Seguro que deseas eliminar este cliente?')) {
        eliminarRegistro('clientes', id)
        this.cargarClientes()
      }
    },
    exportar() {
      exportarJSON('clientes')
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
      <h2>👥 Módulo de Clientes</h2>
      <div class="botones">
        <button @click="abrirFormulario" class="btn-primario">+ Nuevo Cliente</button>
        <button @click="exportar" class="btn-exportar">⬇ Exportar JSON</button>
      </div>
    </div>

    <!-- Formulario -->
    <div v-if="mostrarFormulario" class="formulario">
      <h3>{{ editando ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="form.nombre" required />
      </div>
      <div class="form-group">
        <label>Cédula:</label>
        <input type="text" v-model="form.cedula" required />
      </div>
      <div class="form-group">
        <label>Teléfono:</label>
        <input type="text" v-model="form.telefono" />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="form.email" />
      </div>
      <div class="form-group">
        <label>Dirección:</label>
        <input type="text" v-model="form.direccion" />
      </div>
      <div class="form-botones">
        <button @click="guardarCliente" class="btn-primario">
          {{ editando ? 'Actualizar' : 'Guardar' }}
        </button>
        <button @click="mostrarFormulario = false" class="btn-cancelar">Cancelar</button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="tabla-container">
      <p v-if="clientes.length === 0" class="vacio">No hay clientes registrados aún.</p>
      <table v-else>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td>{{ cliente.nombre }}</td>
            <td>{{ cliente.cedula }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>{{ cliente.email }}</td>
            <td>{{ cliente.direccion }}</td>
            <td class="acciones">
              <button @click="editarCliente(cliente)" class="btn-editar">✏️</button>
              <button @click="eliminarCliente(cliente.id)" class="btn-eliminar">🗑️</button>
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
.form-group input {
  background-color: gray;
  color: white;
  border: none;
  padding: 6px 10px;
  font-size: 15px;
  width: 300px;
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
.acciones {
  display: flex;
  gap: 8px;
}
.btn-editar,
.btn-eliminar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
</style>
