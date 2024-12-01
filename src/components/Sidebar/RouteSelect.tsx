'use client';

import React, { SetStateAction, Dispatch } from 'react';
import { IconType } from 'react-icons';
import {
  MdDashboard,
  MdFolderSpecial,
  MdSupervisorAccount,
} from 'react-icons/md';
import { GiRainbowStar } from 'react-icons/gi';
import { PiFilmReelFill } from 'react-icons/pi';

import { useRouter } from 'next/navigation'; // Import useRouter
// import { DashboardIcon } from '../svgs';

export const RouteSelect = ({
  selectedRoute,
  setSelectedRoute,
}: {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
}) => {
  const router = useRouter(); // Khởi tạo router

  const handleRouteChange = (path: string) => {
    setSelectedRoute(path); // Cập nhật selectedRoute
    router.push(path); // Chuyển hướng đến đường dẫn đã cho
  };

  return (
    <div className="space-y-1">
      <Route
        Icon={MdDashboard}
        selected={selectedRoute === '/pages/dashboard'}
        title="Dashboard"
        onClick={() => handleRouteChange('/pages/dashboard')}
      />
      <Route
        Icon={GiRainbowStar}
        selected={selectedRoute === '/pages/subscriptions'}
        title="Quản lý gói"
        onClick={() => handleRouteChange('/pages/subscriptions')}
      />
      <Route
        Icon={PiFilmReelFill}
        selected={selectedRoute === '/pages/manage-movies'}
        title="Quản lý phim"
        onClick={() => handleRouteChange('/pages/manage-movies')}
      />
      <Route
        Icon={MdFolderSpecial}
        selected={selectedRoute === '/pages/manage-topics'}
        title="Quản lý chủ đề"
        onClick={() => handleRouteChange('/pages/manage-topics')}
      />
      <Route
        Icon={MdSupervisorAccount}
        selected={selectedRoute === '/pages/manage-accounts'}
        title="Quản lý tài khoản"
        onClick={() => handleRouteChange('/pages/manage-accounts')}
      />
    </div>
  );
};

const Route = ({
  selected,
  Icon,
  title,
  onClick, // Thêm prop onClick
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
  onClick: () => void; // Định nghĩa kiểu cho onClick
}) => {
  return (
    <button
      onClick={onClick} // Gọi hàm onClick khi nhấn nút
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? 'bg-white text-red-600 shadow'
          : 'hover:bg-stone-200 bg-transparent text-stone-500 shadow-none'
      }`}
    >
      <Icon className={selected ? 'text-red-600' : ''} />
      <span>{title}</span>
    </button>
  );
};
