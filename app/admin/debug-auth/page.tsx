"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'

export default function DebugAuthPage() {
  const { user, profile, loading } = useAuth()
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)

  const fetchAllProfiles = async () => {
    setLoadingProfiles(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        console.log('All profiles:', data)
        setAllProfiles(data || [])
      }
    } catch (error) {
      console.error('Exception fetching profiles:', error)
    } finally {
      setLoadingProfiles(false)
    }
  }

  const makeUserAdmin = async (userId: string) => {
    try {
      console.log('🔍 [DebugAuth] ===== EXACT SQL UPDATE QUERY =====')
      console.log('🔍 [DebugAuth] UPDATE user_profiles SET role = \'admin\' WHERE id = \'' + userId + '\';')
      console.log('🔍 [DebugAuth] ===========================================')
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', userId)
        .select()

      if (error) {
        console.error('Error updating role:', error)
        alert('Error: ' + error.message)
      } else {
        console.log('Role updated:', data)
        alert('Role updated successfully!')
        fetchAllProfiles()
      }
    } catch (error) {
      console.error('Exception updating role:', error)
      alert('Exception: ' + error.message)
    }
  }

  const testDirectQuery = async () => {
    if (!user?.id) {
      alert('No user ID available')
      return
    }
    
    console.log('🔍 [DebugAuth] ===== TESTING DIRECT DATABASE QUERY =====')
    console.log('🔍 [DebugAuth] User ID:', user.id)
    console.log('🔍 [DebugAuth] Running: SELECT * FROM user_profiles WHERE id = \'' + user.id + '\';')
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      console.log('🔍 [DebugAuth] Direct query result:', { data, error })
      alert(`Direct query result:\nData: ${JSON.stringify(data, null, 2)}\nError: ${error ? JSON.stringify(error) : 'None'}`)
    } catch (err) {
      console.error('🔍 [DebugAuth] Direct query exception:', err)
      alert('Exception: ' + err)
    }
  }

  useEffect(() => {
    fetchAllProfiles()
  }, [])

  return (
    <div className="space-y-6">
             <div>
         <h1 className="text-3xl font-bold">Auth Debug</h1>
         <p className="text-gray-600">Debug authentication and profile issues</p>
         <div className="mt-4 space-x-2">
           <Button onClick={testDirectQuery} variant="outline">
             Test Direct DB Query
           </Button>
         </div>
       </div>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current User Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div><strong>Auth Loading:</strong> {loading ? 'true' : 'false'}</div>
            <div><strong>User ID:</strong> {user?.id || 'No user'}</div>
            <div><strong>User Email:</strong> {user?.email || 'No email'}</div>
            <div><strong>Profile Loaded:</strong> {profile !== undefined ? 'true' : 'false'}</div>
            <div><strong>Profile Role:</strong> {profile?.role || 'undefined/null'}</div>
            <div><strong>Profile Role Type:</strong> {typeof profile?.role}</div>
            {profile && (
              <div>
                <strong>Full Profile:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All User Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All User Profiles
            <Button onClick={fetchAllProfiles} disabled={loadingProfiles}>
              {loadingProfiles ? 'Loading...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allProfiles.length === 0 ? (
            <p className="text-gray-500">No profiles found</p>
          ) : (
            <div className="space-y-3">
              {allProfiles.map((profile) => (
                <div key={profile.id} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">{profile.first_name} {profile.last_name}</div>
                      <div className="text-sm text-gray-500">{profile.id}</div>
                      <div className="text-sm">Email from auth: {user?.id === profile.id ? user.email : 'N/A'}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          Role: {profile.role || 'No role'}
                        </Badge>
                      </div>
                      {profile.role !== 'admin' && (
                        <Button 
                          size="sm" 
                          onClick={() => makeUserAdmin(profile.id)}
                          className="ml-2"
                        >
                          Make Admin
                        </Button>
                      )}
                    </div>
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600">Raw Data</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}