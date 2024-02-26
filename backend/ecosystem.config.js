/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'nest-shop-api',
      script: 'node dist/server.js',
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
