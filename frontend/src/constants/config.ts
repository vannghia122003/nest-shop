const config = {
  api_url: import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:4000',
  max_size_upload_image: 512000 // byte = 500kb,
}

export default config
