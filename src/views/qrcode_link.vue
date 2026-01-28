<template>
  <div class="warranty-system">
    <!-- หน้าแสดง QR Code ทั้งหมด -->
    <div v-if="view === 'qrlist'" class="qr-list-container">
      <div class="header-section">
        <h1 class="main-title">ระบบลงทะเบียนการรับประกันโช้คอัพโทคิโคะ</h1>
        <p class="subtitle">สแกน QR Code เพื่อลงทะเบียนรับประกัน</p>
      </div>

      <div class="qr-grid">
        <div v-for="(item, index) in mockData" :key="index" class="qr-card">
          <div class="card-header">
            <span class="card-badge">ชุดที่ {{ index + 1 }}</span>
          </div>
          
          <div class="qr-container">
            <div ref="qrcode" :id="'qr-' + index" class="qr-code"></div>
          </div>

          <div class="qr-info">
            <p class="info-label">หมายเลข QRCODE</p>
            <p class="info-value">{{ item.number }}</p>
          </div>

          <button @click="handleScanQR(item)" class="open-form-btn">
            เปิดแบบฟอร์ม
          </button>
        </div>
      </div>

      <div class="note-box">
        <p>
          <span class="note-title">หมายเหตุ:</span> 
          ในการใช้งานจริง QR Code จะถูกพิมพ์และแนบมากับสินค้า 
          ลูกค้าสแกน QR Code ด้วยมือถือเพื่อเข้าสู่หน้าลงทะเบียน
        </p>
      </div>
    </div>

    <!-- หน้าฟอร์มลงทะเบียน -->
    <div v-else class="form-container">
      <button @click="backToQRList" class="back-btn">
        ← กลับไปหน้าแรก
      </button>

      <div class="form-card">
        <!-- Header -->
        <div class="form-header">
          <h1 class="form-title">บัตรลงทะเบียนการรับประกันโช้คอัพโทคิโคะ</h1>
          <div class="form-number">
            <span>No. {{ formData.number || '_______________' }}</span>
          </div>
        </div>

        <!-- Form Content -->
        <div class="form-content">
          <!-- ข้อมูลโช้คและรถยนต์ -->
          <div class="form-section">
            <h2 class="section-title">ข้อมูลโช้คและรถยนต์</h2>
            <div class="form-row">
              <div class="form-group">
                <label>หมายเลขโช้ค</label>
                <input 
                  type="text" 
                  v-model="formData.chokenumber" 
                  placeholder="หมายเลขโช้ค"
                />
              </div>
              <div class="form-group">
                <label>เลขทะเบียนรถ</label>
                <input 
                  type="text" 
                  v-model="formData.carnumber" 
                  placeholder="เลขทะเบียนรถ"
                />
              </div>
              <div class="form-group">
                <label>ยี่ห้อรถ</label>
                <input 
                  type="text" 
                  v-model="formData.carbrand" 
                  placeholder="ยี่ห้อรถ"
                />
              </div>
              <div class="form-group">
                <label>รุ่น/ปี</label>
                <input 
                  type="text" 
                  v-model="formData.carmodel" 
                  placeholder="รุ่น/ปี"
                />
              </div>
            </div>
          </div>

          <!-- ข้อมูลผู้ซื้อ -->
          <div class="form-section">
            <h2 class="section-title">ข้อมูลผู้ซื้อ</h2>
            <div class="form-row">
              <div class="form-group full-width">
                <label>ชื่อ-นามสกุลผู้ซื้อ</label>
                <input 
                  type="text" 
                  v-model="formData.name" 
                  placeholder="ชื่อ-นามสกุลผู้ซื้อ"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>บ้านเลขที่</label>
                <input 
                  type="text" 
                  v-model="formData.housenumber" 
                  placeholder="บ้านเลขที่"
                />
              </div>
              <div class="form-group">
                <label>หมู่บ้าน/อาคาร</label>
                <input 
                  type="text" 
                  v-model="formData.village" 
                  placeholder="หมู่บ้าน/อาคาร"
                />
              </div>
              <div class="form-group">
                <label>ซอย</label>
                <input 
                  type="text" 
                  v-model="formData.alley" 
                  placeholder="ซอย"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>ถนน</label>
                <input 
                  type="text" 
                  v-model="formData.road" 
                  placeholder="ถนน"
                />
              </div>
              <div class="form-group">
                <label>แขวง/ตำบล</label>
                <input 
                  type="text" 
                  v-model="formData.subdistrict" 
                  placeholder="แขวง/ตำบล"
                />
              </div>
              <div class="form-group">
                <label>เขต/อำเภอ</label>
                <input 
                  type="text" 
                  v-model="formData.district" 
                  placeholder="เขต/อำเภอ"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>จังหวัด</label>
                <input 
                  type="text" 
                  v-model="formData.province" 
                  placeholder="จังหวัด"
                />
              </div>
              <div class="form-group">
                <label>รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  v-model="formData.zipcode" 
                  placeholder="รหัสไปรษณีย์"
                />
              </div>
              <div class="form-group">
                <label>เบอร์โทร</label>
                <input 
                  type="text" 
                  v-model="formData.telephonenumber" 
                  placeholder="เบอร์โทร"
                />
              </div>
            </div>
          </div>

          <!-- ข้อมูลศูนย์ติดตั้ง -->
          <div class="form-section">
            <h2 class="section-title">ข้อมูลศูนย์ติดตั้ง</h2>
            <div class="form-row">
              <div class="form-group">
                <label>ชื่อร้าน/ศูนย์ติดตั้งโช้ค</label>
                <input 
                  type="text" 
                  v-model="formData.namestaller" 
                  placeholder="ชื่อร้าน/ศูนย์ติดตั้งโช้ค"
                />
              </div>
              <div class="form-group">
                <label>ติดตั้งวันที่</label>
                <input 
                  type="text" 
                  v-model="formData.installerdate" 
                  placeholder="ติดตั้งวันที่"
                />
              </div>
              <div class="form-group">
                <label>เบอร์โทร</label>
                <input 
                  type="text" 
                  v-model="formData.installertelephone" 
                  placeholder="เบอร์โทร"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group double-width">
                <label>ที่อยู่</label>
                <input 
                  type="text" 
                  v-model="formData.installeraddress" 
                  placeholder="ที่อยู่"
                />
              </div>
              <div class="form-group">
                <label>รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  v-model="formData.zipcodeinstaller" 
                  placeholder="รหัสไปรษณีย์"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>หมายเลขกิโลที่เริ่มติดตั้ง</label>
                <input 
                  type="text" 
                  v-model="formData.startofinstall" 
                  placeholder="หมายเลขกิโลที่เริ่มติดตั้ง"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="submit-section">
            <button @click="handleSubmit" class="submit-btn">
              ส่งคำร้อง
            </button>
          </div>

          <!-- Warning Messages -->
          <div class="warning-section">
            <p class="warning-text">
              *โปรดกรอกข้อความให้ละเอียดชัดเจนและส่งมายังบริษัทฯ ภายใน 14 วัน นับจากวันที่ติดตั้ง มิฉะนั้นถือว่าสละสิทธิ์
            </p>
            <p class="warning-text-red">
              **หมายเลขโช้คอัพถ้ามีรอยแก้ไขหรือขูดลบถือว่าโมฆะ
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import axios from 'axios';

