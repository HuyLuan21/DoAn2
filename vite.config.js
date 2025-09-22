import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'   // if React
// import vue from '@vitejs/plugin-vue'       // if Vue

export default defineConfig({
  plugins: [
    // react(), 
    // vue()
  ],
  root: '.',          // your project root
  server: {
    port: 5173,       // default Vite port
  },
})
