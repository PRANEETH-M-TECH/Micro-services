'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { Camera, Save, Phone, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    block: user?.block || '',
    flatNumber: user?.flatNumber || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      // TODO: Add API call to update user profile
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-blue-100 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="card-lg h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white mb-4">
              <span className="text-4xl font-bold">{(user?.name || 'U').charAt(0)}</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
              <Camera className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 card-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Block & Flat */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="block" className="label">
                  Block
                </label>
                <input
                  id="block"
                  type="text"
                  name="block"
                  className="input"
                  value={formData.block}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="flatNumber" className="label">
                  Flat Number
                </label>
                <input
                  id="flatNumber"
                  type="text"
                  name="flatNumber"
                  className="input"
                  value={formData.flatNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <button onClick={handleSave} className="btn btn-primary w-full flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button className="w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors border-b">
            <p className="font-semibold text-gray-900">Change Password</p>
            <p className="text-sm text-gray-600">Update your login password</p>
          </button>
          <button className="w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors border-b">
            <p className="font-semibold text-gray-900">Notification Preferences</p>
            <p className="text-sm text-gray-600">Manage email and SMS notifications</p>
          </button>
          <button className="w-full p-4 text-left hover:bg-red-50 rounded-lg transition-colors">
            <p className="font-semibold text-red-600">Delete Account</p>
            <p className="text-sm text-red-600">Permanently delete your account and data</p>
          </button>
        </div>
      </div>
    </div>
  )
}
