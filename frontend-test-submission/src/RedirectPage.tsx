import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Log } from './logger';

export default function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(shortcode || '');
    if (!stored) {
      alert("Short URL not found!");
      Log("frontend", "error", "page", "Short URL not found");
      navigate('/');
      return;
    }

    const { originalUrl, expiry } = JSON.parse(stored);
    if (Date.now() > expiry) {
      alert("This URL has expired.");
      Log("frontend", "warn", "page", "Short URL expired");
      navigate('/');
      return;
    }

    Log("frontend", "info", "page", `Redirecting to ${originalUrl}`);
    window.location.href = originalUrl;
  }, [shortcode]);

  return <p>Redirecting...</p>;
}