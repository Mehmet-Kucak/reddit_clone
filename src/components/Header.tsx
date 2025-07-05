"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <header className="w-screen h-[60px] bg-dark_primary flex items-center justify-between px-4 gap-x-40">
      <Image
        src="/Icons/Reddit_Lockup_OnDark.svg"
        alt="Reddit Logo"
        width={120}
        height={1000}
        className="h-6/10"
      />
      <div className="h-6/10 max-w-200 flex-grow bg-dark_secondary rounded-4xl flex items-center px-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e3e3e3"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
      </div>
      <button className="h-6/10 w-18 rounded-4xl bg-orange text-light text-sm">
        Log In
      </button>
    </header>
  );
}
