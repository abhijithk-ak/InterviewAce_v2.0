import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { NoteModel, type INote } from "@/lib/db/models/Note"
import { z } from "zod"

/**
 * Notes API Route
 * Full CRUD operations for user notes
 */

// Validation schemas
const CreateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
  category: z.enum(["general", "algorithm", "system-design", "behavioral", "interview-prep"]).optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
})

const UpdateNoteSchema = CreateNoteSchema.partial()

/**
 * GET /api/notes
 * Fetch all notes for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")

    // Connect to database
    await connectDB()

    // Build query
    const query: any = { userId: session.user.email }
    
    if (category && category !== "all") {
      query.category = category
    }
    
    if (tag) {
      query.tags = { $in: [tag] }
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ]
    }

    // Fetch notes
    const notes = await NoteModel.find(query)
      .sort({ updatedAt: -1 })
      .limit(100)
      .exec()

    return NextResponse.json({
      notes: notes.map(note => ({
        _id: note._id.toString(),
        userId: note.userId,
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }))
    })
  } catch (error) {
    console.error("Failed to fetch notes:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/notes
 * Create a new note
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Parse and validate payload
    const body = await request.json()
    const validatedData = CreateNoteSchema.parse(body)

    // Connect to database
    await connectDB()

    // Create note
    const note = await NoteModel.create({
      userId: session.user.email,
      title: validatedData.title,
      content: validatedData.content,
      category: validatedData.category || "general",
      tags: validatedData.tags || [],
    })

    return NextResponse.json(
      {
        note: {
          _id: note._id.toString(),
          userId: note.userId,
          title: note.title,
          content: note.content,
          category: note.category,
          tags: note.tags,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create note:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map(err => `${err.path.join(".")}: ${err.message}`)
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/notes/{id}
 * Update an existing note
 */
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Extract note ID from URL
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get("id")
    
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      )
    }

    // Parse and validate payload
    const body = await request.json()
    const validatedData = UpdateNoteSchema.parse(body)

    // Connect to database
    await connectDB()

    // Update note (only if owned by user)
    const note = await NoteModel.findOneAndUpdate(
      { _id: noteId, userId: session.user.email },
      { 
        ...validatedData,
        updatedAt: new Date() 
      },
      { new: true }
    ).exec()

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or not authorized" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      note: {
        _id: note._id.toString(),
        userId: note.userId,
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }
    })
  } catch (error) {
    console.error("Failed to update note:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map(err => `${err.path.join(".")}: ${err.message}`)
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/notes/{id}
 * Delete a note
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Extract note ID from URL
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get("id")
    
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Delete note (only if owned by user)
    const note = await NoteModel.findOneAndDelete({
      _id: noteId,
      userId: session.user.email
    }).exec()

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or not authorized" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Note deleted successfully",
      noteId: noteId
    })
  } catch (error) {
    console.error("Failed to delete note:", error)
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    )
  }
}