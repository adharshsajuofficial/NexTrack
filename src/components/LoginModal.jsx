import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { X, Mail, Phone, Linkedin } from 'lucide-react';
import './LoginModal.css';

export function LoginModal({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      console.error("Google sign in error", error);
      alert(error.message);
    }
  };

  const handleLinkedInLogin = () => {
    alert("LinkedIn login requires a custom OpenID Connect setup in Firebase. Feature coming soon!");
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      // Phone number must include country code, e.g. +1...
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (error) {
      console.error("Phone sign in error", error);
      alert("Error sending SMS. Ensure number includes country code.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      await confirmationResult.confirm(verificationCode);
      onClose();
    } catch (error) {
      console.error("Code verification error", error);
      alert("Invalid code");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        <h2>Welcome to NexTrack</h2>
        <p>Sign in to personalize your dashboard and get alerts.</p>
        
        <div className="auth-buttons">
          <button className="btn-social google" onClick={handleGoogleLogin}>
            <Mail size={18} /> Continue with Google
          </button>
          <button className="btn-social linkedin" onClick={handleLinkedInLogin}>
            <Linkedin size={18} /> Continue with LinkedIn
          </button>
        </div>

        <div className="divider">
          <span>or use phone</span>
        </div>

        {!confirmationResult ? (
          <form className="phone-form" onSubmit={handlePhoneLogin}>
            <div className="input-group">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                placeholder="Phone number (e.g. 9876543210)" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" id="sign-in-button" className="btn-primary">Send OTP</button>
          </form>
        ) : (
          <form className="phone-form" onSubmit={handleVerifyCode}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Verify Code</button>
          </form>
        )}
        
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
