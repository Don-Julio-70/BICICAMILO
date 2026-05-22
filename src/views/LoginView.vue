<script>
import { leerTabla } from '../services/db.js'

export default {
  name: 'LoginView',
  data() {
    return {
      usuario: '',
      contrasena: '',
      error: '',
    }
  },
  methods: {
    handleLogin() {
      const usuarios = leerTabla('usuarios')
      const encontrado = usuarios.find(
        (u) => u.usuario === this.usuario && u.contrasena === this.contrasena,
      )
      if (encontrado) {
        localStorage.setItem('usuarioActivo', JSON.stringify(encontrado))
        this.$router.push('/dashboard')
      } else {
        this.error = 'Usuario o contraseña incorrectos'
      }
    },
  },
}
</script>

<template>
  <div class="page">
    <h1 class="brand">BICICAMILO</h1>
    <p class="slogan">CALIDAD Y TRADICION</p>

    <h2>Iniciar Sesión</h2>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" v-model="usuario" required />
      </div>
      <div class="form-group">
        <label for="contrasena">Contraseña:</label>
        <input type="password" id="contrasena" v-model="contrasena" required />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">Ingresar</button>
      <p class="link">
        ¿No tienes cuenta?
        <router-link to="/registro">Regístrate aquí</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.page {
  font-family: 'Times New Roman', Times, serif;
  background-color: #000000;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
}
.brand {
  color: #fd2525;
  text-align: left;
}
.slogan {
  color: white;
  text-align: left;
}
h2 {
  color: white;
  text-align: center;
}
.form-group {
  margin-bottom: 16px;
}
label {
  color: white;
  font-size: 18px;
  display: block;
  margin-bottom: 4px;
}
input {
  background-color: gray;
  color: white;
  border: none;
  padding: 6px 10px;
  font-size: 16px;
}
button[type='submit'] {
  background-color: #fd2525;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
button[type='submit']:hover {
  background-color: #c41a1a;
}
.error {
  color: #fd2525;
  font-weight: bold;
}
.link {
  color: white;
  margin-top: 12px;
}
.link a {
  color: #fd2525;
}
</style>
