import { Request, Response } from 'express';
import { StatusCode } from '../utils/constant';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { User } from '../model/User';
import * as uuid from 'uuid';
import { sendEmail } from '../utils/email/sendEmail';
import { OAuth2Client } from 'google-auth-library';

const verifyGoogleToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (!token) {
      res.status(StatusCode.bad_request).json({
        error: 'Please provide token',
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload?.email;

    if (!userEmail) {
      return res
        .status(StatusCode.unauthorized)
        .json({ error: 'Email not found in token payload' });
    }

    const jwtFToken = jwt.sign(
      { email: userEmail },
            process.env.JWT_TOKEN!,
            {
              expiresIn: '2h',
            },
    );

    res.status(StatusCode.success).json({
      message: 'Verification successful',
      jwtToken: jwtFToken,
      success: true,
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(StatusCode.unauthorized).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

const resetUser = async (req: Request, res: Response) => {
  try {
    let user: any | null;

    const { otp, password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(StatusCode.unprocess)
        .json({ error: 'Passwords do not match' });
    }

    if (token) {
      if (!password || !confirmPassword) {
        return res
          .status(StatusCode.unprocess)
          .json({ error: 'Please provide password' });
      }

      user = await User.findOne({ token });

      if (!user) {
        return res
          .status(StatusCode.unprocess)
          .json({ error: 'Invalid token' });
      }
    } else if (otp) {
      if (!otp || !password || !confirmPassword) {
        return res
          .status(StatusCode.bad_request)
          .json({ error: 'Please provide password' });
      }

      user = await User.findOne({ resetPasswordToken: otp });

      if (!user || user.resetPasswordExpires < Date.now()) {
        return res
          .status(StatusCode.unprocess)
          .json({ error: 'Invalid or expired OTP' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.token = undefined;

    await user.save();

    res.status(StatusCode.success).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(StatusCode.internal_server).json({
      error: 'Failed to reset password',
    });
  }
};

const forgetUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCode.unprocess)
        .json({ error: 'User not found' });
    }

    const resetToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000); 

    await user.save();

    const token = uuid.v4();
    user.token = token;

    await user.save();

    const text = `You can use OTP to reset password :  <b>${resetToken}</b> or used link to reset password: <b>${process.env.BASE_URL}/reset-password/${token}</b>`;
    const params = {
      subject: 'Reset Password',
      text,
      email,
    };

    await sendEmail(params, res);
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(StatusCode.internal_server).json({
      error: 'Forgot password failed',
    });
  }
};

const validateEmail = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(StatusCode.unprocess)
        .json({ error: 'Verification is expired' });
    }

    const mfaSecret = speakeasy.generateSecret({
      length: 20,
      name: 'employee-manager',
    });

    user.isVerified = true;
    user.mfaSecret = mfaSecret.base32;

    const newUser = await user.save();

    const qrCode = await QRCode.toDataURL(mfaSecret?.otpauth_url || '');

    res.status(StatusCode.success).json({ newUser, qrCodeUrl: qrCode });
  } catch (error) {
    res.status(StatusCode.internal_server).json({
      error: 'Failed to create a new user',
    });
  }
};

const mfaVerifyUser = async (req: Request, res: Response) => {
  try {
    const { email, mfaToken } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCode.unauthorized)
        .json({ error: 'Invalid credentials' });
    }

    const userEmail = user.email; 

    const token = speakeasy.totp({
      secret: user.mfaSecret?.toString() ?? '', 
      encoding: 'base32',
    });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret?.toString() ?? '',  
      encoding: 'base32',
      token: mfaToken,
    });

    if (verified) {
      const jwtFToken = jwt.sign(
        { email: userEmail },
                process.env.JWT_TOKEN! || '',  
                {
                  expiresIn: '2h',
                },
      );

      res.json({
        message: 'Verification successful',
        jwtToken: jwtFToken,
      });
    } else {
      res.status(StatusCode.unauthorized).json({
        error: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(StatusCode.internal_server).json({
      error: 'Verification failed',
    });
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, country } = req.body;
    if (!email || !name || !password || !country) {
      return res.status(422).json({
        error: 'Please provide all the details to register a user',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: 'Email is already in use.' });
    }
    const mfaSecret = speakeasy.generateSecret({
      length: 20,
      name: 'employee-manager',
    });
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      mfaSecret: mfaSecret.base32,
    });
    await newUser.save();

    let qrCode: string | undefined;

    if (mfaSecret.otpauth_url) {
      qrCode = await QRCode.toDataURL(mfaSecret.otpauth_url);
    } else {
      console.error('Error generating QR code: otpauth_url is undefined.');
    }

    res.status(200).json({ newUser, qrCodeUrl: qrCode });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to create a new user' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCode.unauthorized)
        .json({ error: 'Invalid credentials' });
    }

    if (!user.password) {
      return res
        .status(StatusCode.internal_server)
        .json({ error: 'User password is undefined' });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      res.json({
        message: 'Login successful',
        qrCodeUrl: user.qrCodeUrl,
      });
    } else {
      res.status(StatusCode.unauthorized).json({
        error: 'Invalid credentials',
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(StatusCode.internal_server).json({ error: 'Login failed' });
  }
};

export {
  verifyGoogleToken,
  resetUser,
  forgetUser,
  validateEmail,
  mfaVerifyUser,
  registerUser,
  loginUser,
};
