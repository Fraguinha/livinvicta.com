import { Express } from 'express'
import auth from '../../routes/auth.js'
import categories from '../../routes/categories.js'
import contact from '../../routes/contact.js'
import featured from '../../routes/featured.js'
import projects from '../../routes/projects.js'

const configure = (app: Express) => {
  app.use('/api/contact', contact)
  app.use('/api', featured)
  app.use('/api', projects)
  app.use('/api', categories)
  app.use('/api', auth)
}

export default { configure }
