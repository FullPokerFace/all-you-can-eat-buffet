import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { promises as fs } from 'fs'
import path from 'path'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY
})

// Cache the Warren Buffett persona to avoid disk I/O on every request
let buffetPersonaCache = null

// Function to load and cache the persona
async function getBuffetPersona() {
  if (!buffetPersonaCache) {
    try {
      const buffetPromptPath = path.join(process.cwd(), 'public', 'buffet.md')
      buffetPersonaCache = await fs.readFile(buffetPromptPath, 'utf-8')
      console.log('📝 Warren Buffett persona loaded and cached (' +
        Math.round(buffetPersonaCache.length / 1024) + 'KB)')
    } catch (error) {
      console.error('❌ Error loading persona file:', error)
      // Fallback persona if file read fails
      buffetPersonaCache = `You are Warren Buffett, the legendary investor known as the Oracle of Omaha. Respond with investment wisdom, business insights, and your characteristic folksy but brilliant approach to analyzing companies and markets.`
    }
  }
  return buffetPersonaCache
}

// Utility function to optimize conversation history
function optimizeConversationHistory(history) {
  // Remove any system messages from history to avoid duplication
  // Keep only the last N messages to manage token usage
  const maxHistoryMessages = 20 // Adjust based on token limits

  const filteredHistory = history
    .filter(msg => msg.role !== 'system')
    .slice(-maxHistoryMessages)

  return filteredHistory
}

export async function POST(request) {
  try {
    // Parse the incoming request body
    const body = await request.json()
    const { question, conversationHistory = [] } = body

    // Validate the request
    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Log the user question for debugging
    console.log('📧 New question received:', {
      question: question.trim(),
      timestamp: new Date().toISOString(),
      conversationLength: conversationHistory.length
    })

    // Get the cached Warren Buffett persona
    const buffetPrompt = await getBuffetPersona()

    // Optimize conversation history to reduce token usage
    const optimizedHistory = optimizeConversationHistory(conversationHistory)

    // Prepare the messages array with optimized persona attachment
    const messages = []

    // Only include system prompt if:
    // 1. No conversation history (first message), OR
    // 2. History doesn't start with a system message
    const needsSystemPrompt = optimizedHistory.length === 0 ||
      optimizedHistory[0]?.role !== 'system'

    if (needsSystemPrompt) {
      messages.push({
        role: 'system',
        content: buffetPrompt
      })
    }

    // Add optimized conversation history
    messages.push(...optimizedHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })))

    // Add the current question
    messages.push({
      role: 'user',
      content: question.trim()
    })

    // Log message structure for debugging
    console.log('💬 Message structure:', {
      totalMessages: messages.length,
      hasSystemPrompt: messages[0]?.role === 'system',
      originalHistoryLength: conversationHistory.length,
      optimizedHistoryLength: optimizedHistory.length,
      systemPromptIncluded: needsSystemPrompt,
      personaCached: buffetPersonaCache !== null
    })

    // Create a streaming chat completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-4.1-2025-04-14',
      messages: messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000
    })

    // Create a ReadableStream to handle the streaming response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content
            if (delta) {
              // Format the chunk as Server-Sent Events
              const sseData = `data: ${JSON.stringify({ content: delta })}\n\n`
              controller.enqueue(encoder.encode(sseData))
            }
          }
          // Send a final message to indicate completion
          const finalData = `data: ${JSON.stringify({ done: true })}\n\n`
          controller.enqueue(encoder.encode(finalData))
          controller.close()
        } catch (error) {
          console.error('❌ Streaming error:', error)
          const errorData = `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.close()
        }
      }
    })

    // Return the streaming response
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('❌ Error in ask-buffet API:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong processing your request'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to ask Warren Buffett a question.' },
    { status: 405 }
  )
}