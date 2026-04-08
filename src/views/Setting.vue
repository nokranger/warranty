<template>
  <div>
    <h1>Setting Page</h1>
    <div v-for="(users, index) in user" :key="index" v-if="index >= 1">
      <div style="display: flex; align-items: center; gap: 10px; border-style: solid; margin: 5px;">
        <div>
          ชื่อผู้ใช้
          <b-input v-model="users.username" readonly></b-input>
        </div>
        <!-- <div>
          รหัสผ่าน
          <b-input v-model="users.password" type="password"></b-input>
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
          <b-button style="margin-top: -2px;" variant="success" v-on:click="updateUser(users)">
            อัพเดตข้อมูล
          </b-button>
        </div>
        <div>
          <br>
          <b-button style="margin-top: -2px;" variant="warning" v-on:click="openPasswordModal(users)">
            จัดการรหัสผ่าน
          </b-button>
        </div>
      </div>
    </div>

    <b-button v-on:click="summerize()" style="margin: 5px;width: 35%;" variant="info">Summary</b-button>

    <!-- Password Modal -->
    <b-modal
      v-model="showPasswordModal"
      title="จัดการรหัสผ่าน"
      hide-footer
      centered
    >
      <div v-if="selectedUser">
        <p>ผู้ใช้: <strong>{{ selectedUser.username }}</strong></p>

        <b-form-group label="ตั้งรหัสผ่านใหม่">
          <b-input
            v-model="newPassword"
            type="password"
            placeholder="กรอกรหัสผ่านใหม่"
          ></b-input>
        </b-form-group>

        <div class="d-flex gap-2 mt-3">
          <b-button variant="primary" :disabled="!newPassword" @click="changePassword()">
            เปลี่ยนรหัสผ่าน
          </b-button>
          <b-button variant="danger" @click="resetPassword()">
            รีเซ็ตเป็นค่าเริ่มต้น
          </b-button>
          <b-button variant="secondary" @click="showPasswordModal = false">
            ยกเลิก
          </b-button>
        </div>

        <b-alert v-if="modalMessage" :variant="modalVariant" class="mt-3" show>
          {{ modalMessage }}
        </b-alert>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user: '',
      showPasswordModal: false,
      selectedUser: null,
      newPassword: '',
      modalMessage: '',
      modalVariant: 'success'
    }
  },
  async mounted() {
    await this.reload()
  },
  methods: {
    async reload() {
      await axios.get(process.env.VUE_APP_API_BASE_URL + `/users`).then(response => {
        this.user = response.data.result
      })
    },
    updateUser(users) {
      axios.post(process.env.VUE_APP_API_BASE_URL + `/updateusers`, users).then(response => {
        this.user = response.data.result
      })
    },
    openPasswordModal(users) {
      this.selectedUser = users
      this.newPassword = ''
      this.modalMessage = ''
      this.showPasswordModal = true
    },
    async changePassword() {
      if (!this.newPassword) return
      try {
        const response = await axios.post(process.env.VUE_APP_API_BASE_URL + `/updatepassword`, {
          id: this.selectedUser.id,
          password: this.newPassword
        })
        this.modalMessage = response.data.message || 'เปลี่ยนรหัสผ่านสำเร็จ'
        this.modalVariant = 'success'
        this.newPassword = ''
      } catch (err) {
        this.modalMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่'
        this.modalVariant = 'danger'
      }
    },
    async resetPassword() {
      try {
        const response = await axios.post(process.env.VUE_APP_API_BASE_URL + `/resetpassword`, {
          id: this.selectedUser.id
        })
        this.modalMessage = response.data.message || 'รีเซ็ตรหัสผ่านสำเร็จ (รหัสผ่านใหม่: 123456)'
        this.modalVariant = 'warning'
      } catch (err) {
        this.modalMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่'
        this.modalVariant = 'danger'
      }
    },
    summerize() {
      this.$router.push('/summary')
    }
  }
}
</script>