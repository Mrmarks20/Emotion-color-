import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { User } from 'firebase/auth'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  user: User | null
}

export function ShareDialog({ open, onClose, user }: ShareDialogProps) {
  const shareUrl = user ? `${window.location.origin}/shared/${user.uid}` : ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Emotion Diary</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input value={shareUrl} readOnly />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
        <p className="text-sm text-gray-500">
          Share this link with your friends to let them view your Emotion Diary.
        </p>
      </DialogContent>
    </Dialog>
  )
}