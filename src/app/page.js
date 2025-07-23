'use client'

import { useState } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Warren Buffett. Welcome to my virtual office. Ask me anything about investing, business, or life wisdom. What's on your mind today?"
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage
    }

    setMessages([...messages, newMessage])
    setInputMessage('')

    // Simulate Warren's response (you can replace this with actual AI integration)
    setTimeout(() => {
      const responses = [
        "That's a great question! In my experience, the key is to focus on long-term value.",
        "Rule #1: Never lose money. Rule #2: Never forget rule #1.",
        "Time is the friend of the wonderful business, the enemy of the mediocre.",
        "Price is what you pay. Value is what you get.",
        "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price."
      ]
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)]
      }
      
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4a5568' }}>
      {/* Header with Image and Title */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative mb-4">
          <Image
            src="/buffet.png"
            alt="Warren Buffett"
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">All You Can Ask Buffet</h1>
        <p className="text-gray-200 text-center max-w-md">
          Get wisdom and insights from the Oracle of Omaha
        </p>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                      {message.type === 'bot' ? (
                        <AvatarImage src="/buffet.png" alt="Warren Buffett" />
                      ) : (
                        <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">You</AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6 bg-gray-50/50">
              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Warren Buffett anything..."
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3 px-4"
                />
                <Button 
                  onClick={sendMessage} 
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-3 shadow-md transition-all duration-200 hover:shadow-lg"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • Powered by AI wisdom
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
