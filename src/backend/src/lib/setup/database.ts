import mongoose from 'mongoose'

const connect = (database: string) => {
  mongoose.set('strictQuery', false)
  return new Promise<void>((resolve, reject) => {
    mongoose.connect(database).catch((err: any) => {
      console.error(err)
      process.exit(1)
    })
    const db = mongoose.connection
    db.on('open', () => {
      console.log('Connected to database')
      resolve()
    })
    db.on('error', (err) => {
      reject(err)
    })
  })
}

export default { connect }
