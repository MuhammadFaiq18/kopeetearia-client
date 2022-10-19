import React from "react";

function Header() {
  return (
    <>
      <div className="navbar bg-black">
        <div className="navbar-start">
          <img src="header-img.png" className="h-16" alt="" />
        </div>
      </div>

      <div className="w-full bg-blue-800">
        <marquee width="100%" direction="left" className="text-white">
        5% DISCOUNT ON ALL ESPRESSO BAR DRINKS!!! BUY NOW!
        </marquee>
      </div>
    </>
  );
}

export default Header;
