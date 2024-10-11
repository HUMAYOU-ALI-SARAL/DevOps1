// src/pages/api/email_spoints_api.js
import dbConnect from '@/libs/mongodb';
import User from '@/libs/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ message: 'user_id is required' }, { status: 400 });
  }

  try {
    // Find the user
    let user = await User.findOne({ user_id });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // const emailPoints = 500;
    const claim_sPoints = parseInt(process.env.WEBSITE_POINTS || '500', 10);

    // Check if website_spoints already have 500 points
    if (user.website_spoints === claim_sPoints) {
      return NextResponse.json({ message: 'You have already claimed these sPoints', user }, { status: 200 });
    }

    // If website_spoints is zero, add 500 points to both website_spoints and total_spoint
    if (user.website_spoints === 0) {
      user.website_spoints = claim_sPoints;
      user.total_spoint += claim_sPoints;

      await user.save();
      return NextResponse.json({ message: 'Email points added successfully', user }, { status: 200 });
    }

    // If website_spoints already have some points but less than 500
    return NextResponse.json({ message: 'You have already claimed part of these points', user }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating website points:', error);
    return NextResponse.json({ message: 'Error updating email points', error: error.message }, { status: 500 });
  }
}
