import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getDatabase } from '@/app/lib/mongodb';
import { User, LoginRequest, AuthResponse } from '@/app/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' } as AuthResponse,
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' } as AuthResponse,
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' } as AuthResponse,
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id!.toString(),
          email: user.email,
          name: user.name,
        },
      } as AuthResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' } as AuthResponse,
      { status: 500 }
    );
  }
}