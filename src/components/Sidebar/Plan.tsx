import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Plan = () => {
  const { logout } = useAuth();
  return (
    <div className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Đăng xuất</p>
        </div>

        <button
          className="px-2 py-1.5 font-medium bg-red-700 hover:bg-red-800 transition-colors rounded text-white"
          onClick={() => logout()}
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};
