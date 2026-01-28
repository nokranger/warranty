<template>
  <div id="app">
    <header class="app-header">
      <h1>Inspection System</h1>
      <p class="subtitle">ระบบตรวจสอบและสแกนลาเบล</p>
    </header>
    <main class="app-content">
      <router-view />
    </main>
    <!-- <footer class="app-footer">
      <p>&copy; 2024 Inspection System</p>
    </footer> -->
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
