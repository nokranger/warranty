<template>
  <div class="linking-container">
    <!-- Step 1: สแกน Product ID จากโรงงาน -->
    <div v-if="currentStep === 1" class="step-card">
      <div class="step-header">
        <div class="step-badge">ขั้นตอนที่ 1</div>
        <h2 class="step-title">สแกน QR Code จากโรงงาน</h2>
        <p class="step-description">กรุณาสแกน QR Code บนสติ๊กเกอร์สินค้าจากโรงงาน</p>
      </div>

      <div class="scan-section">
        <div class="scan-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
          </svg>
        </div>
        <p class="scan-label">หรือกรอกรหัสสินค้าด้วยตัวเอง</p>
        <input 
          v-model="productId" 
          type="text" 
          class="input-field"
          placeholder="เช่น PROD-2025-001"
          @keyup.enter="checkProductId"
        />
        <button @click="checkProductId" class="btn-primary" :disabled="loading">
          <span v-if="loading">กำลังตรวจสอบ...</span>
          <span v-else>ตรวจสอบรหัสสินค้า</span>
        </button>
      </div>

      <!-- แสดงข้อมูลสินค้า -->
      <div v-if="productData" class="product-info">
        <h3 class="info-title">ข้อมูลสินค้า</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">รหัสสินค้า:</span>
            <span class="info-value">{{ productData.product_id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">ชื่อสินค้า:</span>
            <span class="info-value">{{ productData.product_name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">รุ่น:</span>
            <span class="info-value">{{ productData.product_model }}</span>
          </div>
        </div>

        <!-- ถ้าผูกแล้ว -->
        <div v-if="isAlreadyLinked" class="alert alert-warning">
          <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="alert-title">สินค้านี้ถูกผูกแล้ว</p>
            <p class="alert-text">รหัสประกัน: <strong>{{ linkedWarrantyCode }}</strong></p>
          </div>
        </div>

        <!-- ถ้ายังไม่ผูก -->
        <div v-else>
          <button @click="goToStep2" class="btn-success">
            ถัดไป: ผูกกับรหัสประกัน
          </button>
        </div>
      </div>
    </div>

    <!-- Step 2: สแกน Warranty Code ของเรา -->
    <div v-if="currentStep === 2" class="step-card">
      <div class="step-header">
        <div class="step-badge">ขั้นตอนที่ 2</div>
        <h2 class="step-title">สแกน QR Code รหัสประกัน</h2>
        <p class="step-description">กรุณาสแกน QR Code รหัสประกันของโทคิโคะ</p>
      </div>

      <div class="scan-section">
        <div class="scan-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <p class="scan-label">หรือกรอกรหัสประกันด้วยตัวเอง</p>
        <input 
          v-model="warrantyCode" 
          type="text" 
          class="input-field"
          placeholder="เช่น TK2025A001234"
          @keyup.enter="linkWarranty"
        />
        <button @click="linkWarranty" class="btn-primary" :disabled="loading">
          <span v-if="loading">กำลังผูก...</span>
          <span v-else>ผูกรหัสประกัน</span>
        </button>
      </div>

      <div class="product-summary">
        <h3 class="info-title">สินค้าที่จะผูก</h3>
        <div class="info-item">
          <span class="info-label">รหัสสินค้า:</span>
          <span class="info-value">{{ productId }}</span>
        </div>
      </div>

      <button @click="goToStep1" class="btn-back">
        ← ย้อนกลับ
      </button>
    </div>

    <!-- Step 3: สำเร็จ -->
    <div v-if="currentStep === 3" class="step-card success-card">
      <div class="success-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <h2 class="success-title">ผูกรหัสประกันสำเร็จ!</h2>
      <p class="success-message">คุณสามารถดำเนินการลงทะเบียนรับประกันได้แล้ว</p>

      <div class="linked-info">
        <div class="info-row">
          <span class="info-label">รหัสสินค้า:</span>
          <span class="info-value">{{ productId }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">รหัสประกัน:</span>
          <span class="info-value">{{ warrantyCode }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="goToRegistration" class="btn-primary">
          ไปหน้าลงทะเบียน
        </button>
        <button @click="resetForm" class="btn-secondary">
          ผูกรหัสอื่น
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="alert alert-error">
      <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>
      <div>
        <p class="alert-title">เกิดข้อผิดพลาด</p>
        <p class="alert-text">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'QRLinkingPage',
  data() {
    return {
      currentStep: 1,
      productId: '',
      warrantyCode: '',
      productData: null,
      isAlreadyLinked: false,
      linkedWarrantyCode: '',
      loading: false,
      errorMessage: '',
      apiBaseURL: 'http://localhost:4000/api' // เปลี่ยนตาม URL ของคุณ
    }
  },
  methods: {
    async checkProductId() {
      if (!this.productId.trim()) {
        this.showError('กรุณากรอกรหัสสินค้า')
        return
      }

      this.loading = true
      this.errorMessage = ''
      this.productData = null

      try {
        const response = await axios.post(`${this.apiBaseURL}/check-product`, {
          product_id: this.productId
        })

        if (response.data.success) {
          this.productData = response.data.product
          this.isAlreadyLinked = response.data.is_linked
          
          if (this.isAlreadyLinked) {
            this.linkedWarrantyCode = response.data.warranty_code
          }
        }
      } catch (error) {
        console.error('Error:', error)
        this.showError(error.response?.data?.message || 'ไม่สามารถตรวจสอบรหัสสินค้าได้')
      } finally {
        this.loading = false
      }
    },

    async linkWarranty() {
      if (!this.warrantyCode.trim()) {
        this.showError('กรุณากรอกรหัสประกัน')
        return
      }

      this.loading = true
      this.errorMessage = ''

      try {
        const response = await axios.post(`${this.apiBaseURL}/link-warranty`, {
          product_id: this.productId,
          warranty_code: this.warrantyCode
        })

        if (response.data.success) {
          this.currentStep = 3
        }
      } catch (error) {
        console.error('Error:', error)
        this.showError(error.response?.data?.message || 'ไม่สามารถผูกรหัสประกันได้')
      } finally {
        this.loading = false
      }
    },

    goToStep1() {
      this.currentStep = 1
      this.warrantyCode = ''
      this.errorMessage = ''
    },

    goToStep2() {
      this.currentStep = 2
      this.errorMessage = ''
    },

    goToRegistration() {
      // ไปหน้าลงทะเบียน พร้อมส่ง product_id และ warranty_code
      this.$router.push({
        path: '/dashboard',
        query: {
          id: this.warrantyCode,
          product_id: this.productId
        }
      })
      // หรือใช้ window.location.href
      // window.location.href = `/dashboard?id=${this.warrantyCode}&product_id=${this.productId}`
    },

    resetForm() {
      this.currentStep = 1
      this.productId = ''
      this.warrantyCode = ''
      this.productData = null
      this.isAlreadyLinked = false
      this.linkedWarrantyCode = ''
      this.errorMessage = ''
    },

    showError(message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.linking-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.step-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.5s ease-out;
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

.step-header {
  text-align: center;
  margin-bottom: 2rem;
}

.step-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.step-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

.scan-section {
  text-align: center;
  margin-bottom: 2rem;
}

.scan-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  color: #3b82f6;
}

.scan-icon svg {
  width: 100%;
  height: 100%;
}

.scan-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field::placeholder {
  color: #cbd5e1;
  font-weight: 400;
}

.btn-primary,
.btn-success,
.btn-secondary,
.btn-back {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 6px 8px rgba(16, 185, 129, 0.4);
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

.btn-back {
  background: #f1f5f9;
  color: #475569;
  margin-top: 1rem;
}

.btn-back:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.product-info,
.product-summary {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.info-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item,
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child,
.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 700;
  background: #fef3c7;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
}

.alert {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-warning {
  background: #fef3c7;
  border: 2px solid #f59e0b;
}

.alert-error {
  background: #fee2e2;
  border: 2px solid #ef4444;
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 500px;
  width: calc(100% - 2rem);
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.alert-warning .alert-icon {
  color: #f59e0b;
}

.alert-error .alert-icon {
  color: #ef4444;
}

.alert-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.alert-text {
  font-size: 0.875rem;
  color: #64748b;
}

/* Success Card Styles */
.success-card {
  text-align: center;
}

.success-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  color: #10b981;
  animation: scaleIn 0.5s ease-out;
}

.success-icon svg {
  width: 100%;
  height: 100%;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.success-message {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.linked-info {
  background: #f0fdf4;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 640px) {
  .step-card {
    padding: 2rem 1.5rem;
  }

  .step-title {
    font-size: 1.5rem;
  }

  .scan-icon {
    width: 60px;
    height: 60px;
  }

  .success-icon {
    width: 80px;
    height: 80px;
  }

  .success-title {
    font-size: 1.5rem;
  }
}
</style>