import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export interface User {
  id: string
  name: string
  created_at: string
}

export async function registerUser(name: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
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
        }
      ])
      .select('id, name, created_at')
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
      .select('id, name, password_hash, created_at')
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