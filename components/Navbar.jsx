import React from 'react';

const Navbar = () => {
  return (
    <>
      <nav className="w-full z-50 bg-white shadow-sm">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="text-red-500 font-bold text-xl">LOGO</div>
          <div className="flex gap-4 text-red-500">
            <a href="">I1</a>
            <a href="">I2</a>
            <a href="">I3</a>
          </div>
        </div>


      </nav>
        {/* Category Bar */}
        <div className="flex sticky top-0 justify-center gap-4 px-6 py-2 border-b border-gray-200 bg-white text-red-500">
          <a href="">C1</a>
          <a href="">C2</a>
          <a href="">C3</a>
          <a href="">C4</a>
          <a href="">C5</a>
          <a href="">C6</a>
          <a href="">C7</a>
          <a href="">C8</a>
          <a href="">C9</a>
        </div>
    </>
  );
};

export default Navbar;
