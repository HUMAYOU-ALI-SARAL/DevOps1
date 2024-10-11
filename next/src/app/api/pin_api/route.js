// src/pages/api/pin_api.js
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

    const pinPoints = parseInt(process.env.TWITTER_PIN_POINTS, 10);

    // Check if the pin points have already been added
    if (user.pin_spoints === pinPoints) {
      return NextResponse.json({ message: 'Pin points already added', user }, { status: 200 });
    }

    // Update the user's pin points
    user.pin_spoints = pinPoints;
    user.total_spoint += pinPoints;

    await user.save();
    return NextResponse.json({ message: 'Pin points added successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating pin points:', error);
    return NextResponse.json({ message: 'Error updating pin points', error: error.message }, { status: 500 });
  }
}
