const { MongoClient } = require('mongodb')
require('dotenv').config()

const client = new MongoClient(process.env.MONGO_URI)

let db

async function connectDB() {
  try {
    await client.connect()
    db = client.db(process.env.MONGO_DB_NAME)
    console.log('MongoDB 연결 성공')
  } catch (error) {
    console.error('MongoDB 연결 실패:', error)
    process.exit(1)
  }
}

function getDB() {
  if (!db) {
    throw new Error('MongoDB가 아직 연결되지 않았습니다.')
  }

  return db
}

module.exports = {
  connectDB,
  getDB
}
