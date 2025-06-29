import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db, ObjectId } from 'mongodb';

interface GroupMember {
  _id: string;
  name: string;
  email: string;
  joinedAt?: string;
}

interface GroupNote {
  _id: string;
  title: string;
  uploadedBy: {
    name: string;
    email: string;
  };
  uploadedAt: string;
  fileUrl?: string;
}

interface GroupMessage {
  _id: string;
  message: string;
  sender: {
    name: string;
    email: string;
  };
  sentAt: string;
}

interface GroupDetails {
  _id: ObjectId;
  name: string;
  subject: string;
  description: string;
  tags: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
  groupCode: string;
  memberCount: number;
  isActive: boolean;
  notes: GroupNote[];
  messages: GroupMessage[];
}

interface UpdateGroupData {
  updatedAt: string;
  name?: string;
  subject?: string;
  description?: string;
  tags?: string[];
}

interface UpdateRequestBody {
  name?: string;
  subject?: string;
  description?: string;
  tags?: string;
  userId: string;
}

interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  createdAt: string;
}

interface GroupDocument {
  _id: ObjectId;
  name: string;
  subject: string;
  description: string;
  tags: string[];
  createdBy: string | ObjectId;
  members: (string | ObjectId)[];
  createdAt: string;
  updatedAt: string;
  groupCode: string;
  isActive: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('GET /api/auth/groups/[id] - ID received:', id);

    if (!id || typeof id !== 'string') {
      console.log('Invalid ID format:', id);
      return NextResponse.json(
        { success: false, message: 'Invalid group ID format' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id);
      return NextResponse.json(
        { success: false, message: 'Invalid group ID format' },
        { status: 400 }
      );
    }

    const db: Db = await getDatabase();

    const groupAggregation = await db.collection('groups').aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          isActive: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creatorDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'memberDetails'
        }
      },
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'groupId',
          as: 'notes'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'groupId',
          as: 'messages'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          subject: 1,
          description: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          groupCode: 1,
          memberCount: { $size: '$members' },
          isActive: 1,
          createdBy: {
            $let: {
              vars: { creator: { $arrayElemAt: ['$creatorDetails', 0] } },
              in: {
                _id: '$$creator._id',
                name: '$$creator.name',
                email: '$$creator.email'
              }
            }
          },
          members: {
            $map: {
              input: '$memberDetails',
              as: 'member',
              in: {
                _id: '$$member._id',
                name: '$$member.name',
                email: '$$member.email',
                joinedAt: '$$member.createdAt'
              }
            }
          },
          notes: {
            $map: {
              input: '$notes',
              as: 'note',
              in: {
                _id: '$$note._id',
                title: '$$note.title',
                uploadedBy: '$$note.uploadedBy',
                uploadedAt: '$$note.uploadedAt',
                fileUrl: '$$note.fileUrl'
              }
            }
          },
          messages: {
            $map: {
              input: {
                $sortArray: {
                  input: '$messages',
                  sortBy: { sentAt: 1 }
                }
              },
              as: 'message',
              in: {
                _id: '$$message._id',
                message: '$$message.message',
                sender: '$$message.sender',
                sentAt: '$$message.sentAt'
              }
            }
          }
        }
      }
    ]).toArray();

    if (!groupAggregation || groupAggregation.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Group not found or inactive' },
        { status: 404 }
      );
    }

    const group = groupAggregation[0] as GroupDetails;
    if (!group.members || group.members.length === 0) {
      const groupData = await db.collection('groups').findOne({
        _id: new ObjectId(id),
        isActive: true
      }) as GroupDocument | null;

      if (groupData && groupData.members && groupData.members.length > 0) {
        const memberIds = groupData.members.map((memberId: string | ObjectId) =>
          typeof memberId === 'string' ? new ObjectId(memberId) : memberId
        );

        const memberDetails = await db.collection('users')
          .find({ _id: { $in: memberIds } })
          .project({ _id: 1, name: 1, email: 1, createdAt: 1 })
          .toArray() as UserDocument[];

        group.members = memberDetails.map(member => ({
          _id: member._id.toString(),
          name: member.name,
          email: member.email,
          joinedAt: member.createdAt
        }));
      }
    }

    if (!group.createdBy || !group.createdBy.name) {
      const groupData = await db.collection('groups').findOne({
        _id: new ObjectId(id),
        isActive: true
      }) as GroupDocument | null;

      if (groupData && groupData.createdBy) {
        const creatorId = typeof groupData.createdBy === 'string'
          ? new ObjectId(groupData.createdBy)
          : groupData.createdBy;

        const creatorDetails = await db.collection('users')
          .findOne({ _id: creatorId }) as UserDocument | null;

        if (creatorDetails) {
          group.createdBy = {
            _id: creatorDetails._id.toString(),
            name: creatorDetails.name,
            email: creatorDetails.email
          };
        }
      }
    }

    if (!group.notes) group.notes = [];
    if (!group.messages) group.messages = [];

    const transformedGroup = {
      ...group,
      _id: group._id.toString(),
      createdBy: {
        ...group.createdBy,
        _id: group.createdBy._id.toString()
      },
      members: group.members.map((member: GroupMember) => ({
        ...member,
        _id: member._id.toString()
      })),
      notes: group.notes.map((note: GroupNote) => ({
        ...note,
        _id: note._id.toString()
      })),
      messages: group.messages.map((message: GroupMessage) => ({
        ...message,
        _id: message._id.toString()
      }))
    };

    return NextResponse.json({
      success: true,
      group: transformedGroup
    });

  } catch (error) {
    console.error('Error fetching group details:', error);

    if (error instanceof Error) {
      if (error.message.includes('invalid ObjectId')) {
        return NextResponse.json(
          { success: false, message: 'Invalid group ID format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as UpdateRequestBody;
    const { name, subject, description, tags, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid group ID format' },
        { status: 400 }
      );
    }

    const db: Db = await getDatabase();

    const group = await db.collection('groups').findOne({
      _id: new ObjectId(id),
      createdBy: userId,
      isActive: true
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or you are not authorized to edit it' },
        { status: 404 }
      );
    }

    const updateData: UpdateGroupData = {
      updatedAt: new Date().toISOString()
    };

    if (name && name.trim()) updateData.name = name.trim();
    if (subject && subject.trim()) updateData.subject = subject.trim();
    if (description !== undefined) updateData.description = description.trim();

    if (tags !== undefined) {
      let tagsArray: string[] = [];
      if (tags && tags.trim()) {
        tagsArray = tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
          .slice(0, 10);
      }
      updateData.tags = tagsArray;
    }

    const result = await db.collection('groups').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update group' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Group updated successfully'
    });

  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid group ID format' },
        { status: 400 }
      );
    }

    const db: Db = await getDatabase();

    const group = await db.collection('groups').findOne({
      _id: new ObjectId(id),
      createdBy: userId,
      isActive: true
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or you are not authorized to delete it' },
        { status: 404 }
      );
    }

    const result = await db.collection('groups').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete group' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Group deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Use POST /api/groups/[id]/messages for sending messages.' },
    { status: 405 }
  );
}