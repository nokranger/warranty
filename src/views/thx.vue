<template>
  <div class="success-container">
    <div class="success-card">
      <!-- Success Icon Animation -->
      <div class="icon-wrapper">
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <h1 class="success-title">ส่งข้อมูลเรียบร้อยแล้ว!</h1>
      <p class="success-message">
        ระบบได้รับข้อมูลการลงทะเบียนของคุณเรียบร้อยแล้ว<br>
        ขอบคุณที่ใช้บริการของเรา
      </p>

      <!-- Success Details -->
      <div class="success-details">
        <div class="detail-item">
          <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>ข้อมูลได้รับการบันทึกแล้ว</span>
        </div>
        <div class="detail-item">
          <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span>อีเมลยืนยันจะถูกส่งไปยังคุณ</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <!-- <div class="button-group">
        <button @click="closeTab" class="btn-close">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          คลิกเพื่อปิดแท็บ
        </button>
        <button @click="goBack" class="btn-secondary">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          กลับหน้าแรก
        </button>
      </div> -->

      <!-- Auto Close Counter -->
      <div v-if="autoClose" class="auto-close-message">
        หน้าต่างจะปิดอัตโนมัติใน {{ countdown }} วินาที
      </div>
    </div>

    <!-- Confetti Animation -->
    <div class="confetti-container">
      <div v-for="n in 50" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessPage',
  data() {
    return {
      countdown: 10,
      autoClose: true, // เปลี่ยนเป็น false ถ้าไม่ต้องการปิดอัตโนมัติ
      countdownInterval: null
    }
  },
  mounted() {
    if (this.autoClose) {
      this.startCountdown()
    }
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  },
  methods: {
    closeTab() {
      // ปิด tab/window
      window.close()
      
      // ถ้าไม่สามารถปิดได้ (เช่น ไม่ใช่หน้าที่เปิดด้วย JavaScript)
      setTimeout(() => {
        if (!window.closed) {
          alert('กรุณาปิดแท็บนี้ด้วยตนเอง หรือคลิก "กลับหน้าแรก"')
        }
      }, 100)
    },
    
    goBack() {
      // กลับไปหน้าแรก
      this.$router.push('/') // ถ้าใช้ Vue Router
      // หรือ window.location.href = '/'
    },
    
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.countdown--
        
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval)
          this.closeTab()
        }
      }, 1000)
    },
    
    getConfettiStyle(n) {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
      return {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${3 + Math.random() * 2}s`
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.success-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.success-card {
  background: white;
  border-radius: 2rem;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
  z-index: 10;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success Checkmark Animation */
.icon-wrapper {
  margin-bottom: 2rem;
}

.success-checkmark {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  position: relative;
}

.check-icon {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #10b981;
}

.icon-line {
  height: 5px;
  background-color: #10b981;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.line-tip {
  top: 56px;
  left: 25px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.line-long {
  top: 48px;
  right: 15px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(16, 185, 129, 0.5);
}

.icon-fix {
  top: 12px;
  width: 10px;
  left: 34px;
  z-index: 1;
  height: 95px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: white;
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 25px;
    top: 56px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 15px;
    top: 48px;
  }
}

/* Text Styles */
.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* Success Details */
.success-details {
  background: #f0fdf4;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #059669;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-close,
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
}

.btn-close:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 6px 8px rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-secondary:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Auto Close Message */
.auto-close-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 0.5rem;
  color: #78716c;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Confetti Animation */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .success-card {
    padding: 2rem 1.5rem;
  }

  .success-title {
    font-size: 1.5rem;
  }

  .success-checkmark {
    width: 100px;
    height: 100px;
  }

  .check-icon {
    width: 100px;
    height: 100px;
  }

  .line-tip {
    top: 46px;
    left: 20px;
    width: 20px;
  }

  .line-long {
    top: 40px;
    right: 12px;
    width: 40px;
  }

  .icon-circle {
    width: 100px;
    height: 100px;
  }

  .icon-fix {
    top: 10px;
    left: 28px;
    height: 80px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-close,
  .btn-secondary {
    width: 100%;
  }
}
</style>