export default {
  name: 'EWarranty',
  data() {
    return {
      view: 'qrlist', // 'qrlist' or 'form'
      selectedData: null,
      formData: {
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
        installertelephone: '',
        installeraddress: '',
        zipcodeinstaller: '',
        startofinstall: '',
      },
      mockData: [
        {
          number: 'TK2025A001234',
          chokenumber: 'TK-001234',
          carnumber: 'กก-1234',
          carbrand: 'Toyota',
          carmodel: 'Vios/2020',
          name: 'สมชาย ใจดี',
          housenumber: '123/45',
          village: 'หมู่บ้านสุขสันต์',
          alley: 'ซอยลาดพร้าว 15',
          road: 'ถนนลาดพร้าว',
          subdistrict: 'จอมพล',
          district: 'จตุจักร',
          province: 'กรุงเทพมหานคร',
          zipcode: '10900',
          telephonenumber: '081-234-5678',
          namestaller: 'ร้านช่างโช้คพรีเมียม',
          installerdate: '15/01/2568',
          installertelephone: '02-123-4567',
          installeraddress: '456 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ',
          zipcodeinstaller: '10240',
          startofinstall: '50,000'
        },
        {
          number: 'TK2025B002345',
          chokenumber: 'TK-002345',
          carnumber: 'ขข-5678',
          carbrand: 'Honda',
          carmodel: 'City/2021',
          name: 'สมหญิง รักษ์ดี',
          housenumber: '789/12',
          village: 'คอนโดมิเนียม ABC',
          alley: 'ซอยพระราม 9 ซอย 30',
          road: 'ถนนพระราม 9',
          subdistrict: 'ห้วยขวาง',
          district: 'ห้วยขวาง',
          province: 'กรุงเทพมหานคร',
          zipcode: '10310',
          telephonenumber: '089-765-4321',
          namestaller: 'ศูนย์บริการโช้คมาสเตอร์',
          installerdate: '18/01/2568',
          installertelephone: '02-987-6543',
          installeraddress: '789 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี',
          zipcodeinstaller: '10400',
          startofinstall: '35,000'
        },
        {
          number: 'TK2025C003456',
          chokenumber: 'TK-003456',
          carnumber: 'คค-9012',
          carbrand: 'Mazda',
          carmodel: '3/2022',
          name: 'วิชัย มั่นคง',
          housenumber: '456/78',
          village: 'บ้านสวนสุข',
          alley: 'ซอยรัชดาภิเษก 18',
          road: 'ถนนรัชดาภิเษก',
          subdistrict: 'ดินแดง',
          district: 'ดินแดง',
          province: 'กรุงเทพมหานคร',
          zipcode: '10400',
          telephonenumber: '092-345-6789',
          namestaller: 'ร้านโช้คเทคโนโลยี',
          installerdate: '20/01/2568',
          installertelephone: '02-456-7890',
          installeraddress: '321 ถนนสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา',
          zipcodeinstaller: '10110',
          startofinstall: '42,000'
        },
        {
          number: 'TK2025D004567',
          chokenumber: 'TK-004567',
          carnumber: 'งง-3456',
          carbrand: 'Nissan',
          carmodel: 'Almera/2019',
          name: 'ประภา สว่างดี',
          housenumber: '234/56',
          village: 'หมู่บ้านมณีรัตน์',
          alley: 'ซอยอ่อนนุช 46',
          road: 'ถนนอ่อนนุช',
          subdistrict: 'ประเวศ',
          district: 'ประเวศ',
          province: 'กรุงเทพมหานคร',
          zipcode: '10250',
          telephonenumber: '084-567-8901',
          namestaller: 'ศูนย์โช้คโปร',
          installerdate: '22/01/2568',
          installertelephone: '02-234-5678',
          installeraddress: '567 ถนนศรีนครินทร์ แขวงหนองบอน เขตประเวศ',
          zipcodeinstaller: '10250',
          startofinstall: '28,500'
        },
        {
          number: 'TK2025E005678',
          chokenumber: 'TK-005678',
          carnumber: 'จจ-7890',
          carbrand: 'Mitsubishi',
          carmodel: 'Attrage/2023',
          name: 'สุรชัย ชัยชนะ',
          housenumber: '567/89',
          village: 'คอนโดเพลินนารี',
          alley: 'ซอยเอกมัย 10',
          road: 'ถนนสุขุมวิท',
          subdistrict: 'คลองตันเหนือ',
          district: 'วัฒนา',
          province: 'กรุงเทพมหานคร',
          zipcode: '10110',
          telephonenumber: '086-789-0123',
          namestaller: 'ร้านโช้คเอ็กซ์เพิร์ท',
          installerdate: '25/01/2568',
          installertelephone: '02-345-6789',
          installeraddress: '890 ถนนสุขุมวิท 63 แขวงคลองตันเหนือ เขตวัฒนา',
          zipcodeinstaller: '10110',
          startofinstall: '15,000'
        },
        {
          number: 'TK2025F006789',
          chokenumber: 'TK-006789',
          carnumber: 'ฉฉ-2345',
          carbrand: 'Suzuki',
          carmodel: 'Swift/2021',
          name: 'นภา งามสุข',
          housenumber: '890/23',
          village: 'บ้านพฤกษา',
          alley: 'ซอยพุทธมณฑล สาย 2',
          road: 'ถนนพุทธมณฑล',
          subdistrict: 'ศาลาธรรมสพน์',
          district: 'ทวีวัฒนา',
          province: 'กรุงเทพมหานคร',
          zipcode: '10170',
          telephonenumber: '088-901-2345',
          namestaller: 'ศูนย์โช้คซูเปอร์',
          installerdate: '28/01/2568',
          installertelephone: '02-890-1234',
          installeraddress: '123 ถนนบรมราชชนนี แขวงศาลาธรรมสพน์ เขตทวีวัฒนา',
          zipcodeinstaller: '10170',
          startofinstall: '22,000'
        },
        {
          number: 'TK2025G007890',
          chokenumber: 'TK-007890',
          carnumber: 'ชช-6789',
          carbrand: 'Isuzu',
          carmodel: 'D-Max/2020',
          name: 'สมพงษ์ แข็งแรง',
          housenumber: '345/67',
          village: 'หมู่บ้านปัญญา',
          alley: 'ซอยงามวงศ์วาน 20',
          road: 'ถนนงามวงศ์วาน',
          subdistrict: 'ทุ่งสองห้อง',
          district: 'หลักสี่',
          province: 'กรุงเทพมหานคร',
          zipcode: '10210',
          telephonenumber: '090-123-4567',
          namestaller: 'ร้านโช้คออโต้เซ็นเตอร์',
          installerdate: '30/01/2568',
          installertelephone: '02-567-8901',
          installeraddress: '456 ถนนงามวงศ์วาน แขวงทุ่งสองห้อง เขตหลักสี่',
          zipcodeinstaller: '10210',
          startofinstall: '68,000'
        },
        {
          number: 'TK2025H008901',
          chokenumber: 'TK-008901',
          carnumber: 'ซซ-1234',
          carbrand: 'MG',
          carmodel: 'ZS/2022',
          name: 'อนงค์ สุขใจ',
          housenumber: '678/90',
          village: 'คอนโดไลฟ์แอท',
          alley: 'ซอยรามอินทรา 65',
          road: 'ถนนรามอินทรา',
          subdistrict: 'ท่าแร้ง',
          district: 'บางเขน',
          province: 'กรุงเทพมหานคร',
          zipcode: '10220',
          telephonenumber: '091-234-5678',
          namestaller: 'ศูนย์โช้คพลัส',
          installerdate: '02/02/2568',
          installertelephone: '02-678-9012',
          installeraddress: '789 ถนนรามอินทรา แขวงท่าแร้ง เขตบางเขน',
          zipcodeinstaller: '10220',
          startofinstall: '12,500'
        },
        {
          number: 'TK2025I009012',
          chokenumber: 'TK-009012',
          carnumber: 'ฌฌ-5678',
          carbrand: 'Chevrolet',
          carmodel: 'Colorado/2021',
          name: 'ธนา เจริญสุข',
          housenumber: '901/23',
          village: 'บ้านกลางเมือง',
          alley: 'ซอยสาธร 10',
          road: 'ถนนสาธร',
          subdistrict: 'ยานนาวา',
          district: 'สาทร',
          province: 'กรุงเทพมหานคร',
          zipcode: '10120',
          telephonenumber: '093-456-7890',
          namestaller: 'ร้านโช้คโซลูชั่น',
          installerdate: '05/02/2568',
          installertelephone: '02-789-0123',
          installeraddress: '234 ถนนสาธร แขวงยานนาวา เขตสาทร',
          zipcodeinstaller: '10120',
          startofinstall: '55,000'
        },
        {
          number: 'TK2025J010123',
          chokenumber: 'TK-010123',
          carnumber: 'ญญ-9012',
          carbrand: 'Ford',
          carmodel: 'Ranger/2023',
          name: 'วิภา มีสุข',
          housenumber: '123/45',
          village: 'หมู่บ้านสมบูรณ์',
          alley: 'ซอยประชาชื่น 28',
          road: 'ถนนประชาชื่น',
          subdistrict: 'บางซื่อ',
          district: 'บางซื่อ',
          province: 'กรุงเทพมหานคร',
          zipcode: '10800',
          telephonenumber: '094-567-8901',
          namestaller: 'ศูนย์โช้คเวิลด์',
          installerdate: '08/02/2568',
          installertelephone: '02-890-1234',
          installeraddress: '567 ถนนประชาชื่น แขวงบางซื่อ เขตบางซื่อ',
          zipcodeinstaller: '10800',
          startofinstall: '72,000'
        }
      ]
    }
  },
  mounted() {
    // ตรวจสอบ URL parameter เมื่อโหลดหน้า
    this.checkURLParameter()
    
    // Generate QR codes หลังจาก DOM โหลดเสร็จ
    this.$nextTick(() => {
      if (this.view === 'qrlist') {
        this.generateAllQRCodes()
      }
    })
  },
  methods: {
    generateQRUrl(number) {
      return `${window.location.origin}${window.location.pathname}?id=${number}`
    },
    
    async generateAllQRCodes() {
      for (let i = 0; i < this.mockData.length; i++) {
        const qrElement = document.getElementById(`qr-${i}`)
        if (qrElement) {
          try {
            await QRCode.toCanvas(
              qrElement,
              this.generateQRUrl(this.mockData[i].number),
              {
                width: 180,
                margin: 2,
                color: {
                  dark: '#1e3a8a',
                  light: '#ffffff'
                }
              }
            )
          } catch (err) {
            console.error('Error generating QR code:', err)
          }
        }
      }
    },
    
    checkURLParameter() {
      const urlParams = new URLSearchParams(window.location.search)
      const id = urlParams.get('id')
      if (id) {
        const data = this.mockData.find(item => item.number === id)
        if (data) {
          this.selectedData = data
          this.formData = { ...data }
          this.view = 'form'
        }
      }
    },
    
    handleScanQR(data) {
      this.selectedData = data
      this.formData = { ...data }
      this.view = 'form'
      window.history.pushState({}, '', `?id=${data.number}`)
    },
    
    backToQRList() {
      this.view = 'qrlist'
      this.selectedData = null
      this.formData = {
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
        installertelephone: '',
        installeraddress: '',
        zipcodeinstaller: '',
        startofinstall: '',
      }
      window.history.pushState({}, '', window.location.pathname)
      
      // Re-generate QR codes
      this.$nextTick(() => {
        this.generateAllQRCodes()
      })
    },
    thx () {
      window.location.href = "http://192.168.1.171:8080/thankyou";
    },
    
    handleSubmit() {
      console.log('Submitted data:', this.formData)
      alert('ส่งข้อมูลเรียบร้อยแล้ว!')
      
      //ในการใช้งานจริง จะส่งข้อมูลไปยัง API
      axios.post('http://192.168.1.171:4000/information', this.formData)
        .then(res => {
          console.log('Response:', res)
          this.thx()
        })
        .catch(err => {
          console.error('Error:', err)
        })
      
      //สำหรับ demo ให้กลับไปหน้า QR list
      setTimeout(() => {
        this.backToQRList()
      }, 1500)
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

.warranty-system {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #e0e7ff 100%);
  font-family: 'Sarabun', 'Helvetica Neue', Arial, sans-serif;
}

/* QR List Styles */
.qr-list-container {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #64748b;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.qr-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid #dbeafe;
}

.qr-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.card-header {
  text-align: center;
  margin-bottom: 1rem;
}

.card-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.qr-container {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.qr-code canvas {
  border-radius: 0.5rem;
}

.qr-info {
  text-align: center;
  margin-bottom: 1rem;
}

.info-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  background: #fef3c7;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  display: inline-block;
}

.open-form-btn {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.open-form-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.note-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  border-radius: 0.5rem;
}

.note-box p {
  font-size: 0.875rem;
  color: #78716c;
  line-height: 1.6;
}

.note-title {
  font-weight: 600;
  color: #78716c;
}

/* Form Styles */
.form-container {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0.5rem 0;
}

.back-btn:hover {
  color: #1e40af;
}

.form-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-number {
  margin-top: 1rem;
}

.form-number span {
  background: white;
  color: #2563eb;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-content {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #dbeafe;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group.double-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder {
  color: #cbd5e1;
}

.submit-section {
  text-align: center;
  margin: 2rem 0;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 3rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.submit-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 15px 20px -3px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

.warning-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.warning-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.warning-text-red {
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 600;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .main-title {
    font-size: 1.75rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .qr-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-group.double-width {
    grid-column: 1;
  }

  .form-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
  }

  .qr-grid {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>