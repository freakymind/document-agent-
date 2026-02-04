'use client'

import React from "react"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Loader2, Bot, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function generateResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase()
  
  // Document requirements
  if (msg.includes('document') && (msg.includes('need') || msg.includes('required') || msg.includes('require'))) {
    return 'Required documents depend on your application type:\n\n• Personal Account: Passport/ID, Proof of Address, Bank Statement\n• Business Account: Business Registration, Tax Certificate, Proof of Address, Bank Statement\n• Loan Application: ID, Proof of Income (Salary Slip/Tax Return), Bank Statement\n• Credit Card: ID, Proof of Income, Bank Statement\n\nAll documents are automatically fetched from your application system.'
  }
  
  // Quality checks
  if (msg.includes('quality') || msg.includes('blur') || msg.includes('resolution')) {
    return 'Our AI performs comprehensive quality checks on each document:\n\n• Image Resolution: Minimum 300 DPI\n• Blur Detection: Sharp text and edges\n• Lighting Analysis: Proper exposure and contrast\n• Completeness: All corners and information visible\n\nDocuments scoring below 70% may require resubmission.'
  }
  
  // Tampering detection
  if (msg.includes('tamper') || msg.includes('fraud') || msg.includes('fake') || msg.includes('authentic')) {
    return 'We use advanced AI to detect document tampering:\n\n• Edge Analysis: Detects unnatural borders or modifications\n• Font Consistency: Identifies mismatched fonts\n• Metadata Verification: Checks creation date and software\n• Pattern Recognition: Compares against known authentic documents\n\nDocuments with tampering scores below 85% are flagged for manual review.'
  }
  
  // Processing time
  if (msg.includes('how long') || msg.includes('time') || msg.includes('process')) {
    return 'Document processing typically takes 2-5 minutes:\n\n1. Completeness Check: 30 seconds\n2. Quality Analysis: 1 minute\n3. Tampering Detection: 1-2 minutes\n4. Data Extraction: 1 minute\n5. AI Verification: 30 seconds\n\nYou can monitor real-time progress on the status page.'
  }
  
  // Application number
  if (msg.includes('application') && msg.includes('number')) {
    return 'You can verify documents by entering your application number on the verification page. The system will automatically fetch all documents associated with your application from the external document system and process them according to your institution\'s requirements.'
  }
  
  // Extraction/data
  if (msg.includes('extract') || msg.includes('data') || msg.includes('information')) {
    return 'Our AI extracts key information from documents:\n\n• From ID/Passport: Full name, DOB, document number, expiry date\n• From Proof of Address: Full address, issue date\n• From Financial Docs: Account numbers, balances, dates\n• From Business Docs: Company name, registration number, tax ID\n\nExtracted data is cross-verified with your application details.'
  }
  
  // Status/results
  if (msg.includes('status') || msg.includes('result') || msg.includes('check')) {
    return 'You can check your verification status at any time. The system provides:\n\n• Real-time processing updates\n• Document-by-document status\n• Quality and tampering scores\n• Extracted data comparison\n• Overall verification result\n\nIf any issues are detected, you\'ll see specific recommendations.'
  }
  
  // Admin/configuration
  if (msg.includes('admin') || msg.includes('configure') || msg.includes('setup')) {
    return 'Administrators can configure the system via the Admin Dashboard:\n\n• Add/edit institutions and their requirements\n• Define document types and required fields\n• Set quality and tampering thresholds\n• View all applications and their status\n• Manage verification workflows\n\nAccess the admin panel from the main menu.'
  }
  
  // General greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return 'Hello! I\'m DocIntel Assistant. I can help you understand the document verification process, required documents, and answer any questions about your application. How can I assist you today?'
  }
  
  // Help/capabilities
  if (msg.includes('help') || msg.includes('can you') || msg.includes('what can')) {
    return 'I can help you with:\n\n• Required documents for different application types\n• Document quality and tampering detection\n• Processing times and status updates\n• Data extraction and verification\n• Admin configuration and setup\n• Troubleshooting verification issues\n\nWhat would you like to know more about?'
  }
  
  // Default response
  return 'I can help answer questions about:\n\n• Document requirements and types\n• Quality checks and tampering detection\n• Processing times and status updates\n• Data extraction and verification\n• Admin configuration\n\nCould you please rephrase your question or ask about one of these topics?'
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m DocIntel Assistant. I can help you understand the document verification process, required documents, and answer any questions about your application. How can I assist you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col border-border bg-card shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-base">DocIntel Assistant</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[75%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <UserIcon className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ask about document requirements, verification process, or application status
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
