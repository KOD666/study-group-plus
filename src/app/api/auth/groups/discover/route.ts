import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db } from 'mongodb';

interface StudyGroup {
  _id: string;
  name: string;
  subject: string;
  description: string;
  tags: string[];
  createdBy: string;
  members: string[];
  createdAt: string;
  groupCode: string;
  memberCount: number;
  isActive: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const db: Db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const groups = await db
      .collection('groups')
      .find({
        $and: [
          { isActive: true }, // Only active groups
          {
            $or: [
              { createdBy: userId },
              { members: { $in: [userId] } }
            ]
          }
        ]
      })
      .sort({ createdAt: -1 }) 
      .toArray();

    const transformedGroups: StudyGroup[] = groups.map(group => ({
      _id: group._id.toString(),
      name: group.name,
      subject: group.subject,
      description: group.description || '',
      tags: group.tags || [],
      createdBy: group.createdBy,
      members: group.members || [],
      createdAt: group.createdAt,
      groupCode: group.groupCode,
      memberCount: group.members ? group.members.length : 1,
      isActive: group.isActive
    }));

    return NextResponse.json({
      success: true,
      groups: transformedGroups
    });

  } catch (error) {
    console.error('Error fetching user groups:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function POST() {
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