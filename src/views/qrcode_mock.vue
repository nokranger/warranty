<template>
  <div class="qr-generator-container">
    <h1>สร้าง QR Code สำหรับระบบ E-Warranty</h1>
    
    <div class="controls">
      <button @click="generateAllQR" class="btn-primary">
        สร้าง QR Code ทั้งหมด
      </button>
      <button @click="downloadAll" class="btn-success">
        ดาวน์โหลดทั้งหมด (ZIP)
      </button>
    </div>

    <div class="qr-grid">
      <div v-for="(item, index) in qrData" :key="index" class="qr-card">
        <div class="card-badge">ชุดที่ {{ index + 1 }}</div>
        
        <div class="qr-wrapper">
          <canvas :id="'qr-canvas-' + index" class="qr-canvas"></canvas>
        </div>
        
        <div class="qr-info">
          <p class="info-label">หมายเลข QRCODE</p>
          <p class="info-value">{{ item.number }}</p>
          <p class="url-text">{{ item.url }}</p>
        </div>

        <div class="button-group">
          <button @click="downloadSingle(index)" class="btn-download">
            ดาวน์โหลด PNG
          </button>
          <button @click="downloadSVG(index)" class="btn-download-svg">
            ดาวน์โหลด SVG
          </button>
        </div>
      </div>
    </div>

    <div class="instructions">
      <h2>วิธีใช้งาน:</h2>
      <ol>
        <li>คลิก "สร้าง QR Code ทั้งหมด" เพื่อสร้าง QR Code ทั้ง 10 ชุด</li>
        <li>คลิก "ดาวน์โหลด PNG" เพื่อดาวน์โหลดเป็นรูปภาพ</li>
        <li>คลิก "ดาวน์โหลด SVG" เพื่อดาวน์โหลดเป็นไฟล์ SVG (คุณภาพสูง)</li>
        <li>หรือคลิก "ดาวน์โหลดทั้งหมด (ZIP)" เพื่อดาวน์โหลดทั้งหมดพร้อมกัน</li>
      </ol>
      <p class="note">
        <strong>หมายเหตุ:</strong> แก้ไข baseURL จาก localhost เป็น domain จริงของคุณเมื่อนำไปใช้งาน Production
      </p>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default {
  name: 'QRGenerator',
  data() {
    return {
      baseURL: 'http://192.168.1.171:8080/dashboard', // เปลี่ยนเป็น URL จริงของคุณ
      qrData: [
        { number: 'TK2025A001234' },
        { number: 'TK2025B002345' },
        { number: 'TK2025C003456' },
        { number: 'TK2025D004567' },
        { number: 'TK2025E005678' },
        { number: 'TK2025F006789' },
        { number: 'TK2025G007890' },
        { number: 'TK2025H008901' },
        { number: 'TK2025I009012' },
        { number: 'TK2025J010123' }
      ]
    }
  },
  mounted() {
    // เพิ่ม URL ให้กับแต่ละ item
    this.qrData = this.qrData.map(item => ({
      ...item,
      url: `${this.baseURL}?id=${item.number}`
    }))
  },
  methods: {
    async generateAllQR() {
      for (let i = 0; i < this.qrData.length; i++) {
        await this.generateQR(i)
      }
      alert('สร้าง QR Code ทั้งหมดเรียบร้อยแล้ว!')
    },

    async generateQR(index) {
      const canvas = document.getElementById(`qr-canvas-${index}`)
      if (!canvas) return

      try {
        await QRCode.toCanvas(canvas, this.qrData[index].url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1e3a8a',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        })
      } catch (err) {
        console.error('Error generating QR code:', err)
      }
    },

    async downloadSingle(index) {
      const canvas = document.getElementById(`qr-canvas-${index}`)
      if (!canvas) {
        alert('กรุณาสร้าง QR Code ก่อน')
        return
      }

      canvas.toBlob((blob) => {
        saveAs(blob, `QR_${this.qrData[index].number}.png`)
      })
    },

    async downloadSVG(index) {
      try {
        const svg = await QRCode.toString(this.qrData[index].url, {
          type: 'svg',
          width: 300,
          margin: 2,
          color: {
            dark: '#1e3a8a',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        })

        const blob = new Blob([svg], { type: 'image/svg+xml' })
        saveAs(blob, `QR_${this.qrData[index].number}.svg`)
      } catch (err) {
        console.error('Error generating SVG:', err)
      }
    },

    async downloadAll() {
      const zip = new JSZip()
      const folder = zip.folder('QR_Codes')

      for (let i = 0; i < this.qrData.length; i++) {
        const canvas = document.getElementById(`qr-canvas-${i}`)
        if (!canvas) {
          alert('กรุณาสร้าง QR Code ทั้งหมดก่อน')
          return
        }

        // แปลง canvas เป็น blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve)
        })

        // เพิ่มไฟล์ลง ZIP
        folder.file(`QR_${this.qrData[i].number}.png`, blob)
      }

      // สร้างและดาวน์โหลด ZIP
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'QR_Codes_All.zip')
    }
  }
}
</script>

<style scoped>
.qr-generator-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #e0e7ff 100%);
  padding: 2rem 1rem;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 2rem;
}

.controls {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 6px 8px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto 3rem;
}

.qr-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid #dbeafe;
}

.qr-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.card-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
}

.qr-wrapper {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-canvas {
  max-width: 100%;
  height: auto;
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
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  background: #fef3c7;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.url-text {
  font-size: 0.75rem;
  color: #3b82f6;
  word-break: break-all;
  margin-top: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-download,
.btn-download-svg {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-download {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.btn-download:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}

.btn-download-svg {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.3);
}

.btn-download-svg:hover {
  background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
  box-shadow: 0 4px 6px rgba(236, 72, 153, 0.4);
  transform: translateY(-1px);
}

.instructions {
  max-width: 800px;
  margin: 3rem auto 0;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.instructions h2 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.instructions ol {
  margin-left: 1.5rem;
  line-height: 2;
  color: #475569;
}

.note {
  background: #fef3c7;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  border-left: 4px solid #f59e0b;
  color: #78716c;
}

@media (max-width: 768px) {
  .qr-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.5rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-success {
    width: 100%;
  }
}
</style>