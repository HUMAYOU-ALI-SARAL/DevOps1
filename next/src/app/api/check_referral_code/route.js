// src/pages/api/check_referral_code.js
import dbConnect from '@/libs/mongodb';
import User from '@/libs/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const { referralCode } = await request.json();

  if (!referralCode) {
    return NextResponse.json({ message: 'Referral code is required' }, { status: 400 });
  }

  try {
    // Find the user with the provided referral code
    const user = await User.findOne({ referral_code: referralCode });

    if (!user) {
      return NextResponse.json({ message: 'Referral code not found' }, { status: 404 });
    }

    // Generate a message with the username
    const message = `Referred by ${user.username}`;

    return NextResponse.json({ message, user }, { status: 200 });
  } catch (error) {
    console.error('Error checking referral code:', error);
    return NextResponse.json({ message: 'Error checking referral code', error: error.message }, { status: 500 });
  }
}
