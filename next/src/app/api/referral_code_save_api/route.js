import dbConnect from '@/libs/mongodb';
import User from '@/libs/models/User';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Function to generate a unique referral code
const generateUniqueReferralCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 5; // Set the length to 5 characters
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

    const existingUser = await User.findOne({ referral_code: code });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
};

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

    // Generate a unique referral code
    const referralCode = await generateUniqueReferralCode();

    // Assign the referral code to the user
    user.referral_code = referralCode;
    await user.save();

    return NextResponse.json({ message: 'Referral code generated and assigned successfully', referralCode }, { status: 200 });
  } catch (error) {
    console.error('Error generating referral code:', error);
    return NextResponse.json({ message: 'Error generating referral code', error: error.message }, { status: 500 });
  }
}
