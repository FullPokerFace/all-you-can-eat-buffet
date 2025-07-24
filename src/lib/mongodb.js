import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

// Only initialize MongoDB connection if URI is provided
if (uri && uri.startsWith('mongodb')) {
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalThis._mongoClientPromise = client.connect()
    }
    clientPromise = globalThis._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  // Create a rejected promise for when MongoDB is not configured
  clientPromise = Promise.reject(new Error('MongoDB URI not configured or invalid'))
}

export default clientPromise