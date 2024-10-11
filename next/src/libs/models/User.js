// src/lib/models/User.js
import mongoose from 'mongoose';
import { type } from 'os';

const UserSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  user_id: { type: String, required: true },
  username: { type: String, required: true },
  oauth_token_secret: { type: String, required: true },
  oauth_token: { type: String, required: true },

  auth_sPoints: { type: Number, default: 0 },
  retweet_spoints: { type: Number, default: 0 },
  like_spoints: { type: Number, default: 0 },
  pin_spoints: { type: Number, default: 0 },
  referral_code: { type: String, required: false },
  email: { type: String, required: false },

  email_spoints: { type: Number, default: 0 },
  follow_spoints: { type: Number, default: 0 },
  website_spoints: { type: Number, default: 0 },
  t1_spoints: { type: Number, default: 0 },
  t2_spoints: { type: Number, default: 0 },
  t3_spoints: { type: Number, default: 0 },
  t4_spoints: { type: Number, default: 0 },
  referral_code_spoints: { type: Number, default: 0 },
  total_spoint: { type: Number, default: 0 },
  referralCodeLogin: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
