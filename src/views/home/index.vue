<template>
  <div class="inspection-container">
    <div flex-center mb-20><h2>抽查系统</h2></div>

    <!-- 文件上传区域 -->
    <div class="upload-section">
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="false"
        accept=".xlsx,.xls"
      >
        <div flex-center gap-10>
          <i-ep-upload-filled />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx/xls 文件</div>
        </template>
      </el-upload>
    </div>

    <!-- 文件信息显示 -->
    <div v-if="uploadedFileName" class="file-info">
      <el-card>
        <template #header>
          <span>已上传文件</span>
        </template>
        <div class="file-details">
          <i-ep-document class="file-icon" />
          <span class="file-name">{{ uploadedFileName }}</span>
        </div>
      </el-card>
    </div>

    <!-- 抽查控制区域 -->
    <div v-if="Object.keys(allSheetData).length > 0" class="sampling-controls">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>抽查设置</span>
            <el-button type="primary" @click="performSampling" :loading="sampling">
              执行抽查
            </el-button>
          </div>
        </template>
        <div class="sampling-info">
          <div class="sampling-input">
            <span>抽查比例:</span>
            <el-input-number
              v-model="samplingRate"
              :min="1"
              :max="100"
              :precision="0"
              controls-position="right"
              class="w-120 mx-8"
            />
            <span>%</span>
          </div>
          <p>将抽查每个表单中所有人名的{{ samplingRate }}%</p>
        </div>
      </el-card>
    </div>

    <!-- 抽查结果 -->
    <div v-if="samplingResults.length > 0" class="sampling-results">
      <el-card>
        <template #header>
          <span>抽查结果</span>
        </template>
        <div v-for="(result, index) in samplingResults" :key="index" class="result-item">
          <div class="result-header">
            <h4>{{ result.sheetName }}</h4>
            <div class="result-stats">
              <el-tag type="info">总人数: {{ result.totalCount }}</el-tag>
              <el-tag type="success">抽查人数: {{ result.sampledCount }}</el-tag>
            </div>
          </div>
          <div class="sampled-data-display" flex>
            <div v-for="(row, rowIndex) in result.sampledData" :key="rowIndex" class="data-row">
              <span v-for="(cell, cellIndex) in row" :key="cellIndex" class="data-cell">
                {{ cell }}
              </span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const allSheetData = ref<Record<string, unknown[][]>>({})
const samplingResults = ref<any[]>([])
const sampling = ref(false)
const samplingRate = ref(10)
const uploadedFileName = ref('')

// 处理文件上传
const handleFileChange = (file: any) => {
  // 保存文件名
  uploadedFileName.value = file.name

  const reader = new FileReader()
  reader.onload = e => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })

      // 清空之前的数据
      allSheetData.value = {}
      samplingResults.value = []

      // 解析所有工作表
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName]
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
        allSheetData.value[sheetName] = sheetData
        console.log(`工作表 "${sheetName}" 数据:`, sheetData)
      })

      ElMessage.success('文件解析成功！')
      console.log('所有工作表数据:', allSheetData.value)
    } catch (error) {
      console.error('Error parsing Excel file:', error)
      ElMessage.error('文件解析失败，请检查文件格式')
      uploadedFileName.value = ''
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

// 执行抽查
const performSampling = () => {
  sampling.value = true
  samplingResults.value = []

  try {
    Object.entries(allSheetData.value).forEach(([sheetName, sheetData]) => {
      if (sheetData.length <= 1) {
        // 如果只有标题行，跳过
        return
      }

      // 获取所有数据行（包括第一行）
      const dataRows = sheetData
      const headers = sheetData[0] // 仍然使用第一行作为表头显示

      // 计算抽查数量（动态比例）
      const totalCount = dataRows.length
      const sampleCount = Math.max(1, Math.round(totalCount * (samplingRate.value / 100)))

      // 随机选择抽查的行
      const sampledIndices = getRandomIndices(totalCount, sampleCount)
      const sampledData = sampledIndices.map(index => dataRows[index])

      samplingResults.value.push({
        sheetName,
        totalCount,
        sampledCount: sampleCount,
        headers,
        sampledData,
      })
    })

    ElMessage.success({
      message: `抽查完成！共抽查了 ${samplingResults.value.length} 个工作表`,
      grouping: true,
    })
  } catch (error) {
    console.error('Error during sampling:', error)
    ElMessage.error('抽查过程中出现错误')
  } finally {
    sampling.value = false
  }
}

// 生成随机索引
const getRandomIndices = (total: number, count: number): number[] => {
  const indices = Array.from({ length: total }, (_, i) => i)
  const result: number[] = []

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * indices.length)
    result.push(indices[randomIndex])
    indices.splice(randomIndex, 1)
  }

  return result
}
</script>

<style scoped>
.inspection-container {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
}

.upload-section {
  margin-bottom: 2rem;
}

.file-info {
  margin-bottom: 2rem;
}

.file-details {
  display: flex;
  gap: 12px;
  align-items: center;
}

.file-icon {
  font-size: 20px;
  color: #409eff;
}

.file-name {
  font-weight: 500;
  color: #333;
  word-break: break-all;
}

.sampling-controls {
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sampling-info {
  color: #666;
}

.sampling-info p {
  margin: 0.5rem 0;
}

.sampling-input {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.sampling-input span {
  font-weight: 500;
  color: #333;
}

.sampling-results {
  margin-bottom: 2rem;
}

.result-item {
  margin-bottom: 2rem;
}

.result-item h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.result-stats {
  display: flex;
  gap: 8px;
}

.original-data {
  margin-top: 2rem;
}

.sheet-container {
  padding: 1rem;
  margin-bottom: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.sheet-container h3 {
  padding-bottom: 0.5rem;
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  font-weight: bold;
  background-color: #f8f9fa;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f0f0f0;
}

.upload-demo {
  width: 100%;
}

.sampled-data-display {
  margin-top: 1rem;
}

.sampled-data-display h5 {
  margin-bottom: 0.5rem;
  font-size: 14px;
  color: #333;
}

.data-row {
  padding: 8px;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.row-header {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.row-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.data-cell {
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
}
</style>
