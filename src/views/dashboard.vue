<template>
  <div>
    <b-container class="bv-example-row">
      บัตรลงทะเบียนการรับประกันโช้คอัพโทคิโคะ
      <div>
        <b-row>
          <b-col></b-col>
          <b-col></b-col>
          <b-col>
            No.________________
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col>
          <div>
            <div>
              <b-container></b-container>
              <div class="something">
                หมายเลขโช้ค
              </div>
                <b-input type="text" v-model="data.chokenumber" placeholder="หมายเลขโช้ค"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เลขทะเบียนรถ
            </div>
            <div>
              <b-input type="text" v-model="data.carnumber" placeholder="เลขทะเบียนรถ"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ยี่ห้อรถ
            </div>
            <div>
              <b-input type="text" v-model="data.carbrand" placeholder="ยี่ห้อรถ"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              รุ่น/ปี
            </div>
            <div>
              <b-input type="text" v-model="data.carmodel" placeholder="รุ่นปี"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              ชื่อ-นามสกุลผู้ซื้อ
            </div>
            <div>
              <b-input type="text" v-model="data.name" placeholder="ชื่อ-นามสกุลผู้ซื้อ"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              บ้านเลขที่
            </div>
            <div>
              <b-input type="text" v-model="data.housenumber" placeholder="บ้านเลขที่"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              หมู่บ้าน/อาคาร
            </div>
            <div>
              <b-input type="text" v-model="data.village" placeholder="หมู่บ้าน/อาคาร"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ซอย
            </div>
            <div>
              <b-input type="text" v-model="data.alley" placeholder="ซอย"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              ถนน
            </div>
            <div>
              <b-input type="text" v-model="data.road" placeholder="ถนน"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              แขวง/ตำบล
            </div>
            <div>
              <b-input type="text" v-model="data.subdistrict" placeholder="แขวง/ตำบล"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เขต/อำเภอ
            </div>
            <div>
              <b-input type="text" v-model="data.district" placeholder="เขต/อำเภอ"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              จังหวัด
            </div>
            <div>
              <b-input type="text" v-model="data.province" placeholder="จังหวัด"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              รหัสไปรษณีย์
            </div>
            <div>
              <b-input type="text" v-model="data.zipcode" placeholder="รหัสไปรษณีย์"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เบอร์โทร
            </div>
            <div>
              <b-input type="text" v-model="data.telephonenumber" placeholder="เบอร์โทร"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              ชื่อร้าน/ศูนย์ติดตั้งโช้ค
            </div>
            <div>
              <b-input type="text" v-model="data.namestaller" placeholder="ชื่อร้าน/ศูนย์ติดตั้งโช้ค"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ติดตั้งวันที่
            </div>
            <div>
              <b-input type="text" v-model="data.installerdate" placeholder="ติดตั้งวันที่"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เบอร์โทร
            </div>
            <div>
              <b-input type="text" v-model="data.installertelephone" placeholder="เบอร์โทร"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              ที่อยู่
            </div>
            <div>
              <b-input type="text" v-model="data.installeraddress" placeholder="ที่อยู่"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              รหัสไปรษณีย์
            </div>
            <div>
              <b-input type="text" v-model="data.zipcodeinstaller" placeholder="รหัสไปรษณีย์"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              หมายเลขกิโลที่เริ่มติดตั้ง
            </div>
            <div>
              <b-input type="text" v-model="data.startofinstall" placeholder="หมายเลขกิโลที่เริ่มติดตั้ง"/>
            </div>
          </div>
        </b-col>
        <b-col></b-col>
        <b-col></b-col>
      </b-row>
      <br>
      <div>
        <b-button variant="success" v-on:click="sendData()">ส่งคำร้อง</b-button>
      </div>
      <br>
      <div>
        *โปรดกรอดข้อความให้ละเอียดชัดเจนและส่งมายังบริษัทฯ ภายใน 14 วัน นับจากวันที่ติดตั้ง มิฉะนั้นถือว่าสละสิทธิ์
        <div style="color: red;">
          **หมายเลขโช้คอัพถ้ามีรอยแก้ไขหรือขูดลบถือว่าโมฆะ
        </div>
        <div>
          {{data}}
        </div>
      </div>
    </b-container>
  </div>
</template>
<script>
import axios from 'axios'
  export default {
    data() {
      return {
        data: {
          number: 'ABCDEFR',
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
          installertelephone: '',
          installeraddress: '',
          zipcodeinstaller: '',
          startofinstall: '',
        },
        items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
      }
    },
    methods: {
      sendData() {
        console.log('Showdata', this.data)
        axios.post('http://192.168.1.42:4000/information', this.data).then((res) => {
          console.log('show data', res)
          this.data = {}
        })
      }
    }
  }
</script>
<style scoped>
div.a {float: left;}
.something {
  display: inline-block;
}
input[type="text"] {
border: none;
border-bottom: 1px solid;
border-radius: 0;
/* float: right; */
display: inline-block;
}
</style>
