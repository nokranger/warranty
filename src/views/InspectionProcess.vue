<template>
  <div class="inspection-process">
    <div class="process-container">
      <div class="header-info">
        <h2>กระบวนการตรวจสอบ</h2>
        <div v-if="workOrder" class="work-order-summary">
          <p><strong>WO:</strong> {{ workOrder.work_order_code }}</p>
          <p><strong>Item ID:</strong> {{ workOrder.item_id }}</p>
          <p><strong>Item:</strong> {{ workOrder.item }}</p>
          <p><strong>Customer ID:</strong> {{ workOrder.customer_id }}</p>
          <p><strong>Customer Name:</strong> {{ workOrder.customer }}</p>
        </div>
      </div>

      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-label">สแกน QR</div>
        </div>
        <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-label">สแกนกล่องใน</div>
        </div>
        <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-label">สแกนกล่องนอก</div>
        </div>
      </div>

      <div class="scan-area">
        <div class="scan-instruction">
          <h3>{{ getScanInstruction() }}</h3>
          <p class="scan-type">{{ getScanType() }}</p>
        </div>

        <!-- <div class="progress-display">
          <div class="progress-item">
            <label>Scan:</label>
            <span class="progress-value">{{ getCurrentScanned() }}</span>
          </div>
          <div class="progress-item">
            <label>Target:</label>
            <span class="progress-value">{{ getTargetCount() }}</span>
          </div>
          <div class="progress-item">
            <label>SNP:</label>
            <span class="progress-value">{{ workOrder?.snp_quantity || 0 }}</span>
          </div>


          <div class="progress-item highlight-box">
            <label>กล่องนอกที่สแกนแล้ว:</label>
            <span class="progress-value highlight">{{ progress.outerBox }}</span>
          </div>

          <div class="progress-item highlight-box" v-if="progress.outerBox > 0">
            <label>รอบที่:</label>
            <span class="progress-value highlight">{{ Math.floor(progress.product / workOrder.snp_quantity) + 1
            }}</span>
          </div>
        </div> -->

        <div class="progress-display">
          <div class="progress-item">
            <label>QR Scan:</label>
            <span class="progress-value">{{ progress.product}} /  {{ workOrder.order_quantity}}</span>
          </div>
          <!-- <div class="progress-item">
            <label>Target:</label>
            <span class="progress-value">{{ getTargetCount() }}</span>
          </div> -->
          <div class="progress-item">
            <label>Inner Box Scan:</label>
            <span class="progress-value">{{ progress.innerBox }} /  {{ workOrder.order_quantity}}</span>
          </div>

          <!-- เพิ่มส่วนนี้เพื่อแสดงจำนวนกล่องนอก -->
          <div class="progress-item highlight-box">
            <label>Outer Box Scan:</label>
            <span class="progress-value highlight">{{ progress.outerBox }} / {{ workOrder.snp_quantity}}</span>
          </div>

          <!-- เพิ่มส่วนนี้เพื่อแสดงรอบที่กำลังทำ -->
          <div class="progress-item highlight-box" v-if="progress.outerBox > 0">
            <label>รอบที่:</label>
            <span class="progress-value highlight">{{ Math.floor(progress.product / workOrder.snp_quantity) + 1
            }}</span>
          </div>
        </div>

        <!-- <div class="global-summary">
          <h4>สรุปการสแกนทั้งหมด</h4>
          <div class="summary-row">
            <div class="summary-item">
              <label>ชิ้นงาน (QR):</label>
              <span class="summary-value">{{ progress.product }}</span>
            </div>
            <div class="summary-item">
              <label>กล่องใน:</label>
              <span class="summary-value">{{ progress.innerBox }}</span>
            </div>
            <div class="summary-item">
              <label>กล่องนอก:</label>
              <span class="summary-value">{{ progress.outerBox }}</span>
            </div>
          </div>
        </div> -->

        <div class="scanner-input">
          <qrcode-stream v-if="showScanner && (currentStep === 1 || currentStep === 4)" @decode="onDecode"
            @init="onInit" />
          <input v-else v-model="scanInput" type="text" :placeholder="getInputPlaceholder()" @keyup.enter="processScan"
            ref="scanInput" class="scan-input-field" autofocus />
        </div>

        <div class="scan-actions">
          <button @click="processScan" class="btn-scan">สแกน</button>
          <button @click="resetProcess" class="btn-reset">เริ่มใหม่</button>
          <button @click="showEmergencyFinishModal" class="btn-reset">จบงานฉุกเฉิน</button>
        </div>
      </div>

      <div v-if="showEmergencyModal" class="modal-overlay" @click="closeEmergencyModal">
        <div class="modal-content emergency-modal" @click.stop>
          <div class="modal-header emergency">
            <h3>⚠️ จบงานฉุกเฉิน</h3>
          </div>
          <div class="modal-body">
            <div class="emergency-warning">
              <p><strong>คำเตือน:</strong> การจบงานฉุกเฉินจะทำให้งานนี้สิ้นสุดทันที</p>
              <p>โดยที่ยังไม่ได้สแกนครบตามจำนวนที่กำหนด</p>
            </div>

            <div class="current-progress">
              <h4>สถานะปัจจุบัน:</h4>
              <!-- <p>ชิ้นงาน: {{ getProductScanCount() }} / {{ workOrder?.snp_quantity || 0 }}</p> -->
              <!-- <p>กล่องใน: {{ getInnerBoxScanCount() }} / {{ workOrder?.snp_quantity || 0 }}</p> -->
              <!-- <p>กล่องนอก: {{ getOuterBoxScanCount() }}</p> -->
            </div>

            <div class="emergency-form">
              <div class="form-group">
                <label for="userCode">รหัสผู้ใช้:</label>
                <input v-model="emergencyUserCode" type="password" id="userCode" placeholder="กรอกรหัสผู้ใช้"
                  @keyup.enter="focusReasonInput" ref="emergencyUserInput" />
              </div>

              <div class="form-group">
                <label for="emergencyReason">เหตุผลในการจบงานฉุกเฉิน: *</label>
                <textarea v-model="emergencyReason" id="emergencyReason"
                  placeholder="กรุณาระบุเหตุผล เช่น เครื่องจักรเสีย, ขาดวัตถุดิบ, เหตุฉุกเฉิน..." rows="4"
                  ref="emergencyReasonInput" @keyup.enter.ctrl="confirmEmergencyFinish"></textarea>
                <small>กด Ctrl+Enter เพื่อยืนยัน</small>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeEmergencyModal" class="btn-secondary">ยกเลิก</button>
            <button @click="confirmEmergencyFinish" class="btn-danger">ยืนยันจบงานฉุกเฉิน</button>
          </div>
        </div>
      </div>



      <!-- Error Modal -->
      <div v-if="showErrorModal" class="modal-overlay" @click="closeErrorModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header error">
            <h3>⚠️ เกิดข้อผิดพลาด</h3>
          </div>
          <div class="modal-body">
            <p>{{ errorMessage }}</p>
            <div v-if="requireUserCode" class="user-code-input">
              <label>กรุณาใส่รหัส User:</label>
              <input v-model="userCode" type="password" placeholder="User Code" @keyup.enter="closeErrorModal"
                ref="userCodeInput" />
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeErrorModal" class="btn-primary">ตกลง</button>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header success">
            <h3>✓ สำเร็จ</h3>
          </div>
          <div class="modal-body">
            <p>{{ successMessage }}</p>
          </div>
          <div class="modal-footer">
            <button @click="handleSuccessClose" class="btn-success">ตกลง</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from 'axios'

