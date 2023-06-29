<template>
  <div>
    <b-container class="bv-example-row">
      บัตรลงทะเบียนการรับประกันโช้คอัพโทคิโคะ
      <div>
        No.________________
      </div>
      <b-row>
        <b-col>
          <div>
            <div>
              หมายเลขโช้ค
            </div>
            <div>
              <b-input type="text" v-model="data.nochok"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เลขทะเบียนรถ
            </div>
            <div>
              <b-input type="text" v-model="data.novahicle"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ยี่ห้อรถ
            </div>
            <div>
              <b-input type="text" v-model="data.vahicle"/>
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
              <b-input type="text" v-model="data.year"/>
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
              <b-input type="text" v-model="data.noaddress"/>
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
              <b-input type="text" v-model="data.noaddress2"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ซอย
            </div>
            <div>
              <b-input type="text" v-model="data.noaddress3"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ถนน
            </div>
            <div>
              <b-input type="text" v-model="data.noaddress4"/>
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
              <b-input type="text" v-model="data.noaddress5"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เขต/อำเภอ
            </div>
            <div>
              <b-input type="text" v-model="data.noaddress6"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              จังหวัด
            </div>
            <div>
              <b-input type="text" v-model="data.noaddress7"/>
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
              <b-input type="text" v-model="data.noaddress8"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เบอร์โทร
            </div>
            <div>
              <b-input type="text" v-model="data.tel"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ชื่อร้าน/ศูนย์ติดตั้งโช้ค
            </div>
            <div>
              <b-input type="text" v-model="data.addressinstall"/>
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
              <b-input type="text" v-model="data.dateinstall"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              เบอร์โทร
            </div>
            <div>
              <b-input type="text" v-model="data.tel2"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              ที่อยู่
            </div>
            <div>
              <b-input type="text" v-model="data.addressinstall2"/>
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
              <b-input type="text" v-model="data.addressinstall3"/>
            </div>
          </div>
        </b-col>
        <b-col>
          <div>
            <div>
              หมายเลขกิโลที่เริ่มติดตั้ง
            </div>
            <div>
              <b-input type="text" v-model="data.nokilometer"/>
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
        **โปรดกรอดข้อความให้ละเอียดชัดเจนและส่งมายังบริษัทฯ ภายใน 14 วัน นับจากวันที่ติดตั้ง มิฉะนั้นถือว่าสละสิทธิ์
        **หมายเลขโช้คอัพถ้ามีรอยแก้ไขหรือขูดลบถือว่าโมฆะ
      </div>
    </b-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: [],
        items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
      }
    }
  }
</script>
