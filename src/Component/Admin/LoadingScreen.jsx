import React, { useState, useEffect } from "react";
import "./LoadingScreen.css";

const messages = [
  "Securing your financial data 🔐",
  "Counting those expenses…",
  "Your wallet is doing the math 💸",
  "Making your budget smarter…",
  "Finding your spending patterns…",
  "Almost ready…",
  "Preparing your financial glow-up ✨",
];

export default function LoadingScreen({ onDone }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Message rotator
    const messageInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 700);

    // Progress bar counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (prev < 70 ? 4 : prev < 90 ? 1.5 : 0.5);
      });
    }, 40);

    // Done callback after 2 seconds
    const doneTimeout = setTimeout(() => {
      if (onDone) onDone();
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(doneTimeout);
    };
  }, [onDone]);

  return (
    <div className="loading-screen-container d-flex flex-column align-items-center justify-content-center">
      {/* Brand Logo & Illustration */}
      <div className="position-relative mb-4">
        <div className="logo-card shadow-lg d-flex align-items-center justify-content-center">
          💳
        </div>
        <div className="orbit-badge shadow position-absolute d-flex align-items-center justify-content-center">
          🔐
        </div>
      </div>

      {/* App Branding */}
      <h1 className="fw-bold fs-3 text-gradient mb-1">CashMate</h1>
      <span className="badge rounded-pill bg-light text-secondary border px-3 py-2 mb-4">
        🔒 Secured · End-to-End Encrypted
      </span>

      {/* Rotating Status Message */}
      <div className="message-box mb-3 text-center">
        <p className="small text-muted fw-medium mb-0">
          {messages[msgIndex]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="progress progress-bar-wrapper mb-2">
        <div
          className="progress-bar progress-bar-gradient"
          role="progressbar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Percentage Counter */}
      <small className="font-monospace text-muted">
        {Math.round(progress)}%
      </small>
    </div>
  );
}