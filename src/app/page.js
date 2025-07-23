'use client'

import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Send, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MarkdownMessage } from '@/components/ui/markdown-message'

export default function Home() {
  const messagesEndRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm **Warren Buffett**. Welcome to my virtual office. Ask me anything about:
      • **Investing** - Value investing principles and strategies
      • **Business** - Company analysis and management insights  
      • **Life Wisdom** - Personal philosophy and decision-making
What's on your mind today?`
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }

  // Throttled scroll for better performance during streaming
  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      scrollToBottom()
    }, 100) // 100ms throttle

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userQuestion = inputMessage.trim()
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userQuestion
    }

    flushSync(() => {
      setMessages(prev => [...prev, newMessage])
      setInputMessage('')
      setIsLoading(true)
    })

    // Create a new bot message that will be updated as we stream
    const botMessageId = messages.length + 2
    const initialBotMessage = {
      id: botMessageId,
      type: 'bot',
      content: ''
    }

    flushSync(() => {
      setMessages(prev => [...prev, initialBotMessage])
    })

    try {
      // Call the streaming API endpoint
      const response = await fetch('/api/ask-buffet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          conversationHistory: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        // Keep the last line in buffer if it's incomplete
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6))

              if (data.content) {
                // Update the bot message with new content
                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId
                    ? { ...msg, content: msg.content + data.content }
                    : msg
                ))
              }

              if (data.done) {
                // Streaming is complete
                setIsLoading(false)
                return
              }

              if (data.error) {
                throw new Error(data.error)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)

      // Update the bot message with error content
      setMessages(prev => prev.map(msg =>
        msg.id === botMessageId
          ? { ...msg, content: "I apologize, but I'm having trouble processing your question right now. Please try again in a moment." }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#4a5568' }}>
      {/* Compact Header */}
      <div className="flex items-center justify-center py-4 px-4 border-b border-gray-600/30">
        <div className="flex items-center space-x-4">
          <Image
            src="/buffet.png"
            alt="Warren Buffett"
            width={60}
            height={60}
            className="rounded-full border-2 border-white shadow-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-white">All You Can Ask Buffet</h1>
            <p className="text-gray-300 text-sm">
              Wisdom from the Oracle of Omaha
            </p>
          </div>
        </div>
      </div>

      {/* Full-Page Chat Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-md lg:max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-10 h-10 border-2 border-white shadow-lg">
                  {message.type === 'bot' ? (
                    <AvatarImage src="/buffet.png" alt="Warren Buffett" />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">You</AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${message.type === 'user'
                    ? 'bg-blue-600/90 text-white rounded-br-md'
                    : 'bg-white/95 text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}
                >
                  {message.type === 'user' ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  ) : (
                    <MarkdownMessage
                      content={message.content}
                      className="text-sm leading-relaxed prose-sm max-w-none"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="border-t border-gray-600/30 bg-gray-800/50 backdrop-blur-sm p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 sm:space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Warren Buffett anything..."
              className="flex-1 bg-white/95 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-2 sm:py-3 px-3 sm:px-4 shadow-lg text-sm sm:text-base"
            />
            <Button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • Powered by AI wisdom
          </p>
        </div>
      </div>
    </div>
  )
}
