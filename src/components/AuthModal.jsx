/**
 * MedSafe Authentication & Add User Modal
 * Popup overlay for quickly signing in, registering a new user with email,
 * or switching profiles from anywhere in the app.
 */

import React from "react";
import { useMedSafe } from "../context/MedSafeContext";
import LoginPage from "./LoginPage";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useMedSafe();

  if (!isAuthModalOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAuthModalOpen(false);
        }
      }}
    >
      <div style={{ width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
        <LoginPage isModal={true} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
}
