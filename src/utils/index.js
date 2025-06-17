export const base64ToFile = (
  base64Data,
  fileName = `${new Date().getTime()}.jpg`,
  mimeType = 'image/jpeg'
) => {
  try {
    if (!base64Data) {
      throw new Error('base64Data 不能為空')
    }

    // 將 Base64 字符串轉換為 Uint8Array
    const binaryData = atob(base64Data)
    const arrayBuffer = new ArrayBuffer(binaryData.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i)
    }

    // 創建 Blob 對像
    const blob = new Blob([uint8Array], { type: mimeType })

    // 創建 File 對像
    const file = new File([blob], fileName, { type: mimeType })
    return file
  } catch (error) {
    console.error('Base64轉File失敗:', error)
    throw error
  }
}
