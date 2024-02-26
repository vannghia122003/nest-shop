const config = {
  api_url: import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:4000',
  max_size_upload_image: 512000, // byte = 500kb,
  user_role_id: '656c0b86cbceef8905dcfbe0',
  super_admin_role_id: '654623673a353e60f74a6254'
}

export default config
