import React from 'react';

interface LoginFormProps {
  onLogin?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 border-b border-[#111111] bg-black">
      <form className="flex flex-col md:flex-row items-center gap-2 mb-1" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <label className="text-[#cccccc]">Login Name</label>
          <input type="text" className="retro-input w-32 px-1 h-5 rounded-sm" />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-[#cccccc]">Password</label>
          <input type="password" className="retro-input w-32 px-1 h-5 rounded-sm" />
        </div>

        <button type="submit" className="retro-btn px-3 h-5 leading-none rounded-sm font-bold ml-1">
          Login
        </button>
      </form>
      <a href="#" className="text-[#666666] hover:text-[#999999] text-[10px] mt-1">
        Forgot your password?
      </a>
    </div>
  );
};