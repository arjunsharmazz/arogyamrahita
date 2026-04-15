import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import styles from "../css/GuestSignupPrompt.module.css";

const PROMPT_INTERVAL_MS = 60 * 60 * 1000;
const NEXT_PROMPT_KEY = "guestSignupPromptNextAt";
const HAS_SEEN_PROMPT_KEY = "guestSignupPromptHasSeen";

const hiddenPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/payment",
];

function GuestSignupPrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const shouldHidePrompt = useMemo(() => {
    const pathname = location.pathname;
    return (
      hiddenPaths.includes(pathname) ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/delivery")
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (loading || isAuthenticated() || shouldHidePrompt) {
      setIsOpen(false);
      return undefined;
    }

    if (isOpen) {
      return undefined;
    }

    let timerId;

    const schedulePrompt = () => {
      const now = Date.now();
      const hasSeenPrompt = localStorage.getItem(HAS_SEEN_PROMPT_KEY) === "true";
      const storedNextPrompt = Number(localStorage.getItem(NEXT_PROMPT_KEY));

      if (!hasSeenPrompt) {
        setIsOpen(true);
        localStorage.setItem(HAS_SEEN_PROMPT_KEY, "true");
        localStorage.setItem(NEXT_PROMPT_KEY, String(now + PROMPT_INTERVAL_MS));
        return;
      }

      const nextPromptAt = Number.isFinite(storedNextPrompt) && storedNextPrompt > 0
        ? storedNextPrompt
        : now + PROMPT_INTERVAL_MS;

      if (!storedNextPrompt || storedNextPrompt <= 0) {
        localStorage.setItem(NEXT_PROMPT_KEY, String(nextPromptAt));
      }

      const delay = Math.max(nextPromptAt - now, 0);
      timerId = window.setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(NEXT_PROMPT_KEY, String(Date.now() + PROMPT_INTERVAL_MS));
      }, delay);
    };

    schedulePrompt();

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [isAuthenticated, isOpen, loading, shouldHidePrompt, location.pathname]);

  const closePrompt = () => {
    setIsOpen(false);
  };

  const handleSignup = () => {
    closePrompt();
    navigate("/signup", { state: { from: location.pathname } });
  };

  const handleLogin = () => {
    closePrompt();
    navigate("/login", { state: { from: location.pathname } });
  };

  if (!isOpen || loading || isAuthenticated() || shouldHidePrompt) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={closePrompt}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={closePrompt} aria-label="Close prompt">
          <FiX />
        </button>

        <p className={styles.eyebrow}>Shopping Access</p>
        <h2 className={styles.title}>Create your account for shopping</h2>
        <p className={styles.description}>
          Sign up ya login karke orders track karo, cart save rakho, aur shopping experience smooth banao.
        </p>

        <div className={styles.actionRow}>
          <button type="button" className={styles.primaryButton} onClick={handleSignup}>
            Create Account <FiArrowRight />
          </button>
          <button type="button" className={styles.secondaryButton} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuestSignupPrompt;