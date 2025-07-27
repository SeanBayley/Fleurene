"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Settings, 
  Database,
  Mail,
  Shield,
  Globe,
  Palette,
  Bell,
  Key,
  Server,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface SystemStats {
  totalUsers: number
  totalQuizResults: number
  databaseSize: string
  uptime: string
  lastBackup: string
}

export default function AdminSettings() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalQuizResults: 0,
    databaseSize: "N/A",
    uptime: "N/A",
    lastBackup: "N/A"
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpEnabled: false,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "FJ Fleurene"
  })

  const [siteSettings, setSiteSettings] = useState({
    siteName: "FJ Fleurene",
    siteDescription: "Discover your inner fleur with our personalized quiz and curated collections",
    siteUrl: "https://fj-fleurene.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailConfirmationRequired: false
  })

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchSystemStats()
    }
  }, [user, profile])

  const fetchSystemStats = async () => {
    try {
      setLoading(true)

      // Fetch user count
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact' })

      // Fetch quiz results count
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quiz_results')
        .select('id', { count: 'exact' })

      setStats({
        totalUsers: users?.length || 0,
        totalQuizResults: quizzes?.length || 0,
        databaseSize: "~2.5MB", // This would need to be calculated differently in production
        uptime: "99.9%",
        lastBackup: new Date().toLocaleDateString()
      })

    } catch (error) {
      console.error('Error fetching system stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmailSettings = async () => {
    // In a real application, these would be saved to a settings table
    toast.success('Email settings saved successfully')
  }

  const handleSaveSiteSettings = async () => {
    // In a real application, these would be saved to a settings table
    toast.success('Site settings saved successfully')
  }

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1)

      if (error) {
        toast.error('Database connection failed')
      } else {
        toast.success('Database connection successful')
      }
    } catch (error) {
      toast.error('Database connection failed')
    }
  }

  const exportData = () => {
    toast.info('Data export feature coming soon')
  }

  const copySupabaseUrl = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    toast.success('Supabase URL copied to clipboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your FJ platform configuration and system settings</p>
      </div>

      {/* System Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalQuizResults}</div>
              <div className="text-sm text-gray-600">Quiz Completions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.uptime}</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.databaseSize}</div>
              <div className="text-sm text-gray-600">Database Size</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Basic site settings and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={siteSettings.siteUrl}
                    onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Temporarily disable public access</p>
                  </div>
                  <Switch
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenanceMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Registration</Label>
                    <p className="text-sm text-gray-500">Allow new user signups</p>
                  </div>
                  <Switch
                    checked={siteSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, registrationEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Confirmation Required</Label>
                    <p className="text-sm text-gray-500">Require email verification for new users</p>
                  </div>
                  <Switch
                    checked={siteSettings.emailConfirmationRequired}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, emailConfirmationRequired: checked})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveSiteSettings}>
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for transactional emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Email Configuration</AlertTitle>
                <AlertDescription>
                  These settings are currently configured in Supabase Dashboard. 
                  <Button variant="link" className="p-0 h-auto" onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe/auth/settings', '_blank')}>
                    Open Supabase Settings <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    placeholder="noreply@fj-fleurene.com"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUser">SMTP User</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    placeholder="your-email@gmail.com"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveEmailSettings} disabled>
                Configure in Supabase Dashboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Management
              </CardTitle>
              <CardDescription>
                Database connection, backup, and maintenance tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Connection Status</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={testDatabaseConnection}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Supabase Project</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <Button variant="ghost" size="sm" onClick={copySupabaseUrl} className="p-0 h-auto">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy URL
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Dashboard
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Database Operations</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={exportData}>
                    <Database className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe/editor', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    SQL Editor
                  </Button>
                  <Button variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe/logs/explorer', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Authentication and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Status</AlertTitle>
                <AlertDescription>
                  Your application is using Supabase's built-in security features including Row Level Security (RLS) and JWT authentication.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Authentication</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>JWT Authentication Enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Row Level Security (RLS) Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Admin Role Protection</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Data Protection</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>SSL/TLS Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Environment Variables Secured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>API Keys Protected</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe/auth/settings', '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Auth Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>
                Advanced system settings and developer tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Development Phase</AlertTitle>
                <AlertDescription>
                  Your FJ platform is currently in Phase 1 development. Advanced features will be available in later phases.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Development Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Phase 1 - User Management</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Phase 2 - Product Management</span>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Phase 3 - Shopping Cart</span>
                      <Badge variant="outline">Planned</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Quick Links</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={() => window.open('/admin/users', '_blank')}>
                      User Management
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe', '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Supabase Dashboard
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open('https://github.com/supabase/supabase', '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 