import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  hashedPassword: string;
  name?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}