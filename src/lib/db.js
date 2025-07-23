import clientPromise from './mongodb'

let client
let db

const initDB = async () => {
  if (!client) {
    client = await clientPromise
  }
  if (!db) {
    db = client.db(process.env.DB_NAME)
  }
  return db
}

export const getDB = async () => {
  if (!db) {
    return await initDB()
  }
  return db
}

export const getCollection = async (name) => {
  const database = await getDB()
  return database.collection(name)
}