import { getDB } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDB()
    
    // Test the database connection
    const result = await db.admin().ping()
    
    return Response.json({ 
      message: 'Database connection successful!', 
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return Response.json(
      { 
        error: 'Failed to connect to database',
        message: error.message 
      },
      { status: 500 }
    )
  }
}