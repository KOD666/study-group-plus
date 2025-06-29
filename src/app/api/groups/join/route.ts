import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { groupCode, userId } = body;

    if (!groupCode || !userId) {
      return NextResponse.json(
        { success: false, message: 'Group code and user ID are required' },
        { status: 400 }
      );
    }

    if (typeof groupCode !== 'string' || groupCode.trim().length !== 6) {
      return NextResponse.json(
        { success: false, message: 'Invalid group code format' },
        { status: 400 }
      );
    }

    const db: Db = await getDatabase();
    
    const group = await db.collection('groups').findOne({ 
      groupCode: groupCode.trim().toUpperCase(),
      isActive: true 
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or inactive' },
        { status: 404 }
      );
    }

    if (group.members && group.members.includes(userId)) {
      return NextResponse.json(
        { success: false, message: 'You are already a member of this group' },
        { status: 409 }
      );
    }

    const result = await db.collection('groups').updateOne(
      { _id: group._id },
      { 
        $push: { members: userId },
        $set: { 
          updatedAt: new Date().toISOString(),
          memberCount: (group.members?.length || 0) + 1
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to join group' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the group',
      group: {
        _id: group._id.toString(),
        name: group.name,
        subject: group.subject,
        description: group.description,
        groupCode: group.groupCode,
        memberCount: (group.members?.length || 0) + 1
      }
    });

  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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