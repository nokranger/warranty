<template>
  <div>
    Show Data
    <b-container>
      <b-table :items="items">
      <template v-slot:cell(number)="data">
          <a :href="'viewer'" target="_blank">{{ data.item.number }}</a>
      </template>
    </b-table>
    </b-container>
    <!-- <div>
      {{ items }}
    </div> -->
  </div>
</template>
<script>
import axios from 'axios'
  export default {
      data() {
        return {
          data: {
            number: '',
            chokenumber: '',
            carnumber: '',
            carbrand: '',
            carmodel: '', 
            name: '',
            housenumber: '',
            village: '',
            alley: '',
            road: '',
            subdistrict: '',
            district: '',
            province: '',
            zipcode: '',
            telephonenumber: '',
            namestaller: '',
            installerdate: '',
            installtelephone: '',
            installeraddress: '',
            zipcodeinstaller: '',
            startofinstall: '',
          },
          items: []
        }
      },
      mounted () {
        axios.get('http://192.168.1.42:4000/getinformation').then((res) => {
            console.log('show data', res)
            this.items = res.data.result
          })
      },
      methods: {
        sendData() {
          console.log('Showdata', this.data)
          axios.get('http://192.168.1.42:4000/information').then((res) => {
            console.log('show data', res)
            this.items = res
          })
        }
      }
    }
</script>