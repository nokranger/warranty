<template>
  <div id="app">
    <header class="app-header">
      <b-row>
        <b-col></b-col>
        <b-col>
          <h1>Inspection System</h1>
          <p class="subtitle">ระบบตรวจสอบและสแกนลาเบล</p>
        </b-col>
        <b-col>
          <div v-if="$route.path === '/login'"></div>
          <div v-else style="display: flex; align-items: center; gap: 10px;">
            <div style="font-weight: bold;">USER: {{ users }}</div>
            <b-button @click="logout" variant="danger">Logout</b-button>
          </div>
        </b-col>
      </b-row>
    </header>
    <main class="app-content">
      <router-view :key="$route.fullPath" />
    </main>
    <!-- <footer class="app-footer">
      <p>&copy; 2024 Inspection System</p>
    </footer> -->
  </div>
</template>
<script>
// import Login from './views/Login.vue';

export default {
  data() {
    return {
      users: '',
      locationPath: ''
    }
  },
  async mounted() {
    // await this.checkLogin()
    // const user = JSON.parse(localStorage.getItem('user'))
    // console.log('users', user)
    // this.users = user.username
    // console.log('users', user)
    // if (this.locationPath === '/login') {

    // }
  },
  watch: {
    $route() {
      this.checkLogin()
    }
  },
  methods: {
    logout() {
      console.log('logout')
      console.log('URL===', this.locationPath)
      localStorage.removeItem('user')
      this.$router.push('/login');
    },
    checkLogin() {
      const user = JSON.parse(localStorage.getItem('user'))

      if (!user || !user.username) {
        this.users = ''
        if (this.$route.path !== '/login') {
          this.$router.push('/login')
        }
      } else {
        this.users = user.username
      }
    }
  }
}
</script>

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
