// src/pages/api/retweet_api.js
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

    const retweetPoints = parseInt(process.env.TWITTER_RETWEET_POINTS, 10);

    // Check if the retweet points have already been added
    if (user.retweet_spoints === retweetPoints) {
      return NextResponse.json({ message: 'Retweet points already added', user }, { status: 200 });
    }

    // Update the user's retweet points
    user.retweet_spoints = retweetPoints;
    user.total_spoint += retweetPoints;

    await user.save();
    return NextResponse.json({ message: 'Retweet points added successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating retweet points:', error);
    return NextResponse.json({ message: 'Error updating retweet points', error: error.message }, { status: 500 });
  }
}
