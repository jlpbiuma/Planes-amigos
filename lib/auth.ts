import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export interface User {
  id: string
  name: string
  color: string
  created_at: string
}

export async function registerUser(name: string, password: string, color: string = 'bg-blue-500'): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('name', name)
      .single()

    if (existingUser) {
      return { success: false, error: 'User already exists' }
    }

    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          password_hash: passwordHash,
          color,
        }
      ])
      .select('id, name, color, created_at')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: 'Registration failed' }
  }
}

export async function loginUser(name: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, password_hash, color, created_at')
      .eq('name', name)
      .single()

    if (error || !user) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: 'Login failed' }
  }
}

export async function updateUserProfile(userId: string, updates: { name?: string; color?: string }): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, name, color, created_at')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: 'Profile update failed' }
  }
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First verify current password
    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return { success: false, error: 'User not found' }
    }

    // Check current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash)
    
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Hash the new password
    const saltRounds = 10
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Password update failed' }
  }
} 