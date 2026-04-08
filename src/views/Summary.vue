<template>
  <div>
    <h1>Summary Page</h1>
    <!-- {{ summerize }} -->
    <!-- <div v-for="(summerizes, index) in summerize" :key="index" v-if="index >= 1"> -->
    <!-- {{ summerizes.work_order_id }} -->
    <!-- {{ summerizes.label_type }} -->
    <!-- {{ summerizes.label_code }} -->
    <!-- {{ summerizes.scan_status }} -->
    <!-- {{ summerizes.user_id }} -->
    <!-- {{ summerizes.username }} -->
    <!-- </div> -->
    <!-- <div style="max-height: 300px; overflow-y: auto;">
      <b-table striped hover :items="summerize"></b-table>
    </div> -->
    <!-- <b-button v-on:click="setting()" style="margin: 5px;" variant="info">Setting</b-button> -->
    <!-- <b-button v-on:click="exportToExcel()" style="margin: 5px;" variant="success">Export Excel</b-button> -->


    <br>
    <br>

    <div class="scan-container">
      <div class="card">
        <h2 class="title">Scan History</h2>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="date-group">
            <label class="date-label">วันที่เริ่มต้น</label>
            <input type="date" v-model="startDate1" class="date-input" />
          </div>

          <span class="date-separator">→</span>

          <div class="date-group">
            <label class="date-label">วันที่สิ้นสุด</label>
            <input type="date" v-model="endDate1" class="date-input" />
          </div>

          <button class="search-btn" @click="fetchScanHistory()">
            <!-- <span v-if="loading" class="spinner"></span> -->
            <span>🔍 ค้นหา</span>
          </button>
        </div>
      </div>
      <div class="card">
        <h2 class="title">Work Order Summary</h2>
        <br>
        <br>
        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="date-group">
            <label class="date-label">วันที่เริ่มต้น</label>
            <input type="date" v-model="startDate2" class="date-input" />
          </div>

          <span class="date-separator">→</span>

          <div class="date-group">
            <label class="date-label">วันที่สิ้นสุด</label>
            <input type="date" v-model="endDate2" class="date-input" />
          </div>

          <button class="search-btn" @click="exportExcel()">
            <!-- <span v-if="loading" class="spinner"></span> -->
            <span>🔍 ค้นหา</span>
          </button>

          <!-- <button class="reset-btn" @click="resetFilter">รีเซ็ต</button> -->
        </div>
        <b-button v-on:click="setting()" style="margin: 5px;" variant="info">Setting</b-button>
      </div>
      <!-- <b-button v-on:click="setting()" style="margin: 5px;" variant="info">Setting</b-button> -->
    </div>
  </div>
</template>
<script>
import * as XLSX from 'xlsx';
import axios from 'axios'

export default {
  data() {
    return {
      summerize: '',
      startDate1: '',
      endDate1: '',
      startDate2: '',
      endDate2: '',
      scanHistory: [],
      aa: 0
    }
  },
  async mounted() {
    // await this.exportExcel()
  },
  methods: {
    // async exportExcel() {
    //   await axios.get(process.env.VUE_APP_API_BASE_URL + `/work-orders-export/summerizes`).then(response => {
    //     this.summerize = response.data.result
    //     console.log('user=====', this.summerize)
    //   })
    // },
    async exportExcel() {
      await axios.post(process.env.VUE_APP_API_BASE_URL + `/work-orders-export/summary`, {
        start_date: this.startDate2,
        end_date: this.endDate2
      }).then(response => {
        this.summerize = response.data.result
        console.log('user=====', this.summerize)
      })
      await this.exportToExcel2()
    },
    async fetchScanHistory() {
      if (!this.startDate1 || !this.endDate1) {
        alert('กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด')
        return
      }

      await axios.post(process.env.VUE_APP_API_BASE_URL + `/work-orders-export/scanhistorydata`, {
        start_date: this.startDate1,
        end_date: this.endDate1
      }).then(response => {
        this.scanHistory = response.data.result
        console.log('scanHistory=====', this.scanHistory)
      }).catch(error => {
        console.error('Error fetching scan history:', error)
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล')
      })
      await this.exportToExcel()
    },
    setting() {
      this.$router.push('/settings');
    },
    exportToExcel() {
      // console.log('JSONTYPEOF2Aftermap2',this.summerize)
      const scanHistory = Object.values(this.scanHistory);
      // console.log('JSONTYPEOF2Aftermap23', this.jsonArray)

      //export to excell
      const workbook = XLSX.utils.book_new();

      // Convert the JSON data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(scanHistory);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Save the workbook to a file
      XLSX.writeFile(workbook, 'exported_scanHistory.xlsx');
    },
    exportToExcel2() {
      // console.log('JSONTYPEOF2Aftermap2',this.summerize)
      const summerize = Object.values(this.summerize);
      // console.log('JSONTYPEOF2Aftermap23', this.jsonArray)

      //export to excell
      const workbook = XLSX.utils.book_new();

      // Convert the JSON data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(summerize);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Save the workbook to a file
      XLSX.writeFile(workbook, 'exported_WorkOrderSummary.xlsx');
    },
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.scan-container {
  font-family: 'IBM Plex Sans Thai', sans-serif;
  background: #f0f2f5;
  min-height: 100vh;
  padding: 32px 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 28px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e8eaf0;
  letter-spacing: 0.3px;
}

/* ───── Filter Bar ───── */
.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.date-input {
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 14px;
  color: #1a1a2e;
  background: #f7f8fa;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 9px 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  min-width: 160px;
}

.date-input:hover {
  border-color: #4f7cff;
}

.date-input:focus {
  border-color: #4f7cff;
  box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.15);
  background: #fff;
}

.date-separator {
  font-size: 18px;
  color: #9ca3af;
  padding-bottom: 10px;
  user-select: none;
}

.search-btn {
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: #4f7cff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 110px;
  justify-content: center;
  height: 40px;
}

.search-btn:hover:not(:disabled) {
  background: #3a63e0;
  box-shadow: 0 4px 12px rgba(79, 124, 255, 0.35);
  transform: translateY(-1px);
}

.search-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.search-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ───── Table ───── */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e8eaf0;
}

.scan-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.scan-table thead tr {
  background: #f7f8fa;
}

.scan-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  border-bottom: 1.5px solid #e8eaf0;
}

.scan-table tbody tr {
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.15s;
}

.scan-table tbody tr:hover {
  background: #f7f8ff;
}

.scan-table tbody tr:last-child {
  border-bottom: none;
}

.scan-table td {
  padding: 11px 16px;
  color: #374151;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
}

/* Badge - label_type */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 500;
  font-family: 'IBM Plex Sans Thai', sans-serif;
  background: #e0e7ff;
  color: #4338ca;
}

.badge.inner_box {
  background: #fef3c7;
  color: #92400e;
}

.badge.product {
  background: #d1fae5;
  color: #065f46;
}

/* Status */
.status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
}

.status.success {
  color: #059669;
}

.status.success::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #059669;
  display: inline-block;
}

.status.error {
  color: #dc2626;
}

.status.error::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #dc2626;
  display: inline-block;
}

.error-cell {
  color: #9ca3af !important;
  font-style: italic;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #9ca3af;
  font-size: 15px;
}
</style>