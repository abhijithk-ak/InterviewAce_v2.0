import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { UserProfileModel, type IUserProfile } from "@/lib/db/models/UserProfile"
import { validateOnboardingPayload } from "@/lib/onboarding/validators"

/**
 * Onboarding API Route
 * Single source of truth for user profiles
 * Enforces one-time onboarding with MongoDB persistence
 */

/**
 * GET /api/onboarding
 * Fetch user profile or detect new user
 */
export async function GET() {
  try {
    // Authenticate user
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Connect to database
    await connectDB()

    // Fetch user profile by email (userId)
    const profile = await UserProfileModel.findOne({
      userId: session.user.email,
    }).exec()

    // New user - onboarding required
    if (!profile) {
      return NextResponse.json({
        onboardingCompleted: false,
        isNewUser: true,
      })
    }

    // Return existing profile
    return NextResponse.json({
      onboardingCompleted: profile.onboardingCompleted,
      isNewUser: false,
      profile: {
        userId: profile.userId,
        experienceLevel: profile.experienceLevel,
        domains: profile.domains,
        interviewGoals: profile.interviewGoals,
        confidenceLevel: profile.confidenceLevel,
        weakAreas: profile.weakAreas,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    })
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/onboarding
 * Create user profile (one-time only)
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
    const validatedPayload = validateOnboardingPayload(body)

    // Connect to database
    await connectDB()

    // Check if user already completed onboarding
    const existingProfile = await UserProfileModel.findOne({
      userId: session.user.email,
    }).exec()

    if (existingProfile?.onboardingCompleted) {
      return NextResponse.json(
        {
          error: "Onboarding already completed",
          message: "Profile cannot be modified after initial setup",
        },
        { status: 409 }
      )
    }

    // Create or update profile data
    const profileData: Partial<IUserProfile> = {
      userId: session.user.email,
      experienceLevel: validatedPayload.experienceLevel as IUserProfile["experienceLevel"],
      domains: validatedPayload.domains as IUserProfile["domains"],
      interviewGoals: validatedPayload.interviewGoals as IUserProfile["interviewGoals"],
      confidenceLevel: validatedPayload.confidenceLevel,
      weakAreas: (validatedPayload.weakAreas || []) as IUserProfile["weakAreas"],
      onboardingCompleted: true,
      updatedAt: new Date(),
    }

    let profile: IUserProfile

    if (existingProfile) {
      // Update incomplete profile
      Object.assign(existingProfile, profileData)
      profile = await existingProfile.save()
    } else {
      // Create new profile
      profile = await UserProfileModel.create({
        ...profileData,
        createdAt: new Date(),
      })
    }

    // Return success with created profile
    return NextResponse.json(
      {
        success: true,
        message: "Onboarding completed successfully",
        profile: {
          userId: profile.userId,
          experienceLevel: profile.experienceLevel,
          domains: profile.domains,
          interviewGoals: profile.interviewGoals,
          confidenceLevel: profile.confidenceLevel,
          weakAreas: profile.weakAreas,
          onboardingCompleted: profile.onboardingCompleted,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create user profile:", error)

    // Handle validation errors
    if (error instanceof Error && error.message.includes("Validation failed")) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: error.message,
        },
        { status: 400 }
      )
    }

    // Handle duplicate key errors
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          error: "Profile already exists",
          message: "User profile cannot be created multiple times",
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/onboarding
 * Future: Update profile settings (not during onboarding)
 */
export async function PUT() {
  return NextResponse.json(
    {
      error: "Profile updates not implemented",
      message: "Use settings page for profile modifications",
    },
    { status: 501 }
  )
}

/**
 * DELETE /api/onboarding
 * Future: Reset profile (admin only)
 */
export async function DELETE() {
  return NextResponse.json(
    {
      error: "Profile deletion not implemented",
      message: "Contact administrator for profile reset",
    },
    { status: 501 }
  )
}