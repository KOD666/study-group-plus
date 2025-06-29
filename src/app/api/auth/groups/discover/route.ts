import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db } from 'mongodb';

// Define proper type for MongoDB filter
interface GroupFilter {
  isActive: boolean;
  $or?: Array<{
    name?: { $regex: RegExp };
    subject?: { $regex: RegExp };
    description?: { $regex: RegExp };
    tags?: { $in: RegExp[] };
  }>;
  subject?: string;
}

export async function GET(request: NextRequest) {
  try {
    const db: Db = await getDatabase();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build the query filter with proper typing
    const filter: GroupFilter = {
      isActive: true // Only show active groups
    };

    // Add search filter if provided
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: { $regex: searchRegex } },
        { subject: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Add subject filter if provided
    if (subject && subject.trim()) {
      filter.subject = subject.trim();
    }

    // Fetch groups from database with pagination
    const groups = await db
      .collection('groups')
      .find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(Math.min(limit, 100)) // Cap limit at 100
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('groups').countDocuments(filter);

    // Transform groups to match expected interface
    const transformedGroups = groups.map(group => ({
      _id: group._id.toString(),
      name: group.name,
      subject: group.subject,
      description: group.description || '',
      tags: group.tags || [],
      members: group.members || [],
      createdBy: group.createdBy,
      createdAt: group.createdAt,
      groupCode: group.groupCode,
      memberCount: group.members ? group.members.length : 1,
      isActive: group.isActive
    }));

    return NextResponse.json({
      success: true,
      groups: transformedGroups,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: (skip + limit) < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching groups for discovery:', error);
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