<template>
  <div>
    <h1>Setting Page</h1>
    <!-- <h1>{{ user }}</h1> -->
    <!-- <div v-for="(aa, index) in 1" :key="index">
      <div style="display: flex; align-items: center; gap: 10px;margin: 5px;">
        <div>
          ชื่อผู้ใช้
          <b-input style="color: #2c3e50;border-color: #6c757d;"></b-input>
        </div>
        <div>
          รหัสผ่าน
        </div>
        <div>
          อีเมล
        </div>
        <div>
          Role
        </div>
        <div>
          ตำแหน่ง
        </div>
        <div>
          สถานะ
        </div>
      </div>

    </div> -->
    <div v-for="(users, index) in user" :key="index" v-if="index >= 1">
      <div style="display: flex; align-items: center; gap: 10px;border-style: solid;margin: 5px;">
        <div>
          ชื่อผู้ใช้
          <b-input v-model="users.username" readonly></b-input>
        </div>
        <div>
          รหัสผ่าน
          <b-input v-model="users.password" type="password"></b-input>
        </div>
        <!-- <div>
          ตำแหน่ง
          <b-input v-model="users.fullname"></b-input>
        </div> -->
        <div>
          อีเมล
          <b-input v-model="users.email"></b-input>
        </div>
        <div>
          Role
          <b-input v-model="users.role"></b-input>
        </div>
        <div>
          ตำแหน่ง
          <b-input v-model="users.department"></b-input>
        </div>
        <div>
          สถานะ
          <b-input v-model="users.active"></b-input>
        </div>
        <div>
          <br>
          <b-button :id="index" style="margin-top: -2px;" variant="success"
            v-on:click="updateUser(users)">อัพเดตข้อมูล</b-button>
        </div>
        <div>
          <br>
          <b-button :id="index" style="margin-top: -2px;" variant="danger"
            v-on:click="updatePassword(users)">เปลี่ยนรหัสผ่าน</b-button>
        </div>
        <!-- <b-button :id="index" style="margin-top: -2px;" variant="success" v-on:click="updateUser(users.id, users.password, users.fullname, users.email, users.role, users.department, users.active)">อัพเดตข้อมูล</b-button> -->

      </div>
    </div>
    <!-- <b-button v-on:click="reload()" style="margin: 5px;">Summerize</b-button> -->
    <b-button v-on:click="summerize()" style="margin: 5px;">Summary</b-button>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      user: '',
      aa: 0
    }
  },
  async mounted() {
    await axios.get(process.env.VUE_APP_API_BASE_URL + `/users`).then(response => {
      this.user = response.data.result
      console.log('user=====', this.user)
    })
  },
  methods: {
    async reload() {
      await axios.get(process.env.VUE_APP_API_BASE_URL + `/users`).then(response => {
        this.user = response.data.result
        console.log('user=====', this.user)
      })

    },
    updateUser(users) {
      console.log('users=======', users)
      axios.post(process.env.VUE_APP_API_BASE_URL + `/updateusers`, users).then(response => {
        this.user = response.data.result
        console.log('user=====', this.user)
      })
    },
    updatePassword(users) {
      console.log('users=======', users)
      axios.post(process.env.VUE_APP_API_BASE_URL + `/updatepassword`, users).then(response => {
        // this.user = response.data.result
        console.log('user=====',  response.data.message)
      })
    },
    summerize() {
      this.$router.push('/summary');
    }
  }
}
</script>