export default {
  name: 'InspectionProcess',
  components: {
    QrcodeStream
  },
  props: ['workOrderId'],
  data() {
    return {
      workOrder: null,
      currentStep: 1,
      showScanner: false,
      scanInput: '',
      userCode: '',
      progress: {
        product: 0,
        innerBox: 0,
        outerBox: 0
      },
      // เพิ่มตัวนับการสแกนในรอบปัจจุบัน
      currentRoundScans: {
        product: 0,
        innerBox: 0,
        outerBox: 0
      },
      showErrorModal: false,
      showSuccessModal: false,
      errorMessage: '',
      successMessage: '',
      requireUserCode: false,
      showEmergencyModal: false,
      emergencyReason: '',
      emergencyUserCode: ''
    }
  },
  async mounted() {
    await this.loadWorkOrder()
    await this.loadProgress()
  },
  methods: {
    async loadWorkOrder() {
      try {
        const response = await axios.get(`/api/work-orders/by-id/${this.workOrderId}`)
        this.workOrder = response.data
      } catch (error) {
        console.error('Error loading work order:', error)
      }
    },

    async loadProgress() {
      try {
        const response = await axios.get(`/api/work-orders/${this.workOrderId}/progress`)
        this.progress = response.data.progress
        this.updateCurrentStep()
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    },

    async processScan() {
      if (!this.scanInput.trim()) return

      try {
        let endpoint = ''
        switch (this.currentStep) {
          case 1:
          case 4:
            endpoint = '/api/scan/product'
            break
          case 2:
            endpoint = '/api/scan/inner-box'
            break
          case 3:
            endpoint = '/api/scan/outer-box'
            break
        }

        const response = await axios.post(endpoint, {
          workOrderId: this.workOrderId,
          labelCode: this.scanInput,
          userCode: this.userCode
        })

        if (response.data.success) {
          this.successMessage = `สแกนสำเร็จ! (${response.data.scanned || 1})`
          this.showSuccessModal = true
          await this.loadProgress()
        }

        this.scanInput = ''
        this.userCode = ''

      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'เกิดข้อผิดพลาด'
        this.requireUserCode = error.response?.data?.requireUserCode || false
        this.showErrorModal = true
      }
    },
    updateCurrentStep() {
      if (this.progress.product < this.workOrder.snp_quantity) {
        this.currentStep = 1
        this.currentRoundScans.product = this.progress.product % this.workOrder.snp_quantity
      } else if (this.progress.innerBox < this.workOrder.snp_quantity) {
        this.currentStep = 2
        this.currentRoundScans.innerBox = this.progress.innerBox % this.workOrder.snp_quantity
      } else if (this.progress.outerBox === 0) {
        this.currentStep = 3
        this.currentRoundScans.outerBox = 0
      } else {
        this.currentStep = 4
        // คำนวณรอบใหม่
        const completedRounds = Math.floor(this.progress.product / this.workOrder.snp_quantity)
        this.currentRoundScans.product = this.progress.product - (completedRounds * this.workOrder.snp_quantity)
      }
    },
    getScanInstruction() {
      switch (this.currentStep) {
        case 1:
          return 'สแกน QR Code ของลาเบลที่ติดกับตัวชิ้นงาน'
        case 2:
          return 'สแกน Bar Code ของลาเบลกล่องใน'
        case 3:
          return 'สแกน Bar Code ของลาเบลกล่องนอก'
        case 4:
          return ''
        default:
          return ''
      }
    },
    getScanType() {
      switch (this.currentStep) {
        case 1:
        case 4:
          return ''
        case 2:
        case 3:
          return 'Barcode'
        default:
          return ''
      }
    },
    getCurrentScanned() {
      switch (this.currentStep) {
        case 1:
          return this.currentRoundScans.product
        case 2:
          return this.currentRoundScans.innerBox
        case 3:
          return this.currentRoundScans.outerBox
        case 4:
          return this.currentRoundScans.product
        default:
          return 0
      }
    },
    getTargetCount() {
      if (this.currentStep === 3) {
        return 1
      }
      return this.workOrder?.snp_quantity || 0
    },
    getInputPlaceholder() {
      switch (this.currentStep) {
        case 1:
        case 4:
          return 'สแกน QR Code ชิ้นงาน'
        case 2:
          return 'สแกน Barcode กล่องใน'
        case 3:
          return 'สแกน Barcode กล่องนอก'
        default:
          return 'สแกนลาเบล'
      }
    },
    async onInit(promise) {
      try {
        await promise
        this.showScanner = true
      } catch (error) {
        console.error('Camera error:', error)
        this.showScanner = false
      }
    },
    async onDecode(result) {
      this.scanInput = result
      await this.processScan()
    },
    async processScan() {
      if (!this.scanInput.trim()) return

      try {
        let endpoint = ''
        switch (this.currentStep) {
          case 1:
          case 4:
            endpoint = '/api/scan/product'
            break
          case 2:
            endpoint = '/api/scan/inner-box'
            break
          case 3:
            endpoint = '/api/scan/outer-box'
            break
        }

        const response = await axios.post(endpoint, {
          workOrderId: this.workOrderId,
          labelCode: this.scanInput,
          userCode: this.userCode
        })

        if (response.data.success) {
          // อัพเดทตัวนับทันที
          if (this.currentStep === 1 || this.currentStep === 4) {
            this.currentRoundScans.product++
            this.progress.product++
          } else if (this.currentStep === 2) {
            this.currentRoundScans.innerBox++
            this.progress.innerBox++
          } else if (this.currentStep === 3) {
            this.currentRoundScans.outerBox++
            this.progress.outerBox++
          }

          this.successMessage = `สแกนสำเร็จ! (${response.data.scanned || 1}/${this.getTargetCount()})`
          this.showSuccessModal = true

          // รีเฟรชข้อมูลจาก server
          await this.loadProgress()
        }

        this.scanInput = ''
        this.userCode = ''

      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'เกิดข้อผิดพลาด'
        this.requireUserCode = error.response?.data?.requireUserCode || false
        this.showErrorModal = true
      }
    },
    closeErrorModal() {
      if (this.requireUserCode && !this.userCode) {
        return
      }
      this.showErrorModal = false
      this.errorMessage = ''
      this.requireUserCode = false
      this.scanInput = ''
      this.$nextTick(() => {
        if (this.$refs.scanInput) {
          this.$refs.scanInput.focus()
        }
      })
    },
    handleSuccessClose() {
      this.showSuccessModal = false
      this.successMessage = ''

      // ตรวจสอบว่าครบรอบหรือยัง
      const target = this.getTargetCount()
      const current = this.getCurrentScanned()

      if (current >= target) {
        if (this.currentStep === 1) {
          // ครบรอบการสแกนชิ้นงาน ไปขั้นตอนถัดไป
          this.currentStep = 2
          this.currentRoundScans.product = 0
        } else if (this.currentStep === 2) {
          // ครบรอบการสแกนกล่องใน ไปขั้นตอนถัดไป
          this.currentStep = 3
          this.currentRoundScans.innerBox = 0
        } else if (this.currentStep === 3) {
          // สแกนกล่องนอกเสร็จ กลับไปสแกนชิ้นงานรอบใหม่
          this.currentStep = 4
          this.currentRoundScans.product = 0
          this.currentRoundScans.innerBox = 0
          this.currentRoundScans.outerBox = 0
        } else if (this.currentStep === 4) {
          // ครบรอบการสแกนชิ้นงานรอบใหม่ ไปสแกนกล่องใน
          this.currentStep = 2
          this.currentRoundScans.product = 0
        }
      }

      this.$nextTick(() => {
        if (this.$refs.scanInput) {
          this.$refs.scanInput.focus()
        }
      })
    },
    resetProcess() {
      if (confirm('ต้องการเริ่มกระบวนการใหม่?')) {
        this.$router.push('/')
      }
    },
    EmergencyFinish() {
      if (confirm('ต้องการจบงานฉุกเฉินกรุณากรอกเหตุผล?')) {
        this.$router.push('/')
      }
    },
    showEmergencyFinishModal() {
      this.showEmergencyModal = true
      this.emergencyReason = ''
      this.emergencyUserCode = ''

      this.$nextTick(() => {
        if (this.$refs.emergencyUserInput) {
          this.$refs.emergencyUserInput.focus()
        }
      })
    },

    closeEmergencyModal() {
      this.showEmergencyModal = false
      this.emergencyReason = ''
      this.emergencyUserCode = ''
    },

    focusReasonInput() {
      if (this.$refs.emergencyReasonInput) {
        this.$refs.emergencyReasonInput.focus()
      }
    },

    async confirmEmergencyFinish() {
      // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
      if (!this.emergencyUserCode.trim()) {
        alert('กรุณากรอกรหัสผู้ใช้')
        return
      }

      if (!this.emergencyReason.trim()) {
        alert('กรุณากรอกเหตุผล')
        return
      }

      // ยืนยันอีกครั้ง
      if (!confirm('ยืนยันการจบงานฉุกเฉิน?\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
        return
      }

      try {
        const response = await axios.post(
          `/api/work-orders/${this.workOrderId}/emergency-finish`,
          {
            userCode: this.emergencyUserCode,
            reason: this.emergencyReason,
            currentStep: this.currentStep
          }
        )

        if (response.data.success) {
          alert('จบงานฉุกเฉินสำเร็จ\n' +
            `ชิ้นงานที่สแกน: ${response.data.data.productScanned}\n` +
            `กล่องในที่สแกน: ${response.data.data.innerBoxScanned}\n` +
            `กล่องนอกที่สแกน: ${response.data.data.outerBoxScanned}`)

          // กลับไปหน้าแรก
          this.$router.push('/')
        }
      } catch (error) {
        console.error('Emergency finish error:', error)
        alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.error || 'ไม่สามารถจบงานฉุกเฉินได้'))
      }
    }
  },
  computed: {
    scanningStatus() {
      const totalRounds = Math.floor(this.progress.product / this.workOrder.snp_quantity)
      const currentRound = totalRounds + 1

      return {
        currentRound,
        totalOuterBoxes: this.progress.outerBox,
        productScanned: this.progress.product,
        innerBoxScanned: this.progress.innerBox,
        productInCurrentRound: this.currentRoundScans.product,
        innerBoxInCurrentRound: this.currentRoundScans.innerBox
      }
    },

    progressPercentage() {
      const target = this.getTargetCount()
      const current = this.getCurrentScanned()
      return Math.round((current / target) * 100)
    }
  }
}
</script>

<style scoped>
  .btn-emergency {
  background: #ff9800;
  color: white;
  flex: 1;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-emergency:hover {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 152, 0, 0.4);
}

/* Emergency Modal */
.emergency-modal {
  min-width: 500px;
  max-width: 600px;
}

.modal-header.emergency {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border-radius: 15px 15px 0 0;
}

.emergency-warning {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
}

.emergency-warning p {
  margin: 0.5rem 0;
  color: #e65100;
}

.current-progress {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.current-progress h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.current-progress p {
  margin: 0.25rem 0;
  color: #666;
}

.emergency-form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff9800;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #999;
  font-size: 0.85rem;
}

/* Secondary and Danger Buttons */
.btn-secondary {
  background: #9e9e9e;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #757575;
}

.btn-danger {
  background: #f44336;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-danger:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .emergency-modal {
    min-width: 90%;
    margin: 1rem;
  }
  
  .scan-actions {
    flex-direction: column;
  }
  
  .btn-emergency {
    width: 100%;
  }
}
</style>
