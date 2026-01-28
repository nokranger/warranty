<template>
  <div class="login-page">
    <b-container>
      <b-row align-v="center" class="justify-content-center">
        <b-col cols="12" sm="12" md="12" lg="12" xl="12">
          <b-card class="login-card shadow-lg">
            <!-- Header -->
            <div class="text-center mb-4">
              <h1 class="mb-2 text-primary">เข้าสู่ระบบ</h1>
              <p class="text-muted">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
            </div>

            <!-- Login Form -->
            <b-form @submit.prevent="handleLogin">
              <!-- Username Field -->
              <b-form-group
                label="ชื่อผู้ใช้"
                label-for="username"
                class="mb-3"
              >
                <b-form-input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  placeholder="กรอกชื่อผู้ใช้"
                  class="form-control-lg"
                ></b-form-input>
              </b-form-group>

              <!-- Password Field -->
              <b-form-group
                label="รหัสผ่าน"
                label-for="password"
                class="mb-3"
              >
                <b-form-input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="กรอกรหัสผ่าน"
                  class="form-control-lg"
                ></b-form-input>
              </b-form-group>

              <!-- Error Message -->
              <b-alert
                v-if="errorMessage"
                show
                variant="danger"
                dismissible
                @dismissed="errorMessage = ''"
                class="animate-shake"
              >
                <i class="bi bi-exclamation-triangle-fill"></i>
                {{ errorMessage }}
              </b-alert>

              <!-- Submit Button -->
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                block
                :disabled="loading"
                class="mt-3 submit-btn"
              >
                <b-spinner small v-if="loading" class="mr-2"></b-spinner>
                <span v-if="!loading">เข้าสู่ระบบ</span>
                <span v-else>กำลังเข้าสู่ระบบ...</span>
              </b-button>
            </b-form>

            <!-- Additional Links -->
            <div class="text-center mt-4">
              <b-link href="#" class="text-decoration-none">
                ลืมรหัสผ่าน?
              </b-link>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';

      try {
        // ส่งข้อมูล login ไปยัง API
        const response = await axios.post('/api/login', {
          username: this.form.username,
          password: this.form.password
        });

        // เก็บ token และข้อมูลผู้ใช้
        const { token, user } = response.data;
        
        // เก็บ token ใน localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        // ตรวจสอบ role และ redirect
        if (user.role === 'supervisor') {
          // ถ้าเป็น supervisor ให้ไปหน้า settings
          this.$router.push('/settings');
        } else {
          // ถ้าไม่ใช่ให้ไปหน้าหลัก
          this.$router.push('/');
        }

      } catch (error) {
        // จัดการ error
        if (error.response) {
            // console.log('loginuser', response)
          // Server ตอบกลับมาด้วย status code ที่ไม่ใช่ 2xx
          this.errorMessage = error.response.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้องaaa';
        } else if (error.request) {
          // Request ถูกส่งไปแล้วแต่ไม่ได้รับ response
          this.errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
        } else {
          // เกิดข้อผิดพลาดอื่นๆ
          this.errorMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
        }
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Login Page Background */
.login-page {
  min-height: 50vh;
  width: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* Login Card */
.login-card {
  border-radius: 1rem;
  border: none;
  animation: fadeInUp 0.6s ease-out;
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2) !important;
}

/* Form Controls */
.form-control {
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(102, 126, 234, 0.25);
  border-color: #667eea;
}

.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

/* Submit Button */
.submit-btn {
  border-radius: 0.5rem;
  font-weight: 600;
  padding: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(102, 126, 234, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.submit-btn:hover::before {
  width: 300px;
  height: 300px;
}

/* Links */
a {
  color: #667eea;
  transition: all 0.3s ease;
  position: relative;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #667eea;
  transition: width 0.3s ease;
}

a:hover::after {
  width: 100%;
}

a:hover {
  color: #764ba2;
  text-decoration: none;
}

/* Alert Animation */
.alert {
  border-radius: 0.5rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { 
    transform: translateX(0); 
  }
  10%, 30%, 50%, 70%, 90% { 
    transform: translateX(-8px); 
  }
  20%, 40%, 60%, 80% { 
    transform: translateX(8px); 
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Responsive */
@media (max-width: 768px) {
  .login-page {
    padding: 20px;
  }
  
  .login-card {
    margin: 0;
  }
}

/* Custom primary color to match gradient */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #65408b 100%);
}

.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.5);
}

.text-primary {
  color: #667eea !important;
}
</style>