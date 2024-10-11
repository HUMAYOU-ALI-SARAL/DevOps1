// src/pages/api/like_api.js
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

    const likePoints = parseInt(process.env.TWITTER_LIKE_POINTS, 10);

    // Check if the like points have already been added
    if (user.like_spoints === likePoints) {
      return NextResponse.json({ message: 'Like points already added', user }, { status: 200 });
    }

    // Update the user's like points
    user.like_spoints = likePoints;
    user.total_spoint += likePoints;

    await user.save();
    return NextResponse.json({ message: 'Like points added successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating like points:', error);
    return NextResponse.json({ message: 'Error updating like points', error: error.message }, { status: 500 });
  }
}
