'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { Send, Paperclip } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: 'customer' | 'vendor'
  text: string
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  vendorId: string
  vendorName: string
  lastMessage: string
  unreadCount: number
  timestamp: Date
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // Mock data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        vendorId: 'vendor1',
        vendorName: 'Rajesh Singh',
        lastMessage: 'Your order will be delivered by 5 PM',
        unreadCount: 0,
        timestamp: new Date(),
      },
      {
        id: '2',
        vendorId: 'vendor2',
        vendorName: 'Amit Kumar',
        lastMessage: 'We have fresh stock available',
        unreadCount: 2,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ]

    setConversations(mockConversations)
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0].id)
      setMessages([
        {
          id: '1',
          senderId: 'vendor1',
          senderName: 'Rajesh Singh',
          senderRole: 'vendor',
          text: 'Hi, your order is confirmed!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: '2',
          senderId: user?.id || '',
          senderName: user?.name || 'You',
          senderRole: 'customer',
          text: 'Great! When will it be delivered?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: '3',
          senderId: 'vendor1',
          senderName: 'Rajesh Singh',
          senderRole: 'vendor',
          text: 'Your order will be delivered by 5 PM',
          timestamp: new Date(),
          read: true,
        },
      ])
    }
  }, [user?.id, user?.name])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: user?.name || 'You',
      senderRole: 'customer',
      text: newMessage,
      timestamp: new Date(),
      read: true,
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-blue-100 mt-1">Chat with your water vendor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="md:col-span-1 card-lg h-full flex flex-col overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Conversations</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversation === conv.id
                    ? 'bg-blue-100 border-l-4 border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-900">{conv.vendorName}</p>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                  <span className="inline-block mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {conv.unreadCount} new
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 card-lg h-full flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">
                  {conversations.find((c) => c.id === selectedConversation)?.vendorName}
                </h2>
                <p className="text-sm text-gray-600">Online</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderRole === 'customer'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderRole === 'customer' ? 'text-blue-100' : 'text-gray-600'}`}>
                        {msg.timestamp.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t pt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="input flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={handleSendMessage} className="btn btn-primary">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Select a conversation to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
