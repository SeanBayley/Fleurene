"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-context"
import { User, Sparkles } from "lucide-react"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, signOut } = useAuth()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      // Get user metadata
      const metadata = user.user_metadata || {}
      setUserData({
        email: user.email,
        firstName: metadata.first_name || "",
        lastName: metadata.last_name || "",
      })
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  if (!user || !userData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            <User className="w-6 h-6 text-pink-500" />
            Your Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-pink-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData.firstName ? userData.firstName[0] : userData.email[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {userData.firstName || userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : "Fleurene User"}
                </h3>
                <p className="text-gray-600 text-sm">{userData.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className="text-gray-700">Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
