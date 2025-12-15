import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 서버에서 history API fallback 활성화
    historyApiFallback: true,
  },
  preview: {
    // 프리뷰 서버에서도 history API fallback 활성화
    historyApiFallback: true,
  },
})
