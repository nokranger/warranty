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
              หมายเลขโช้ค
            </div>
            <div>
              <b-input type="text" v-model="data.chokenumber"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เลขทะเบียนรถ
            </div>
            <div>
              <b-input type="text" v-model="data.carnumber"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ยี่ห้อรถ
            </div>
            <div>
              <b-input type="text" v-model="data.carbrand"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              รุ่น/ปี
            </div>
            <div>
              <b-input type="text" v-model="data.carmodel"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ชื่อ-นามสกุลผู้ซื้อ
            </div>
            <div>
              <b-input type="text" v-model="data.name"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              บ้านเลขที่
            </div>
            <div>
              <b-input type="text" v-model="data.housenumber"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              หมู่บ้าน/อาคาร
            </div>
            <div>
              <b-input type="text" v-model="data.village"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ซอย
            </div>
            <div>
              <b-input type="text" v-model="data.alley"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ถนน
            </div>
            <div>
              <b-input type="text" v-model="data.road"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              แขวง/ตำบล
            </div>
            <div>
              <b-input type="text" v-model="data.subdistrict"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เขต/อำเภอ
            </div>
            <div>
              <b-input type="text" v-model="data.district"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              จังหวัด
            </div>
            <div>
              <b-input type="text" v-model="data.province"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              รหัสไปรษณีย์
            </div>
            <div>
              <b-input type="text" v-model="data.zipcode"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เบอร์โทร
            </div>
            <div>
              <b-input type="text" v-model="data.telephonenumber"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ชื่อร้าน/ศูนย์ติดตั้งโช้ค
            </div>
            <div>
              <b-input type="text" v-model="data.namestaller"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              ติดตั้งวันที่
            </div>
            <div>
              <b-input type="text" v-model="data.installerdate"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เบอร์โทร
            </div>
            <div>
              <b-input type="text" v-model="data.installtelephone"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ที่อยู่
            </div>
            <div>
              <b-input type="text" v-model="data.installeraddress"/>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div>
            <div>
              รหัสไปรษณีย์
            </div>
            <div>
              <b-input type="text" v-model="data.zipcodeinstaller"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              หมายเลขกิโลที่เริ่มติดตั้ง
            </div>
            <div>
              <b-input type="text" v-model="data.startofinstall"/>
            </div>
          </div>
        </b-col>
        <b-col></b-col>
      </b-row>
      <br>
      <div>
        <b-button variant="success">ส่งคำร้อง</b-button>
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
        axios.post('localhost:8080/test', this.data).then((res) => {
          console.log('show data', res)
        })
      }
    }
  }
</script>
