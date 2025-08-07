export const randomColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
  '#F8C471',
  '#82E0AA',
  '#F1948A',
  '#85C1E9',
  '#D7BDE2',
  '#A9CCE3',
  '#F9E79F',
  '#D5A6BD',
  '#A2D9CE',
  '#F7DC6F',
]

export const generateRandomColor = () => {
  return randomColors[Math.floor(Math.random() * randomColors.length)]
}

const groupColors = ref<Record<string, string>>({})

// 获取或生成分组颜色
export const getGroupColor = (sheetName: string): string => {
  if (!groupColors.value[sheetName]) {
    groupColors.value[sheetName] = generateRandomColor()
  }
  return groupColors.value[sheetName]
}
