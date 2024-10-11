// src/pages/api/email_spoints_api.js
import dbConnect from '@/libs/mongodb';
import User from '@/libs/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const { user_id, email } = await request.json();

  if (!user_id) {
    return NextResponse.json({ message: 'user_id is required' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ message: 'email is required' }, { status: 400 });
  }

  try {
    // Find the user by user_id
    let user = await User.findOne({ user_id });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Define the email points value (with fallback)
    const claim_sPoints = parseInt(process.env.EMAIL_POINTS || '500', 10);

    // Check if email_spoints already have 500 points
    if (user.email_spoints === claim_sPoints) {
      return NextResponse.json({ message: 'You have already claimed these sPoints', user }, { status: 200 });
    }

    // Update the email if not already set or needs updating
    if (!user.email || user.email !== email) {
      user.email = email;
    }

    // If email_spoints is zero, add 500 points to both email_spoints and total_spoint
    if (user.email_spoints === 0) {
      user.email_spoints = claim_sPoints;
      user.total_spoint += claim_sPoints;

      await user.save();
      return NextResponse.json({ message: 'Email points added successfully and email updated', user }, { status: 200 });
    }

    // If email_spoints already have some points but less than 500
    return NextResponse.json({ message: 'You have already claimed part of these points', user }, { status: 200 });

  } catch (error) {
    console.error('Error updating email points:', error);
    return NextResponse.json({ message: 'Error updating email points', error: error.message }, { status: 500 });
  }
}
