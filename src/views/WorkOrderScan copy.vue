<template>
  <div class="work-order-scan">
    <div class="scan-container">
      <h2>สแกน QR Code ของใบงาน Work Order</h2>

      <!-- <div class="qr-scanner">
                <qrcode-stream v-if="showScanner" @decode="onDecode" @init="onInit" :track="paintBoundingBox" />
                <div v-else class="scanner-placeholder">
                    <div class="loading-spinner"></div>
                    <p>กำลังเปิดกล้อง...</p>
                </div>
            </div> -->

      <div class="manual-input">
        <!-- <p>หรือกรอก Work Order Code</p> -->
        <div class="input-group">
          <!-- <input v-model="manualCode" type="text" placeholder="WO-2024-001" @keyup.enter="searchWorkOrder" /> -->
          <input v-model="manualCode" type="text" placeholder="WO-2024-001"
            @keyup.enter="parseWorkOrderLabel(manualCode)" />
          <!-- <button @click="searchWorkOrder" class="btn-primary">ค้นหา</button> -->
          <button @click="parseWorkOrderLabel(manualCode)" class="btn-primary">ค้นหา</button>
        </div>
      </div>

      <div v-if="workOrder" class="work-order-info">
        <h3>✓ ข้อมูล Work Order</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Work Order:</label>
            <span class="info-value">{{ workOrder.work_order_code }}</span>
          </div>
          <div class="info-item">
            <label>Item:</label>
            <span class="info-value">{{ workOrder.item }}</span>
          </div>
          <div class="info-item">
            <label>Customer:</label>
            <span class="info-value">{{ workOrder.customer }}</span>
          </div>
          <div class="info-item highlight">
            <label>SNP:</label>
            <span class="snp-value">{{ workOrder.snp_quantity }}</span>
          </div>
        </div>
        <button @click="confirmWorkOrder" class="btn-success">
          OK - เริ่มตรวจสอบ →
        </button>
      </div>

      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from 'axios'

export default {
  name: 'WorkOrderScan',
  components: {
    QrcodeStream
  },
  data() {
    return {
      showScanner: false,
      manualCode: '',
      workOrder: null,
      error: null
    }
  },
  methods: {
    async onInit(promise) {
      try {
        await promise
        this.showScanner = true
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'กรุณาอนุญาตการใช้กล้อง'
        } else if (error.name === 'NotFoundError') {
          this.error = 'ไม่พบกล้อง'
        } else {
          this.error = 'เกิดข้อผิดพลาดในการเปิดกล้อง'
        }
      }
    },
    paintBoundingBox(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox: { x, y, width, height } } = detectedCode
        ctx.lineWidth = 2
        ctx.strokeStyle = '#00ff00'
        ctx.strokeRect(x, y, width, height)
      }
    },
    async onDecode(result) {
      await this.searchWorkOrder(result)
    },
    async searchWorkOrder(code = null) {
      const searchCode = typeof code === 'string' ? code : this.manualCode
      if (!searchCode) return

      this.error = null
      try {
        // ใช้ encodeURIComponent เพื่อป้องกันปัญหา special characters
        const response = await axios.get(process.env.VUE_APP_API_BASE_URL + `/${encodeURIComponent(searchCode)}`)
        this.workOrder = response.data
      } catch (error) {
        console.error('Search error:', error)
        this.error = 'ไม่พบ Work Order นี้'
        this.workOrder = null
      }
    },
    confirmWorkOrder() {
      if (this.workOrder) {
        this.$router.push({
          name: 'InspectionProcess',
          params: { workOrderId: this.workOrder.id }
        })
      }
    },
    parseWorkOrderLabel(rawString) {
      // ตัวอย่าง: "L0501BA1HU3060286=G             70000000000009700000BA1FIG-030                U3813                    13023936  2025111820251118000000000400000SHOCK  ABSORBER  FR                                    *"

      const result = {
        work_order_code: rawString,
        lineCode: '',
        itemCode: '',
        itemName: '',
        completionDate: '',
        orderdDate: '',
        orderedQty: '',
        orderNo: '',
        subInventory: '',
        fromProcess: '',
        toProcess: '',
      };

      // วิเคราะห์โครงสร้างจากตัวอย่าง
      console.log('Input String Length:', rawString.length);
      console.log('Input String:', rawString);

      // ตำแหน่ง 0-8: Line Code (L0501BA1)
      result.lineCode = rawString.substring(0, 8);

      // ตำแหน่ง 8-18: Item Code ส่วนแรก (HU3060286=G)
      // หา = และแปลงเป็น -
      let pos = 8;
      const itemCodeMatch = rawString.substring(pos).match(/^([A-Z0-9]+)=([A-Z])/);
      if (itemCodeMatch) {
        const itemPart1 = itemCodeMatch[1]; // HU3060286
        const itemPart2 = itemCodeMatch[2]; // G
        pos += itemCodeMatch[0].length; // ไป 18 (8 + 10)

        // หาส่วน 70000 ต่อไป (ข้าม space)
        const remainingAfterG = rawString.substring(pos);
        const itemPart3Match = remainingAfterG.match(/\s+(70000)/);
        if (itemPart3Match) {
          result.itemCode = `${itemPart1}-${itemPart2}-${itemPart3Match[1]}`;
          pos += itemPart3Match[0].length;
        }
      }

      // หา Ordered Qty (97) - อยู่หลัง 70000
      // รูปแบบ: 70000 + 00000000 + 97 + 00000
      const qtyMatch = rawString.match(/70000(\d{8})(\d{2})(\d{5})/);
      if (qtyMatch) {
        result.orderedQty = qtyMatch[2]; // 97
      }

      // หา Subinventory (BA1FIG-030 หรือ BAIFIG-030)
      const subInvMatch = rawString.match(/\d{5}([A-Z0-9]+-\d+)/);
      if (subInvMatch) {
        result.subInventory = subInvMatch[1].slice(-10);
      }

      // หา Order No (13023936) - 8 หัก ก่อนวันที่
      // รูปแบบ: [space]13023936[space][space]20251118
      const orderNoMatch = rawString.match(/\s+(\d{8})\s+(\d{8})(\d{8})/);
      if (orderNoMatch) {
        result.orderNo = orderNoMatch[1]; // 13023936

        // วันที่แรก (20251118)
        const date1 = orderNoMatch[2];
        result.completionDate = `${date1.substring(0, 4)}/${date1.substring(4, 6)}/${date1.substring(6, 8)}`;

        // วันที่สอง (20251118)
        const date2 = orderNoMatch[3];
        result.orderdDate = `${date2.substring(0, 4)}/${date2.substring(4, 6)}/${date2.substring(6, 8)}`;
      }

      // หา Item Name (SHOCK  ABSORBER  FR) - หลังวันที่และเลข 0
      // รูปแบบ: 20251118 + 000000000400000 + SHOCK  ABSORBER  FR
      const itemNameMatch = rawString.match(/\d{8}\d{8}(\d+)([A-Z\s]+?)\s*\*?\s*$/);
      if (itemNameMatch) {
        result.itemName = itemNameMatch[2].trim();
      }

      // From Process & To Process (ไม่มีในสตริง)
      result.fromProcess = 'STORE 24 HR.';
      result.toProcess = 'PACKING';

      console.log('parseLine=========', result)

      return result;
    }
  }
}
</script>