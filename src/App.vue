<script>
export default {
  name: 'Registro',
  data() {
    return {
      nombre: '',
      cedula: '',
      edad: '',
      salario: '',
      usuario: '',
      contrasena: ''
    }
  },
  methods: {
    handleSubmit() {
      const formData = {
        nombre: this.nombre,
        cedula: this.cedula,
        edad: this.edad,
        salario: this.salario,
        usuario: this.usuario,
        contrasena: this.contrasena
      }
      console.log('Datos enviados:', formData)
      // Aquí puedes hacer la petición al backend (registro.php o API)
    }
  }
}
</script>

<template>
  <div class="page">
    <h1 class="brand">BICICAMILO</h1>
    <p class="slogan">CALIDAD Y TRADICION</p>

    <h2>Registro</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="nombre" required />
      </div>

      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula" v-model="cedula" required />
      </div>

      <div class="form-group">
        <label for="edad">Edad:</label>
        <input type="number" id="edad" v-model="edad" required />
      </div>

      <div class="form-group">
        <label for="salario">Salario:</label>
        <input type="number" id="salario" v-model="salario" required />
      </div>

      <h3>Datos de inicio de sesión</h3>

      <div class="form-group">
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" v-model="usuario" required />
      </div>

      <div class="form-group">
        <label for="contrasena">Contraseña:</label>
        <input type="password" id="contrasena" v-model="contrasena" required />
      </div>

      <button type="submit">Registrarse</button>
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
  display: block;
  text-align: left;
  width: 100%;
}

.slogan {
  color: white;
  display: block;
  text-align: left;
  padding: 2px;
}

h2 {
  color: white;
  text-align: center;
}

h3 {
  color: white;
  padding: 20px;
  margin: 0;
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

input[type="text"],
input[type="number"],
input[type="password"] {
  background-color: gray;
  color: white;
  border: none;
  padding: 6px 10px;
  font-size: 16px;
}

button[type="submit"] {
  background-color: #fd2525;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button[type="submit"]:hover {
  background-color: #c41a1a;
}
</style>