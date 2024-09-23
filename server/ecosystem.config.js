/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'nest-shop-api',
      script: 'dist/main.js',
      watch: true
    }
  ]
}
// pm2 start dist/main.js --name nest-shop-api
