/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

function AccountToggle() {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex p-0.5 hover:bg-slate-200 rounded-transition-colors relative gap-2 w-full items-center">
        <img
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=Oliver"
          alt="avatar"
          className="size-8 rounded srhink-0 bg-violet-300 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">Vivoid Admin</span>
          <span className="text-xs block text-stone-500">admin@vivoid.dev</span>
        </div>

        <FiChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%+4px)] text-xs" />
        <FiChevronUp className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] text-xs" />
      </button>
    </div>
  );
}

export default AccountToggle;
