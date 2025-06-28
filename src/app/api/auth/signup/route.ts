import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getDatabase } from '@/app/lib/mongodb';
import { User, SignupRequest, AuthResponse } from '@/app/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' } as AuthResponse,
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' } as AuthResponse,
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' } as AuthResponse,
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' } as AuthResponse,
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' } as AuthResponse,
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser: Omit<User, '_id'> = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          user: {
            id: result.insertedId.toString(),
            email: newUser.email,
            name: newUser.name,
          },
        } as AuthResponse,
        { status: 201 }
      );
    } else {
      throw new Error('Failed to create user');
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' } as AuthResponse,
      { status: 500 }
    );
  }
}