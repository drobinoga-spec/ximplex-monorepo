import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already in use' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in profiles table
    const { data: newUser, error: createError } = await supabase
      .from('profiles')
      .insert([
        {
          email,
          name,
          password_hash: hashedPassword,
          subscription_plan: 'free',
          subscription_status: 'active',
          created_at: new Date().toISOString(),
        },
      ])
      .select('id, email, name')
      .single();

    if (createError) {
      console.error('User creation error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
        user: newUser,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('POST /api/auth/signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}