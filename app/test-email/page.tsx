"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, TestTube, CheckCircle, AlertCircle } from 'lucide-react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [action, setAction] = useState('signup')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmail = async () => {
    if (!email) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to test email' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test Supabase Email Functionality
          </CardTitle>
          <CardDescription>
            Test if Supabase's built-in email confirmation and password reset emails are working
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="action">Email Action</Label>
              <select
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="signup">Signup Confirmation</option>
                <option value="reset-password">Password Reset</option>
                <option value="magic-link">Magic Link</option>
              </select>
            </div>

            <Button 
              onClick={testEmail} 
              disabled={!email || loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Email'}
            </Button>
          </div>

          {result && (
            <Alert className={result.error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              {result.error ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={result.error ? 'text-red-800' : 'text-green-800'}>
                {result.error || result.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">What this tests:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• <strong>Signup Confirmation:</strong> Tests if new user registration emails are sent</li>
              <li>• <strong>Password Reset:</strong> Tests if password reset emails are sent</li>
              <li>• <strong>Magic Link:</strong> Tests if passwordless login emails are sent</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Next Steps:</h3>
            <ol className="text-sm space-y-1 text-blue-700">
              <li>1. Enter your email and test each action</li>
              <li>2. Check your email inbox (and spam folder)</li>
              <li>3. If emails aren't received, check Supabase Dashboard settings</li>
              <li>4. Configure SMTP settings in Supabase if needed</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 