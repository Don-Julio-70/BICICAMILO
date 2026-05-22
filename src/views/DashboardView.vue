<script>
export default {
  name: 'DashboardView',
  methods: {
    cerrarSesion() {
      localStorage.removeItem('usuarioActivo')
      this.$router.push('/login')
    },
  },
  computed: {
    usuarioActivo() {
      const u = localStorage.getItem('usuarioActivo')
      return u ? JSON.parse(u) : null
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
      <div class="user-info">
        <span>{{ usuarioActivo?.nombre }}</span>
        <button @click="cerrarSesion">Cerrar sesión</button>
      </div>
    </div>

    <h2>Panel Principal</h2>

    <div class="modulos">
      <router-link to="/clientes" class="modulo">
        <div class="icono">👥</div>
        <h3>Clientes</h3>
        <p>Gestión de clientes registrados</p>
      </router-link>

      <router-link to="/inventario" class="modulo">
        <div class="icono">🚲</div>
        <h3>Inventario</h3>
        <p>Control de productos y stock</p>
      </router-link>

      <router-link to="/ventas" class="modulo">
        <div class="icono">💰</div>
        <h3>Ventas</h3>
        <p>Registro y seguimiento de ventas</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page {
  font-family: 'Times New Roman', Times, serif;
  background-color: #000000;
  min-height: 100vh;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.brand {
  color: #fd2525;
  margin: 0;
}
.slogan {
  color: white;
  margin: 2px 0;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-info span {
  color: white;
  font-size: 16px;
}
.user-info button {
  background-color: #fd2525;
  color: white;
  border: none;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 14px;
}
h2 {
  color: white;
  text-align: center;
  margin: 30px 0;
}
.modulos {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.modulo {
  background-color: #1a1a1a;
  border: 2px solid #fd2525;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  width: 200px;
  transition: background-color 0.2s;
}
.modulo:hover {
  background-color: #2a2a2a;
}
.icono {
  font-size: 40px;
  margin-bottom: 10px;
}
.modulo h3 {
  color: #fd2525;
  margin: 8px 0;
}
.modulo p {
  color: white;
  font-size: 14px;
  margin: 0;
}
</style>
