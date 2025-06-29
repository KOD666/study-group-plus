import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db, ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { success: false, message: 'Message and user ID are required' },
        { status: 400 }
      );
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { success: false, message: 'Message is too long (max 1000 characters)' },
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
      isActive: true,
      members: { $in: [userId] }
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or you are not a member' },
        { status: 404 }
      );
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const messageDocument = {
      groupId: new ObjectId(id),
      message: message.trim(),
      sender: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      sentAt: new Date().toISOString(),
      isDeleted: false
    };

    const result = await db.collection('messages').insertOne(messageDocument);

    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, message: 'Failed to send message' },
        { status: 500 }
      );
    }

    await db.collection('groups').updateOne(
      { _id: new ObjectId(id) },
      { $set: { updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertedId.toString()
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

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
      isActive: true,
      members: { $in: [userId] }
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or you are not a member' },
        { status: 404 }
      );
    }

    const skip = (page - 1) * limit;

    const messages = await db.collection('messages')
      .find({
        groupId: new ObjectId(id),
        isDeleted: false
      })
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalMessages = await db.collection('messages').countDocuments({
      groupId: new ObjectId(id),
      isDeleted: false
    });

    const transformedMessages = messages.reverse().map(msg => ({
      _id: msg._id.toString(),
      message: msg.message,
      sender: msg.sender,
      sentAt: msg.sentAt
    }));

    return NextResponse.json({
      success: true,
      messages: transformedMessages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore: skip + messages.length < totalMessages
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (!messageId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Message ID and user ID are required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id) || !ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const db: Db = await getDatabase();

    const group = await db.collection('groups').findOne({
      _id: new ObjectId(id),
      isActive: true,
      members: { $in: [userId] }
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or you are not a member' },
        { status: 404 }
      );
    }

    const message = await db.collection('messages').findOne({
      _id: new ObjectId(messageId),
      groupId: new ObjectId(id)
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    const canDelete = message.sender._id === userId || group.createdBy === userId;

    if (!canDelete) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to delete this message' },
        { status: 403 }
      );
    }

    const result = await db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      { 
        $set: { 
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
