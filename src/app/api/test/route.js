import { getDB } from '@/lib/db'

export async function GET() {
  try {
    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.startsWith('mongodb')) {
      return Response.json({ 
        message: 'Application is running successfully!', 
        status: 'MongoDB not configured (optional feature)',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    }

    // Test the database connection if configured
    const db = await getDB()
    const result = await db.admin().ping()
    
    return Response.json({ 
      message: 'Database connection successful!', 
      result,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return Response.json(
      { 
        message: 'Application is running, but database connection failed',
        error: 'Failed to connect to database',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 200 } // Changed to 200 since app still works without DB
    )
  }
}