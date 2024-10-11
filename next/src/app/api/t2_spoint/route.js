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
    const claim_sPoints = parseInt(process.env.T2_POINTS || '500', 10);


    // Check if t2_spoints already have 500 points
    if (user.t2_spoints === claim_sPoints) {
      return NextResponse.json({ message: 'You have already claimed these sPoints', user }, { status: 200 });
    }

    // If t2_spoints is zero, add 500 points to both t2_spoints and total_spoint
    if (user.t2_spoints === 0) {
      user.t2_spoints = claim_sPoints;
      user.total_spoint += claim_sPoints;

      await user.save();
      return NextResponse.json({ message: 'Email points added successfully', user }, { status: 200 });
    }

    // If t2_spoints already have some points but less than 500
    return NextResponse.json({ message: 'You have already claimed part of these points', user }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating t1 points:', error);
    return NextResponse.json({ message: 'Error updating email points', error: error.message }, { status: 500 });
  }
}
