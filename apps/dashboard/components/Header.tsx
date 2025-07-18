
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Telegram Bot Dashboard
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
