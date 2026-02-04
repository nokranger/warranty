<template>
  <div>
    <h1>Summerize Page</h1>
    <!-- {{ summerize }} -->
    <!-- <div v-for="(summerizes, index) in summerize" :key="index" v-if="index >= 1"> -->
    <!-- {{ summerizes.work_order_id }} -->
    <!-- {{ summerizes.label_type }} -->
    <!-- {{ summerizes.label_code }} -->
    <!-- {{ summerizes.scan_status }} -->
    <!-- {{ summerizes.user_id }} -->
    <!-- {{ summerizes.username }} -->
    <!-- </div> -->
    <div style="max-height: 300px; overflow-y: auto;">
      <b-table striped hover :items="summerize"></b-table>
    </div>
    <b-button v-on:click="setting()" style="margin: 5px;" variant="info">Setting</b-button>
    <b-button v-on:click="exportToExcel()" style="margin: 5px;" variant="success">Export Excel</b-button>
  </div>
</template>
<script>
import * as XLSX from 'xlsx';
import axios from 'axios'

export default {
  data() {
    return {
      summerize: '',
      aa: 0
    }
  },
  async mounted() {
    await this.exportExcel()
  },
  methods: {
    async exportExcel() {
      await axios.get(process.env.VUE_APP_API_BASE_URL + `/work-orders-export/summerizes`).then(response => {
        this.summerize = response.data.result
        console.log('user=====', this.summerize)
      })
    },
    async exportExcel() {
      await axios.get(process.env.VUE_APP_API_BASE_URL + `/work-orders-export/summary`).then(response => {
        this.summerize = response.data.result
        console.log('user=====', this.summerize)
      })
    },
    setting() {
      this.$router.push('/settings');
    },
    exportToExcel() {
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
      XLSX.writeFile(workbook, 'exported_data.xlsx');
    },
  }
}
</script>