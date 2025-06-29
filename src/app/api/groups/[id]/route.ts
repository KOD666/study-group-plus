import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';
import { Db, ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid group ID format' },
        { status: 400 }
      );
    }

    const db: Db = await getDatabase();
    const group = await db.collection('groups').findOne({ 
      _id: new ObjectId(id),
      isActive: true 
    });

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found or inactive' },
        { status: 404 }
      );
    }

    let createdByName = 'Unknown User';
    if (group.createdBy) {
      const creator = await db.collection('users').findOne({ 
        _id: new ObjectId(group.createdBy) 
      });
      if (creator) {
        createdByName = creator.name || creator.email || 'Unknown User';
      }
    }

    const memberDetails = [];
    if (group.members && group.members.length > 0) {
      try {
        const memberObjectIds = group.members
          .map((memberId: string) => {
            try {
              return new ObjectId(memberId);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        if (memberObjectIds.length > 0) {
          const members = await db.collection('users')
            .find({ _id: { $in: memberObjectIds } })
            .project({ name: 1, email: 1, createdAt: 1 })
            .toArray();

          memberDetails.push(...members.map(member => ({
            id: member._id.toString(),
            name: member.name || member.email || 'Unknown User',
            email: member.email || 'No email',
            joinedAt: member.createdAt || new Date().toISOString()
          })));
        }
      } catch (error) {
        console.error('Error fetching member details:', error);
      }
    }

    let notes = [];
    try {
      const notesCollection = db.collection('notes');
      const groupNotes = await notesCollection
        .find({ groupId: id })
        .sort({ uploadedAt: -1 })
        .toArray();

      notes = groupNotes.map(note => ({
        id: note._id.toString(),
        title: note.title || 'Untitled Note',
        content: note.content || '',
        uploadedBy: note.uploadedBy,
        uploadedByName: note.uploadedByName || 'Unknown User',
        uploadedAt: note.uploadedAt || new Date().toISOString(),
        fileType: note.fileType || 'text',
        fileName: note.fileName || 'note.txt'
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }

    const transformedGroup = {
      id: group._id.toString(),
      name: group.name,
      subject: group.subject,
      description: group.description || '',
      tags: group.tags || [],
      members: group.members || [],
      memberDetails: memberDetails,
      createdBy: group.createdBy,
      createdByName: createdByName,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      isActive: group.isActive,
      memberCount: (group.members || []).length,
      noteCount: notes.length,
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'Group retrieved successfully',
        data: transformedGroup 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving group:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}