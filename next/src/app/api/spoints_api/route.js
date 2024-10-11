import dbConnect from '@/libs/mongodb';
import User from '@/libs/models/User';
import { NextResponse } from 'next/server';

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

  const { user_id, username, oauth_token, oauth_token_secret, referralCode, signInWithReferralCode } = await request.json();

  if (!user_id || !username || !oauth_token || !oauth_token_secret) {
    return NextResponse.json({ message: 'user_id, username, oauth_token, and oauth_token_secret are required' }, { status: 400 });
  }

  try {
    let user = await User.findOne({ user_id });

    if (user) {
      // User already exists
      if (signInWithReferralCode === 'true' && referralCode) {
        if (!user.referralCodeLogin) {
          // Find user with the given referralCode
          const referredUser = await User.findOne({ referral_code: referralCode });
          if (referredUser) {
            // Add points to the referred user
            referredUser.total_spoint += 500; // Adjust points as needed
            await referredUser.save();
          }

          // Update the current user's referralCodeLogin status
          user.referralCodeLogin = true;
          await user.save();
        } else {
          console.log('User has already logged in with a referral code.');
        }
      }

      return NextResponse.json({ message: 'User already exists', user }, { status: 200 });
    } else {
      // Create a new user
      const auth_sPoints = parseInt(process.env.AUTH_POINTS, 10);
      const newUser = new User({
        user_id,
        username,
        oauth_token,
        oauth_token_secret,
        auth_sPoints,
        total_spoint: auth_sPoints // Since like, retweet, and pin spoints are initially 0
      });

      // Generate and assign a unique referral code
      const referralCode = await generateUniqueReferralCode();
      newUser.referral_code = referralCode;

      // Set referralCodeLogin to true if signInWithReferralCode is true
      if (signInWithReferralCode === 'true') {
        newUser.referralCodeLogin = true;
      }

      await newUser.save();
      return NextResponse.json({ message: 'User created successfully', newUser }, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ message: 'Error saving user', error: error.message }, { status: 500 });
  }
}
