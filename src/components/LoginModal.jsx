import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { X, Mail, Phone } from 'lucide-react';
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


  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter exactly 10 digits for the mobile number.");
      return;
    }

    setupRecaptcha();
    // From the official documentation
    const appVerifier = window.recaptchaVerifier;
    const formattedPhone = `+91${phoneNumber}`;

    signInWithPhoneNumber(auth, formattedPhone, appVerifier)
      .then((confirmationResult) => {
        // Show the OTP input field now
        setConfirmationResult(confirmationResult);
      }).catch((error) => {
        console.error("SMS Error:", error.code);
        console.log(error); // Log full error
        // IMPORTANT: Reset reCAPTCHA so the user can try again
        if (window.recaptchaWidgetId !== undefined && window.grecaptcha) {
          window.grecaptcha.reset(window.recaptchaWidgetId);
        }
      });
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
          </div>

          <div className="divider">
            <span>or use phone</span>
          </div>

          {!confirmationResult ? (
            <form className="phone-form" onSubmit={handlePhoneLogin}>
              <div className="input-group">
                <Phone size={18} className="input-icon" />
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhoneNumber(val);
                  }}
                  required
                  pattern="\d{10}"
                  title="Please enter exactly 10 digits"
                  className="phone-input-with-prefix"
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
