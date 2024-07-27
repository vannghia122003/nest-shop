import app from './app'
import db from './config/database'
import env from './config/environment'

const port = env.PORT || 4000

db.connect()
  .then(() => {
    db.initIndex()
    app.listen(port, () => console.log(`App listening on port ${port} - ${env.BUILD_MODE}`))
  })
  .catch((error) => {
    console.error(error)
    process.exit(0)
  })
