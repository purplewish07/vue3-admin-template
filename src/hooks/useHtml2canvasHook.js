import { base64ToFile } from '@/utils/index'
import html2canvas from 'html2canvas'

/**
 * @typedef {Object} ImageOptions
 * @property {boolean} [useCORS=true] - 是否允許跨域
 * @property {number} [quality=0.8] - 圖片質量 0-1
 * @property {'jpeg'|'png'|'webp'} [format='jpeg'] - 圖片格式
 * @property {string} [fileName] - 下載的文件名
 */

export default () => {
  /**
   * 生成canvas的通用方法
   */
  const generateCanvas = async (node, options = {}) => {
    const defaultOptions = {
      useCORS: true,
      ...options
    }
    return html2canvas(node, defaultOptions)
  }

  /**
   * 獲取圖片URL
   * @param {HTMLElement} node - DOM節點
   * @param {ImageOptions} options - 配置選項
   * @returns {Promise<string>} 圖片的data URL
   */
  const getImageUrl = async (node, options = {}) => {
    try {
      const { quality = 0.8, format = 'jpeg', ...canvasOptions } = options

      const canvas = await generateCanvas(node, canvasOptions)
      return canvas.toDataURL(`image/${format}`, quality)
    } catch (error) {
      console.error('獲取圖片URL失敗:', error)
      throw error
    }
  }

  /**
   * 下載圖片
   * @param {HTMLElement} node - DOM節點
   * @param {ImageOptions} options - 配置選項
   * @returns {Promise<void>}
   */
  const downloadImage = async (node, options = {}) => {
    try {
      const {
        quality = 0.8,
        format = 'jpeg',
        fileName = `${new Date().getTime()}.${format}`,
        ...canvasOptions
      } = options

      const dataUrl = await getImageUrl(node, {
        quality,
        format,
        ...canvasOptions
      })
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '')
      const file = base64ToFile(base64Data, fileName, `image/${format}`)

      // 創建下載鏈接
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('下載圖片失敗:', error)
      throw error
    }
  }

  return {
    getImageUrl,
    downloadImage
  }
}
