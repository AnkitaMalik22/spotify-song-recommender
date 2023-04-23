import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/


// export default ({ mode }) => {
//   // Load the environment variables into process.env
//   Object.assign(process.env, loadEnv(mode, process.cwd()));

//   // Now you can access the environment variables
//   console.log(process.env); // prints the environment variables

//   // Other Vite configuration options go here...
// }

export default defineConfig({
  plugins: [react()],
})
