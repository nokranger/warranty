<template>
  <div class="inspection-process">
    <div class="process-container">
      <div class="header-info">
        <h2>กระบวนการตรวจสอบ</h2>
        <div v-if="workOrder" class="work-order-summary">
          <p><strong>WO:</strong> {{ workOrder.orderNo }}</p>
          <p><strong>Item ID:</strong> {{ workOrder.item_id }}</p>
          <p><strong>Item:</strong> {{ workOrder.item }}</p>
          <p><strong>Customer ID:</strong> {{ workOrder.customer_id }}</p>
          <p><strong>Customer Name:</strong> {{ workOrder.customer }}</p>
        </div>
      </div>

      <div class="step-indicator">

        <!-- STEP 1 : QR -->
        <div class="step" :class="{
          active: currentStep === 1 || currentStep === 4
        }">
          <div class="step-number">1</div>
          <div class="step-label">สแกน QR</div>
        </div>

        <!-- STEP 2 : INNER -->
        <div class="step" :class="{
          active: currentStep === 2
        }">
          <div class="step-number">2</div>
          <div class="step-label">สแกนกล่องใน</div>
        </div>

        <!-- STEP 3 : OUTER -->
        <div class="step" :class="{
          active: currentStep === 3
        }" v-if="workOrder.outer_box > 0">
          <div class="step-number">3</div>
          <div class="step-label">สแกนกล่องนอก</div>
        </div>

      </div>

      <div class="scan-area">
        <div class="scan-instruction">
          <h3>{{ getScanInstruction() }}</h3>
          <!-- <p class="scan-type">{{ getScanType() }}</p> -->
        </div>

        <div class="progress-display">
          <div class="progress-item">
            <label>QR Scan:</label>
            <span class="progress-value">{{ progress.product }} / {{ workOrder.order_quantity }}</span>
          </div>
          <!-- <div class="progress-item">
            <label>Target:</label>
            <span class="progress-value">{{ getTargetCount() }}</span>
          </div> -->
          <div class="progress-item">
            <label>Inner Box Scan:</label>
            <span class="progress-value">{{ progress.innerBox }} / {{ workOrder.order_quantity }}</span>
          </div>

          <!-- เพิ่มส่วนนี้เพื่อแสดงจำนวนกล่องนอก -->
          <div class="progress-item highlight-box" v-if="workOrder.outer_box > 0">
            <label>Outer Box Scan:</label>
            <span class="progress-value highlight">{{ progress.outerBox }} / {{ workOrder.outer_box }}</span>
          </div>

          <!-- เพิ่มส่วนนี้เพื่อแสดงรอบที่กำลังทำ -->
          <div class="progress-item highlight-box" v-if="progress.outerBox > 0">
            <label>รอบที่:</label>
            <span class="progress-value highlight">{{ Math.floor(progress.product / workOrder.snp_quantity) + 1
            }}</span>
          </div>
        </div>
        <div class="scanner-input">
          <qrcode-stream v-if="showScanner && (currentStep === 1 || currentStep === 4)" @decode="onDecode"
            @init="onInit" />
          <input v-else v-model="scanInput" type="text" :placeholder="getInputPlaceholder()"
            @keyup.enter="processScan(progress.product, progress.innerBox, progress.outerBox, workOrder.order_quantity, workOrder.outer_box)"
            ref="scanInput" class="scan-input-field" autofocus />
        </div>

        <div class="scan-actions">
          <button
            @click="processScan(progress.product, progress.innerBox, progress.outerBox, workOrder.order_quantity, workOrder.outer_box)"
            class="btn-scan">สแกน</button>
          <button @click="saveProcess" class="btn-reset">เซฟงาน</button>
          <button @click="showEmergencyFinishModal" class="btn-reset">จบงานฉุกเฉิน</button>
        </div>
      </div>
      <!-- Scan Log Table -->
      <br>
      <div class="scan-log-panel">
        <h4>ประวัติการสแกน</h4>

        <table class="scan-log-table">
          <thead>
            <tr style="font-weight: bold;">
              <th>#</th>
              <th>ประเภท</th>
              <th>รอบ</th>
              <th>โค้ด</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in scanLogs.slice().reverse()" :key="index">
              <td>{{ scanLogs.length - index }}</td>
              <td>
                <span :class="'tag ' + log.type">{{ log.type }}</span>
              </td>
              <td>{{ log.round }}</td>
              <td class="code">{{ log.code }}</td>
            </tr>
          </tbody>
        </table>
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
                <label for="userCode">ชื่อผู้ใช้:</label>
                <input v-model="emergencyUserCode" type="password" id="userCode" placeholder="กรอกชื่อผู้ใช้"
                  @keyup.enter="focusReasonInput" ref="emergencyUserInput" />
              </div>

              <div class="form-group">
                <label for="userCode">รหัสผู้ใช้:</label>
                <input v-model="emergencyUserPass" type="password" id="userCode" placeholder="กรอกรหัสผู้ใช้"
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
            <button @click="goToHome" class="btn-success">ตกลง</button>
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
      emergencyUserCode: '',
      emergencyUserPass: '',
      scanLogs: []
    }
  },
  async mounted() {
    await this.loadWorkOrder()
    await this.loadProgress()
  },
  methods: {
    async loadWorkOrder() {
      try {
        const response = await axios.get(process.env.VUE_APP_API_BASE_URL + `/work-orders/by-id/${this.workOrderId}`)
        this.workOrder = response.data
        console.log('workordwer========', this.workOrder)
      } catch (error) {
        console.error('Error loading work order:', error)
      }
    },

    async loadProgress(p1, p2, p3, w1, w2) {
      try {
        const response = await axios.get(process.env.VUE_APP_API_BASE_URL + `/work-orders/${this.workOrderId}/progress`)
        this.progress = response.data.progress
        // this.updateCurrentStep()
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    },
    async processScan() {
      if (!this.scanInput.trim()) return

      // ✅ แบบมีข้อความเตือน
      const thaiRegex = /[\u0E00-\u0E7F]/
      if (thaiRegex.test(this.scanInput)) {
        // แสดงข้อความเตือนแบบเงียบๆ (optional)
        console.log('ตรวจพบภาษาไทย กรุณาสแกนใหม่')

        // เคลียร์และให้สแกนใหม่
        this.scanInput = ''
        this.$nextTick(() => {
          if (this.$refs.scanInput) {
            this.$refs.scanInput.focus()
          }
        })
        return
      }

      try {
        const snp = Number(this.workOrder.snp_quantity)
        const totalQty = Number(this.workOrder.order_quantity)
        const outerLimit = Number(this.workOrder.outer_box)

        const product = this.progress.product
        const inner = this.progress.innerBox
        const outer = this.progress.outerBox

        let endpoint = ''
        let nextStep = this.currentStep

        /* =====================
         * 1) ตัดสินใจว่าจะ scan อะไร
         * ===================== */

        // ===== CASE A: snp = 1 หรือไม่มี outer =====
        if (snp === 1 || outerLimit === 0) {

          // ถ้า product มากกว่า inner → ต้องสแกน inner ก่อน
          if (product > inner) {
            nextStep = 2
            endpoint = '/scan/inner-box'
          }

          // ถ้า product เท่ากับ inner → สแกน product
          else if (product === inner && product < totalQty) {
            nextStep = product === 0 ? 1 : 4
            endpoint = '/scan/product'
          }
        }

        // ===== CASE B: snp > 1 =====
        else {
          const completedRounds = outer
          const roundTarget = Math.min(
            (completedRounds + 1) * snp,
            totalQty
          )

          if (product < roundTarget) {
            nextStep = product === 0 ? 1 : 4
            endpoint = '/scan/product'
          }
          else if (inner < roundTarget) {
            nextStep = 2
            endpoint = '/scan/inner-box'
          }
          else if (
            outer < outerLimit &&
            roundTarget % snp === 0
          ) {
            nextStep = 3
            endpoint = '/scan/outer-box'
          }
          else if (product < totalQty) {
            nextStep = 4
            endpoint = '/scan/product'
          }
          else if (inner < totalQty) {
            nextStep = 2
            endpoint = '/scan/inner-box'
          }
        }

        if (!endpoint) return

        // ===== PRODUCT ต้องขึ้นต้นด้วย SA =====
        if (endpoint.includes('product')) {
          if (!this.scanInput.startsWith('SA')) {
            this.errorMessage = 'QR ต้องขึ้นต้นด้วย SA'
            this.showErrorModal = true
            this.scanInput = ''
            this.$nextTick(() => this.$refs.scanInput?.focus())
            return
          }
        }

        /* =====================
         * ✅ INNER BOX VALIDATION
         * ===================== */
        if (endpoint.includes('inner-box')) {

          const parts = this.scanInput.split('-')
          const code = parts[0] // E20025

          if (code !== this.workOrder.customer_id) {
            this.errorMessage = 'Inner Box ไม่ตรง Customer'
            this.showErrorModal = true
            this.scanInput = ''
            this.$nextTick(() => this.$refs.scanInput?.focus())
            return
          }
        }


        /* =====================
         * ✅ OUTER BOX VALIDATION
         * ===================== */
        if (endpoint.includes('outer-box')) {

          const parts = this.scanInput.split('-')
          const code = parts[0]        // E20025
          const lastNumberRaw = parts[2] // 01

          const lastNumber = parseInt(lastNumberRaw, 10) // ตัด 0 ข้างหน้า

          // 1️⃣ เช็ค customer
          if (code !== this.workOrder.customer_id) {
            this.errorMessage = 'Outer Box ไม่ตรง Customer'
            this.showErrorModal = true
            this.scanInput = ''
            this.$nextTick(() => this.$refs.scanInput?.focus())
            return
          }

          // 2️⃣ ห้ามเป็น -01
          if (lastNumber === 1) {
            this.errorMessage = 'Outer Box ห้ามลงท้าย -01 กรุณาสแกนใหม่'
            this.showErrorModal = true
            this.scanInput = ''
            this.$nextTick(() => this.$refs.scanInput?.focus())
            return
          }

          // 3️⃣ ต้องตรงกับ snp_quantity
          if (lastNumber !== Number(this.workOrder.snp_quantity)) {
            this.errorMessage = `Outer Box ต้องลงท้าย ${this.workOrder.snp_quantity}`
            this.showErrorModal = true
            this.scanInput = ''
            this.$nextTick(() => this.$refs.scanInput?.focus())
            return
          }
        }

        /* =====================
         * 2) ยิง API ก่อน (สำคัญ!)
         * ===================== */
        const user = JSON.parse(localStorage.getItem('user'))

        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL + endpoint,
          {
            workOrderId: this.workOrderId,
            labelCode: this.scanInput,
            user_id: user.id
          }
        )

        if (response.data.success) {
          let type = ''
          if (endpoint.includes('product')) {
            this.progress.product++
            type = 'product'
          }
          if (endpoint.includes('inner')) {
            this.progress.innerBox++
            type = 'inner'
          }
          if (endpoint.includes('outer')) {
            this.progress.outerBox++
            type = 'outer'
          }
          this.scanLogs.push({
            workOrderId: this.workOrderId,
            type,
            code: this.scanInput,
            round: Math.floor(this.progress.product / this.workOrder.snp_quantity) + 1,
            userId: user.id,
            timestamp: new Date().toISOString()
          })
        }

        /* =====================
         * คิด step ใหม่จากค่าหลังสแกน
         * ===================== */
        this.currentStep = this.decideNextStep(
          this.progress.product,
          this.progress.innerBox,
          this.progress.outerBox
        )
        this.scanInput = ''

        /* =====================
         * 3) ตรวจจบงาน "หลังยิง API"
         * ===================== */
        if (
          this.progress.product >= totalQty &&
          this.progress.innerBox >= totalQty &&
          (outerLimit === 0 || this.progress.outerBox >= outerLimit)
        ) {
          this.finishWorkOrder()
          return
        }

        await this.loadProgress()

      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'เกิดข้อผิดพลาด'
        this.requireUserCode = error.response?.data?.requireUserCode || false
        this.showErrorModal = true
      }
    },
    buildStructuredData(scanLogs, snpQuantity) {
      // 1. แยก log ตาม type & round
      const productLogs = scanLogs
        .filter(log => log.type === 'product')
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const innerLogs = scanLogs
        .filter(log => log.type === 'inner')
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // ลำดับเวลา: 5→1 อาจเป็น reverse

      const outerLogs = scanLogs
        .filter(log => log.type === 'outer')
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // 2. จัดกลุ่ม product เป็น chunks ขนาด snpQuantity
      const chunks = [];
      for (let i = 0; i < productLogs.length; i += snpQuantity) {
        chunks.push(productLogs.slice(i, i + snpQuantity));
      }

      // 3. สร้าง data แบบ items
      const data = [];
      let round = 1;

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const productsInChunk = chunks[chunkIndex];
        const currentRound = Math.floor(chunkIndex / (innerLogs.length || 1)) + 1; // หรือใช้ log.round ถ้ามี

        // หา inner box สำหรับ chunk นี้
        const innerLog = innerLogs[chunkIndex] || null;
        const outerLog = outerLogs.find(log => log.round === currentRound) || null;

        const items = productsInChunk.map(p => ({
          product: p.code,
          innerBox: innerLog ? innerLog.code : null,
          outerBox: outerLog ? outerLog.code : null
        }));

        data.push({
          round: currentRound,
          items
        });

        // อัปเดต round เมื่อเริ่ม chunk ใหม่ที่เป็น inner ชุดใหม่
        if ((chunkIndex + 1) % innerLogs.length === 0 && innerLogs.length > 0) {
          round++;
        }
      }

      return { data };
    },
    decideNextStep(product, inner, outer) {

      const snp = Number(this.workOrder.snp_quantity)
      const totalQty = Number(this.workOrder.order_quantity)
      const outerLimit = Number(this.workOrder.outer_box)

      // ===== CASE A: snp = 1 หรือไม่มี outer =====
      if (snp === 1 || outerLimit === 0) {

        if (product > inner) {
          return 2 // inner
        }

        if (product === inner && product < totalQty) {
          return product === 0 ? 1 : 4 // product
        }
      }

      // ===== CASE B: snp > 1 =====
      const completedRounds = outer
      const roundTarget = Math.min(
        (completedRounds + 1) * snp,
        totalQty
      )

      if (product < roundTarget) {
        return product === 0 ? 1 : 4
      }

      if (inner < roundTarget) {
        return 2
      }

      if (outer < outerLimit && roundTarget % snp === 0) {
        return 3
      }

      if (product < totalQty) {
        return 4
      }

      if (inner < totalQty) {
        return 2
      }

      return this.currentStep
    },
    finishWorkOrder() {
      this.successMessage = `สำเร็จ!
      QR: ${this.progress.product}/${this.workOrder.order_quantity}
      Inner: ${this.progress.innerBox}/${this.workOrder.order_quantity}
      Outer: ${this.progress.outerBox}/${this.workOrder.outer_box}`

      this.showSuccessModal = true
      this.currentStep = null
    },
    goToHome() {
      this.showSuccessModal = false
      this.$router.push('/')   // หรือชื่อ route หน้าแรก
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
    getScanInstruction() {
      console.log('progress=====', this.progress.innerBox, this.progress.product)
      console.log('workOrder=====', this.workOrder.snp_quantity, this.workOrder.outer_box, this.workOrder.order_quantity)
      console.log('workOrder=====', this.currentStep)
      switch (this.currentStep) {
        case 1:
          return 'สแกน QR Code ของลาเบลที่ติดกับตัวชิ้นงาน'
        case 2:
          return 'สแกน Bar Code ของลาเบลกล่องใน'
        case 3:
          return this.workOrder.outer_box === '0' ? '' : 'สแกน Bar Code ของลาเบลกล่องนอก'
        case 4:
          return 'สแกน QR Code ของลาเบลที่ติดกับตัวชิ้นงาน (รอบถัดไป)'
        default:
          return ''
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

    async saveProcess() {
      try {
        console.log('workOrderSave', this.workOrder)

        if (!this.workOrder || !this.workOrder.id) {
          alert('Invalid work order data');
          return;
        }

        // แสดง confirm dialog
        if (!confirm('ต้องการบันทึกกระบวนการไหม?')) {
          return; // ถ้ายกเลิกก็ไม่ทำอะไร
        }

        // เตรียม payload
        const payload = {
          work_order_id: this.workOrder.id,
          user_id: this.workOrder.user_id || this.$store.state.user?.id || null
        }

        console.log('Saving process with payload:', payload)

        // เรียก API
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/work-orders/saveProcess`,
          payload
        );

        console.log('Save response:', response.data)

        if (response.data.success) {
          // แสดงข้อความสำเร็จ
          alert(response.data.message || 'บันทึกกระบวนการสำเร็จ');

          // กลับไปหน้าแรก หรือหน้าที่ต้องการ
          this.$router.push('/');

          // หรือถ้าต้องการ reload ข้อมูล
          // await this.loadWorkOrderData();
        } else {
          alert(response.data.message || 'ไม่สามารถบันทึกกระบวนการได้');
        }

      } catch (error) {
        console.error('Error saving process:', error);

        if (error.response) {
          const errorData = error.response.data;

          if (error.response.status === 404) {
            alert('ไม่พบใบงานนี้ในระบบ');
          } else if (error.response.status === 409) {
            alert(errorData.message || 'ไม่สามารถบันทึกใบงานที่เสร็จสมบูรณ์แล้ว');
          } else {
            alert(errorData.message || 'เกิดข้อผิดพลาดในการบันทึก');
          }
        } else {
          alert('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        }
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

    checkWorkOrder(p1, p2, p3, w1, w2) {
      console.log('progress======', p1, p2, p3, w1, w2)
    },

    async confirmEmergencyFinish() {
      // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
      if (!this.emergencyUserCode.trim()) {
        alert('กรุณากรอกรหัสผู้ใช้')
        return
      }

      if (!this.emergencyUserPass.trim()) {
        alert('กรุณากรอกรหัสผ่าน')
        return
      }

      if (!this.emergencyReason.trim()) {
        alert('กรุณากรอกเหตุผล')
        return
      }

      if (!confirm('ยืนยันการจบงานฉุกเฉิน?\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
        return
      }

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/work-orders/${this.workOrderId}/emergency-finish`,
          {
            userCode: this.emergencyUserCode,
            userPass: this.emergencyUserPass,
            reason: this.emergencyReason,
            currentStep: this.currentStep
          }
        )

        if (response.data.success) {
          alert(
            'จบงานฉุกเฉินสำเร็จ\n' +
            `ผู้อนุมัติ: ${response.data.data.supervisorName || this.emergencyUserCode}\n` +
            `เหตุผล: ${response.data.data.reason}`
          )

          // รีเซ็ตฟอร์ม
          this.emergencyUserCode = ''
          this.emergencyUserPass = ''
          this.emergencyReason = ''

          // กลับไปหน้าแรก
          this.$router.push('/')
        }

      } catch (error) {
        console.error('Emergency finish error:', error)

        if (error.response) {
          const errorData = error.response.data

          if (error.response.status === 401) {
            // รหัสผ่านไม่ถูกต้อง
            alert('รหัสผ่านไม่ถูกต้อง\nกรุณากรอกใหม่')
            // เคลียร์รหัสผ่าน
            this.emergencyUserPass = ''
          } else if (error.response.status === 403) {
            // ไม่มีสิทธิ์ (ไม่ใช่ supervisor)
            alert('ไม่สามารถดำเนินการได้\n' + (errorData.error || 'เฉพาะ Supervisor เท่านั้น'))
            // เคลียร์ทั้ง username และ password
            this.emergencyUserCode = ''
            this.emergencyUserPass = ''
          } else if (error.response.status === 404) {
            // ไม่พบ user
            alert('ไม่พบรหัสผู้ใช้ในระบบ\nกรุณาตรวจสอบและกรอกใหม่')
            // เคลียร์ทั้ง username และ password
            this.emergencyUserCode = ''
            this.emergencyUserPass = ''
          } else {
            // Error อื่นๆ
            alert('เกิดข้อผิดพลาด: ' + (errorData.error || 'ไม่สามารถจบงานฉุกเฉินได้'))
          }
        } else {
          alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
        }
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
      return target > 0 ? Math.round((current / target) * 100) : 0
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
