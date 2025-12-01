import React, { useState, useRef } from 'react';

interface LoginFormProps {
  onLogin: (username: string, isAdmin: boolean) => void;
  onRegisterClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegisterClick }) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    console.log("Submitting login with:", { username, password });
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.username, data.isAdmin);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 border-b border-[#111111] bg-black">

      <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
        <div className="flex items-center gap-2">
          <label className="text-[#cccccc]">Login Name</label>
          <input
            type="text"
            ref={usernameRef}
            className="retro-input w-32 px-1 h-5 rounded-sm"
            autoComplete="off"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[#cccccc]">Password</label>
          <input
            type="password"
            ref={passwordRef}
            className="retro-input w-32 px-1 h-5 rounded-sm"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="retro-btn px-3 h-5 leading-none rounded-sm font-bold ml-1"
          >
            Login
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

      <div className="flex gap-4 mt-2 text-[10px]">
        <a href="#" className="text-[#666666] hover:text-[#999999]">
          Forgot your password?
        </a>
        <span className="text-[#333]">|</span>
        <button onClick={onRegisterClick} className="text-[#00aaff] hover:text-[#00ccff] font-bold">
          Register New Pilot
        </button>
      </div>
    </div>
  );
};