import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db } from 'mongodb';

// Generate a unique group code
function generateGroupCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Check if group code is unique
async function isGroupCodeUnique(db: Db, code: string): Promise<boolean> {
  const existingGroup = await db.collection('groups').findOne({ groupCode: code });
  return !existingGroup;
}

// Generate a unique group code
async function generateUniqueGroupCode(db: Db): Promise<string> {
  let code = generateGroupCode();
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    if (await isGroupCodeUnique(db, code)) {
      return code;
    }
    code = generateGroupCode();
    attempts++;
  }
  
  // If we can't generate a unique code after 10 attempts, use timestamp
  return generateGroupCode() + Date.now().toString().slice(-3);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, tags, description, createdBy } = body;

    // Validate required fields
    if (!title || !subject || !createdBy) {
      return NextResponse.json(
        { success: false, message: 'Title, subject, and user ID are required' },
        { status: 400 }
      );
    }

    // Validate title and subject length
    if (title.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'Group title must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (subject.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Subject must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    
    // Generate unique group code
    const groupCode = await generateUniqueGroupCode(db);

    // Process tags - convert comma-separated string to array
    let tagsArray: string[] = [];
    if (tags && tags.trim()) {
      tagsArray = tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags
    }

    // Create the group document
    const groupDocument = {
      name: title.trim(),
      subject: subject.trim(),
      tags: tagsArray,
      description: description?.trim() || '',
      createdBy: createdBy,
      members: [createdBy], // Creator is automatically a member
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      groupCode: groupCode,
      isActive: true,
      memberCount: 1
    };

    // Insert the group into the database
    const result = await db.collection('groups').insertOne(groupDocument);

    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, message: 'Failed to create group' },
        { status: 500 }
      );
    }

    // Return success response with group ID
    return NextResponse.json({
      success: true,
      message: 'Group created successfully',
      groupId: result.insertedId.toString(),
      groupCode: groupCode,
      group: {
        _id: result.insertedId,
        name: groupDocument.name,
        subject: groupDocument.subject,
        description: groupDocument.description,
        groupCode: groupCode,
        createdAt: groupDocument.createdAt,
        memberCount: 1
      }
    });

  } catch (error) {
    console.error('Error creating group:', error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { success: false, message: 'A group with this name already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}