'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const user = useStore((s) => s.user)
  const setUser = useStore((s) => s.setUser)
  const supabase = createClient()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  if (!user) return null

  // 🔥 SAVE NAME
  const handleSave = async () => {
    if (!name.trim()) return

    await supabase.from('profiles').update({ name }).eq('id', user.id)

    setUser({ ...user, name })
    setIsEditing(false)
  }

  // 🔥 UPLOAD AVATAR
  const handleUpload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const path = `${user.id}/${Date.now()}`

    await supabase.storage.from('avatars').upload(path, file)

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = data.publicUrl

    if (!publicUrl) return alert('Upload error')

    await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', user.id)

    setUser({ ...user, avatar: publicUrl })
  }

  // 🔥 REMOVE AVATAR
  const handleRemoveAvatar = async () => {
    await supabase
      .from('profiles')
      .update({ avatar: null }) // DB da null bo‘lishi mumkin

    setUser({
      ...user,
      avatar: undefined // 🔥 TS fix
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      <Card className="w-full max-w-md p-8 rounded-3xl border bg-background shadow-xl">

        {/* AVATAR */}
        <div className="flex flex-col items-center gap-4">

          <div className="relative group">
            <img
              src={
                user.avatar
                  ? `${user.avatar}?t=${Date.now()}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
              }
              className="w-24 h-24 rounded-full object-cover border shadow-md transition group-hover:scale-105"
            />

            {isEditing && (
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUpload}
              />
            )}
          </div>

          {/* NAME */}
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-xl font-semibold rounded-xl"
            />
          ) : (
            <h2 className="text-2xl font-semibold">{user.name}</h2>
          )}

          {/* ROLE */}
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {user.role.replace('_', ' ')}
          </p>
        </div>

        {/* ACTION */}
        <div className="mt-8">

          {isEditing ? (
            <div className="flex justify-end gap-2 mt-4">

              {/* CANCEL */}
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>

              {/* REMOVE */}
              {user.avatar && (
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirm(true)}
                  className="text-red-500"
                >
                  Remove
                </Button>
              )}

              {/* SAVE */}
              <Button onClick={handleSave} className="rounded-xl">
                Save
              </Button>

            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full rounded-xl"
            >
              Edit Profile
            </Button>
          )}

        </div>

      </Card>

      {/* 🔥 CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-background p-6 rounded-2xl shadow-xl w-[300px]">

            <h3 className="text-lg font-semibold mb-2">
              Remove photo?
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete your profile photo?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleRemoveAvatar}
              >
                Remove
              </Button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}