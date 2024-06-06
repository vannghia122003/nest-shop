/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'nest-shop-api',
      script: 'dist/server.js',
      watch: true,
      env: {
        PORT: 4000,
        BUILD_MODE: 'dev'
      },
      env_production: {
        PORT: 4000,
        BUILD_MODE: 'production'
      }
    }
  ]
}
// pm2 start ecosystem.config.js --env production
