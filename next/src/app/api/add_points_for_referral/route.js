// src/pages/api/add_points_for_referral.js
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
    let user = await User.findOne({ referral_code: referralCode });

    if (!user) {
      return NextResponse.json({ message: 'Referral code not found' }, { status: 404 });
    }

    // Add 500 points to the user's total_spoints
    user.total_spoint += 500;
    await user.save();

    return NextResponse.json({ message: '500 points added successfully', total_spoint: user.total_spoint }, { status: 200 });
  } catch (error) {
    console.error('Error adding points:', error);
    return NextResponse.json({ message: 'Error adding points', error: error.message }, { status: 500 });
  }
}
