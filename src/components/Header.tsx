"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { signOut } from "@/app/action";
import AuthMenu from "@/components/AuthMenu";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: {
    data: {
      username: string;
    } | null;
  };
}

export default function Header(user: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<{ value: string; focused: boolean }>({
    value: "",
    focused: false,
  });
  const [authType, setAuthType] = useState(0); //0: No menu, 1: Log in, 2: Sign Up
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="w-screen h-[60px] bg-light dark:bg-[#0e1113] border-b flex items-center justify-between px-6 gap-x-4">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="w-auto h-full"
        >
          {theme === "dark" ? (
            <RedditLockupOnDark className="hidden md:block h-10 w-auto" />
          ) : (
            <RedditLockup className="hidden md:block h-10 w-auto" />
          )}
          <RedditIcon className="block md:hidden h-10 w-auto" />
        </button>
        <SearchField
          search={search}
          setSearch={setSearch}
          theme={theme ?? "light"}
        />
        {user.user.data !== null ? (
          <div className="h-6/10 flex items-center gap-2">
            <button
              onClick={() => {
                router.push("/submit");
              }}
              className={`flex items-center ${
                theme === "dark" ? "text-white" : "text-dark"
              } text-xl leading-7 gap-[4px] py-2 px-2 rounded-4xl ${
                theme === "dark"
                  ? "hover:bg-dark_secondary"
                  : "hover:bg-light_primary"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={theme === "dark" ? "#e3e3e3" : "#434343"}
              >
                <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
              </svg>
              <span className="hidden md:inline">Create</span>
            </button>
            <button
              className={`md:hidden flex items-center ${
                theme === "dark" ? "text-white" : "text-dark"
              } text-xl leading-7 gap-[4px] py-2 px-2 rounded-4xl ${
                theme === "dark"
                  ? "hover:bg-dark_secondary"
                  : "hover:bg-light_primary"
              } mr-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={theme === "dark" ? "#e3e3e3" : "#434343"}
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            </button>
            <AvatarIcon
              theme={theme ?? "light"}
              setTheme={setTheme}
              user={user.user.data}
            />
          </div>
        ) : (
          <div className="h-6/10 flex items-center gap-1 -mr-6">
            <button
              onClick={() => {
                setAuthType(1);
              }}
              className="h-full w-18 rounded-4xl bg-orange text-light text-sm hover:brightness-80"
            >
              Log In
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center ${
                  theme === "dark" ? "text-white" : "text-dark"
                } text-xl leading-7 gap-[4px] py-2 px-2 rounded-4xl ${
                  theme === "dark"
                    ? "hover:bg-dark_secondary"
                    : "hover:bg-light_primary"
                } mr-2`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke={theme === "dark" ? "#e3e3e3" : "#434343"}
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[256px] mt-[10px]">
                <DropdownMenuLabel className="h-[48px] w-full px-[12px] flex items-center justify-between">
                  <div className="flex items-center gap-[4px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={theme === "dark" ? "#e3e3e3" : "#434343"}
                      className="h-[16px]"
                    >
                      <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
                    </svg>
                    Dark Mode
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>

      {authType !== 0 && (
        <div className="w-svw h-svh z-[1000] fixed top-0 left-0 bg-black/50 p-0 m-0">
          <div className="w-full h-full flex items-center justify-center ">
            <AuthMenu type={authType} setType={setAuthType} />
          </div>
        </div>
      )}
    </>
  );
}

function SearchField({
  search,
  theme,
  setSearch,
}: {
  search: { value: string; focused: boolean };
  theme: string;
  setSearch: React.Dispatch<
    React.SetStateAction<{ value: string; focused: boolean }>
  >;
}) {
  const searchField = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      onClick={() => searchField.current?.focus()}
      className={`
        h-7/10 max-w-[800px] flex-grow
        ${theme === "dark" ? "bg-dark_secondary" : "bg-[#e5ebee]"}
        ${
          search.focused
            ? theme === "dark"
              ? "brightness-125"
              : "brightness-[90%]"
            : ""
        }
        rounded-4xl
        items-center gap-[8px] px-[12px] hidden md:flex
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill={theme === "dark" ? "#e3e3e3" : "#434343"}
      >
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>

      <input
        ref={searchField}
        type="text"
        placeholder="Search"
        value={search.value}
        onFocus={() => setSearch((s) => ({ ...s, focused: true }))}
        onBlur={() => setSearch((s) => ({ ...s, focused: false }))}
        onChange={(e) => setSearch((s) => ({ ...s, value: e.target.value }))}
        className={`${
          theme === "dark" ? "text-light" : "text-dark"
        } leading-tight flex-grow m-0 pt-[4px] focus:outline-none`}
      />

      {search.value !== "" && (
        <button
          type="button"
          onClick={() => setSearch({ value: "", focused: false })}
          className="p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === "dark" ? "#e3e3e3" : "#434343"}
          >
            <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface AvatarIconProps {
  theme: string;
  setTheme: (theme: string) => void;
  user: {
    username: string;
  };
}

function AvatarIcon({ theme, setTheme, user }: AvatarIconProps) {
  const router = useRouter();

  async function signOutButton() {
    await signOut();
    await router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <Avatar className="w-[45px] h-[45px]">
          <AvatarImage src="" />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[256px] mt-[10px]">
        <DropdownMenuItem className="h-[48px] w-full py-[8px] px-[16px]">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p>View Profile</p>
            <p className="text-gray-500">u/{user.username}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="h-[48px] w-full px-[12px] flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={theme === "dark" ? "#e3e3e3" : "#434343"}
              className="h-[16px]"
            >
              <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
            </svg>
            Dark Mode
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </DropdownMenuLabel>
        <DropdownMenuItem className="h-[48px] w-full py-[8px] px-[16px] cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === "dark" ? "#e3e3e3" : "#434343"}
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={signOutButton}
          className="h-[48px] w-full py-[8px] px-[16px] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === "dark" ? "#e3e3e3" : "#434343"}
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
          </svg>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RedditIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient
          id="SVGID_1_"
          cx="981.0251"
          cy="1.811"
          r="127.45"
          fx="981.0251"
          fy="-7.319"
          gradientTransform="matrix(0.47 0 0 -0.41 -260.07 108.3)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FEFFFF" />
          <stop offset="0.4" stopColor="#FEFFFF" />
          <stop offset="0.51" stopColor="#F9FCFC" />
          <stop offset="0.62" stopColor="#EDF3F5" />
          <stop offset="0.7" stopColor="#DEE9EC" />
          <stop offset="0.72" stopColor="#D8E4E8" />
          <stop offset="0.76" stopColor="#CCD8DF" />
          <stop offset="0.8" stopColor="#C8D5DD" />
          <stop offset="0.83" stopColor="#CCD6DE" />
          <stop offset="0.85" stopColor="#D8DBE2" />
          <stop offset="0.88" stopColor="#EDE3E9" />
          <stop offset="0.9" stopColor="#FFEBEF" />
        </radialGradient>
        <radialGradient
          id="SVGID_2_"
          cx="672.2592"
          cy="1.811"
          r="127.45"
          fx="672.2592"
          fy="-7.319"
          gradientTransform="matrix(0.47 0 0 -0.41 -260.07 108.3)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FEFFFF" />
          <stop offset="0.4" stopColor="#FEFFFF" />
          <stop offset="0.51" stopColor="#F9FCFC" />
          <stop offset="0.62" stopColor="#EDF3F5" />
          <stop offset="0.7" stopColor="#DEE9EC" />
          <stop offset="0.72" stopColor="#D8E4E8" />
          <stop offset="0.76" stopColor="#CCD8DF" />
          <stop offset="0.8" stopColor="#C8D5DD" />
          <stop offset="0.83" stopColor="#CCD6DE" />
          <stop offset="0.85" stopColor="#D8DBE2" />
          <stop offset="0.88" stopColor="#EDE3E9" />
          <stop offset="0.9" stopColor="#FFEBEF" />
        </radialGradient>
        <radialGradient
          id="SVGID_3_"
          cx="830.6751"
          cy="-224.6845"
          r="384.44"
          gradientTransform="matrix(0.47 0 0 -0.33 -260.07 25.03)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FEFFFF" />
          <stop offset="0.4" stopColor="#FEFFFF" />
          <stop offset="0.51" stopColor="#F9FCFC" />
          <stop offset="0.62" stopColor="#EDF3F5" />
          <stop offset="0.7" stopColor="#DEE9EC" />
          <stop offset="0.72" stopColor="#D8E4E8" />
          <stop offset="0.76" stopColor="#CCD8DF" />
          <stop offset="0.8" stopColor="#C8D5DD" />
          <stop offset="0.83" stopColor="#CCD6DE" />
          <stop offset="0.85" stopColor="#D8DBE2" />
          <stop offset="0.88" stopColor="#EDE3E9" />
          <stop offset="0.9" stopColor="#FFEBEF" />
        </radialGradient>
        <radialGradient
          id="SVGID_4_"
          cx="-2957.2551"
          cy="173.4222"
          r="32.12"
          gradientTransform="matrix(-0.47 0 0 0.69 -1224.63 31.31)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF6600" />
          <stop offset="0.5" stopColor="#FF4500" />
          <stop offset="0.7" stopColor="#FC4301" />
          <stop offset="0.82" stopColor="#F43F07" />
          <stop offset="0.92" stopColor="#E53812" />
          <stop offset="1" stopColor="#D4301F" />
        </radialGradient>
        <radialGradient
          id="SVGID_5_"
          cx="745.2351"
          cy="173.4222"
          r="32.12"
          gradientTransform="matrix(0.47 0 0 0.69 -260.07 31.31)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF6600" />
          <stop offset="0.5" stopColor="#FF4500" />
          <stop offset="0.7" stopColor="#FC4301" />
          <stop offset="0.82" stopColor="#F43F07" />
          <stop offset="0.92" stopColor="#E53812" />
          <stop offset="1" stopColor="#D4301F" />
        </radialGradient>
        <radialGradient
          id="SVGID_6_"
          cx="826.4651"
          cy="-508.4764"
          r="113.26"
          gradientTransform="matrix(0.47 0 0 -0.31 -260.07 37.28)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#172E35" />
          <stop offset="0.29" stopColor="#0E1C21" />
          <stop offset="0.73" stopColor="#030708" />
          <stop offset="1" stopColor="#000000" />
        </radialGradient>
        <radialGradient
          id="SVGID_7_"
          cx="926.3451"
          cy="277.9019"
          r="99.42"
          gradientTransform="matrix(0.47 0 0 -0.47 -260.07 164.72)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FEFFFF" />
          <stop offset="0.4" stopColor="#FEFFFF" />
          <stop offset="0.51" stopColor="#F9FCFC" />
          <stop offset="0.62" stopColor="#EDF3F5" />
          <stop offset="0.7" stopColor="#DEE9EC" />
          <stop offset="0.72" stopColor="#D8E4E8" />
          <stop offset="0.76" stopColor="#CCD8DF" />
          <stop offset="0.8" stopColor="#C8D5DD" />
          <stop offset="0.83" stopColor="#CCD6DE" />
          <stop offset="0.85" stopColor="#D8DBE2" />
          <stop offset="0.88" stopColor="#EDE3E9" />
          <stop offset="0.9" stopColor="#FFEBEF" />
        </radialGradient>
        <radialGradient
          id="SVGID_8_"
          cx="884.9151"
          cy="177.5619"
          r="81.49"
          gradientTransform="matrix(0.47 0 0 -0.47 -260.07 168.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.48" stopColor="#7A9299" />
          <stop offset="0.67" stopColor="#172E35" />
          <stop offset="0.75" stopColor="#000000" />
          <stop offset="0.82" stopColor="#172E35" />
        </radialGradient>
      </defs>

      {/* Main background circle */}
      <path
        fill="#FF4500"
        d="M128,0L128,0C57.3,0,0,57.3,0,128l0,0c0,35.4,14.3,67.4,37.5,90.5l-24.4,24.4c-4.8,4.8-1.4,13.1,5.4,13.1H128l0,0c70.7,0,128-57.3,128-128l0,0C256,57.3,198.7,0,128,0z"
      />

      <g>
        {/* Eyes */}
        <circle fill="url(#SVGID_1_)" cx="200.6" cy="123.7" r="29.9" />
        <circle fill="url(#SVGID_2_)" cx="55.4" cy="123.7" r="29.9" />

        {/* Face/snout area */}
        <ellipse
          fill="url(#SVGID_3_)"
          cx="128.1"
          cy="149.3"
          rx="85.3"
          ry="64"
        />

        {/* Eye details */}
        <path
          fill="#842123"
          d="M102.8,143.1c-0.5,10.8-7.7,14.8-16.1,14.8s-14.8-5.6-14.3-16.4s7.7-18,16.1-18S103.3,132.3,102.8,143.1z"
        />
        <path
          fill="#842123"
          d="M183.6,141.5c0.5,10.8-5.9,16.4-14.3,16.4s-15.6-3.9-16.1-14.8c-0.5-10.8,5.9-19.6,14.3-19.6S183.1,130.6,183.6,141.5L183.6,141.5z"
        />

        {/* Pupils */}
        <path
          fill="url(#SVGID_4_)"
          d="M153.3,144.1c0.5,10.1,7.2,13.8,15,13.8s13.8-5.5,13.4-15.7c-0.5-10.1-7.2-16.8-15-16.8S152.8,133.9,153.3,144.1z"
        />
        <path
          fill="url(#SVGID_5_)"
          d="M102.8,144.1c-0.5,10.1-7.2,13.8-15,13.8s-13.8-5.5-13.3-15.7c0.5-10.1,7.2-16.8,15-16.8S103.3,133.9,102.8,144.1z"
        />

        {/* Mouth area */}
        <path
          fill="#BBCFDA"
          d="M128.1,165.1c-10.6,0-20.7,0.5-30.1,1.4c-1.6,0.2-2.6,1.8-2,3.2c5.2,12.3,17.6,21,32.1,21s26.8-8.6,32.1-21c0.6-1.5-0.4-3.1-2-3.2C148.8,165.6,138.7,165.1,128.1,165.1z"
        />
        <path
          fill="#FFFFFF"
          d="M128.1,167.5c-10.6,0-20.7,0.5-30,1.5c-1.6,0.2-2.6,1.8-2,3.3c5.2,12.5,17.6,21.3,32,21.3s26.8-8.8,32-21.3c0.6-1.5-0.4-3.1-2-3.3C148.7,168,138.6,167.5,128.1,167.5L128.1,167.5z"
        />
        <path
          fill="url(#SVGID_6_)"
          d="M128.1,166.2c-10.4,0-20.3,0.5-29.5,1.4c-1.6,0.2-2.6,1.8-2,3.2c5.2,12.3,17.3,21,31.5,21s26.3-8.6,31.5-21c0.6-1.5-0.4-3.1-2-3.2C148.4,166.8,138.5,166.2,128.1,166.2z"
        />

        {/* Antenna/head detail */}
        <circle fill="url(#SVGID_7_)" cx="174.8" cy="55.5" r="21.2" />
        <path
          fill="url(#SVGID_8_)"
          d="M127.8,88c-2.5,0-4.6-1.1-4.6-2.7c0-19,15.4-34.4,34.4-34.4c2.5,0,4.6,2.1,4.6,4.6s-2.1,4.6-4.6,4.6c-13.9,0-25.2,11.3-25.2,25.2C132.4,87,130.3,88,127.8,88z"
        />

        {/* Nose/mouth details */}
        <path
          fill="#FF6101"
          d="M97.3,149.1c0,3.9-4.2,5.7-9.3,5.7s-9.3-1.8-9.3-5.7s4.2-7.1,9.3-7.1S97.3,145.1,97.3,149.1z"
        />
        <path
          fill="#FF6101"
          d="M177.5,149.1c0,3.9-4.2,5.7-9.3,5.7s-9.3-1.8-9.3-5.7s4.2-7.1,9.3-7.1S177.5,145.1,177.5,149.1z"
        />

        {/* Cheek highlights */}
        <ellipse fill="#FFC49C" cx="94.4" cy="134.8" rx="3.3" ry="3.6" />
        <ellipse fill="#FFC49C" cx="173.3" cy="134.8" rx="3.3" ry="3.6" />
      </g>
    </svg>
  );
}

function RedditLockupOnDark({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 774 216"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient
          id="radial-gradient-dark"
          cx="370.49"
          cy="151.59"
          fx="370.49"
          fy="142.47"
          r="127.45"
          gradientTransform="translate(0 19.13) scale(1 .87)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#feffff" />
          <stop offset=".4" stopColor="#feffff" />
          <stop offset=".51" stopColor="#f9fcfc" />
          <stop offset=".62" stopColor="#edf3f5" />
          <stop offset=".7" stopColor="#dee9ec" />
          <stop offset=".72" stopColor="#d8e4e8" />
          <stop offset=".76" stopColor="#ccd8df" />
          <stop offset=".8" stopColor="#c8d5dd" />
          <stop offset=".83" stopColor="#ccd6de" />
          <stop offset=".85" stopColor="#d8dbe2" />
          <stop offset=".88" stopColor="#ede3e9" />
          <stop offset=".9" stopColor="#ffebef" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-2-dark"
          cx="64.38"
          fx="64.38"
          fy="142.47"
          r="127.45"
          xlinkHref="#radial-gradient-dark"
        />
        <radialGradient
          id="radial-gradient-3-dark"
          cx="220.14"
          cy="135.08"
          fx="220.14"
          fy="135.08"
          r="384.44"
          gradientTransform="translate(0 40.35) scale(1 .7)"
          xlinkHref="#radial-gradient-dark"
        />
        <radialGradient
          id="radial-gradient-4-dark"
          cx="134.7"
          cy="240.48"
          fx="134.7"
          fy="240.48"
          r="32.12"
          gradientTransform="translate(0 -110.04) scale(1 1.46)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f60" />
          <stop offset=".5" stopColor="#ff4500" />
          <stop offset=".7" stopColor="#fc4301" />
          <stop offset=".82" stopColor="#f43f07" />
          <stop offset=".92" stopColor="#e53812" />
          <stop offset="1" stopColor="#d4301f" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-5-dark"
          cx="6191.5"
          cy="240.48"
          fx="6191.5"
          fy="240.48"
          r="32.12"
          gradientTransform="translate(6489.32 -110.04) rotate(-180) scale(1 -1.46)"
          xlinkHref="#radial-gradient-4-dark"
        />
        <radialGradient
          id="radial-gradient-6-dark"
          cx="215.93"
          cy="338.52"
          fx="215.93"
          fy="338.52"
          r="113.26"
          gradientTransform="translate(0 116.39) scale(1 .66)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#172e35" />
          <stop offset=".29" stopColor="#0e1c21" />
          <stop offset=".73" stopColor="#030708" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-7-dark"
          cx="315.81"
          cy="3.47"
          fx="315.81"
          fy="3.47"
          r="99.42"
          gradientTransform="translate(0 .06) scale(1 .98)"
          xlinkHref="#radial-gradient-dark"
        />
        <radialGradient
          id="radial-gradient-8-dark"
          cx="274.38"
          cy="103.82"
          fx="274.38"
          fy="103.82"
          r="81.49"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".48" stopColor="#7a9299" />
          <stop offset=".67" stopColor="#172e35" />
          <stop offset=".75" stopColor="#000" />
          <stop offset=".82" stopColor="#172e35" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <path
        fill="#ff4500"
        d="m108,0h0C48.35,0,0,48.35,0,108h0c0,29.82,12.09,56.82,31.63,76.37l-20.57,20.57c-4.08,4.08-1.19,11.06,4.58,11.06h92.36s0,0,0,0c59.65,0,108-48.35,108-108h0C216,48.35,167.65,0,108,0Z"
      />

      {/* Snoo mascot */}
      <g transform="translate(21.56 31.55) scale(.4)">
        <circle
          fill="url(#radial-gradient-dark)"
          cx="369.16"
          cy="188.55"
          r="63.05"
        />
        <circle
          fill="url(#radial-gradient-2-dark)"
          cx="63.05"
          cy="188.55"
          r="63.05"
        />
        <ellipse
          fill="url(#radial-gradient-3-dark)"
          cx="216.26"
          cy="242.72"
          rx="180"
          ry="135"
        />

        <g>
          <path
            fill="#842123"
            d="m163.04,229.59c-1.05,22.87-16.23,31.17-33.91,31.17s-31.15-11.71-30.09-34.58c1.05-22.87,16.23-38.01,33.91-38.01s31.15,18.54,30.09,41.42Z"
          />
          <path
            fill="#842123"
            d="m333.48,226.18c1.05,22.87-12.42,34.58-30.09,34.58s-32.85-8.3-33.91-31.17c-1.05-22.87,12.42-41.42,30.09-41.42s32.85,15.13,33.91,38.01Z"
          />
        </g>

        <path
          fill="url(#radial-gradient-4-dark)"
          d="m163.05,231.59c-.99,21.41-15.19,29.17-31.73,29.17s-29.15-11.63-28.16-33.03c.99-21.41,15.19-35.41,31.73-35.41s29.15,17.86,28.16,39.27Z"
        />
        <path
          fill="url(#radial-gradient-5-dark)"
          d="m269.47,231.59c.99,21.41,15.19,29.17,31.73,29.17,16.54,0,29.15-11.63,28.16-33.03-.99-21.41-15.19-35.41-31.73-35.41s-29.15,17.86-28.16,39.27Z"
        />

        <ellipse fill="#ffc49c" cx="145.19" cy="212.04" rx="7" ry="7.64" />
        <ellipse fill="#ffc49c" cx="311.64" cy="212.04" rx="7" ry="7.64" />

        <path
          fill="#bbcfda"
          d="m216.26,276.02c-22.32,0-43.71,1.08-63.49,3.04-3.38.34-5.52,3.78-4.21,6.86,11.08,25.97,37.22,44.21,67.7,44.21s56.62-18.24,67.7-44.21c1.31-3.08-.83-6.52-4.21-6.86-19.78-1.97-41.17-3.04-63.49-3.04Z"
        />
        <path
          fill="#fff"
          d="m216.26,280.98c-22.25,0-43.57,1.09-63.29,3.09-3.37.34-5.51,3.84-4.2,6.97,11.05,26.38,37.1,44.91,67.49,44.91s56.44-18.53,67.49-44.91c1.31-3.12-.83-6.62-4.2-6.97-19.72-2-41.04-3.09-63.29-3.09Z"
        />
        <path
          fill="url(#radial-gradient-6-dark)"
          d="m216.26,278.4c-21.9,0-42.89,1.08-62.3,3.04-3.32.34-5.42,3.78-4.13,6.86,10.87,25.97,36.52,44.21,66.44,44.21s55.56-18.24,66.44-44.21c1.29-3.08-.81-6.52-4.13-6.86-19.41-1.97-40.4-3.04-62.31-3.04Z"
        />

        <circle
          fill="url(#radial-gradient-7-dark)"
          cx="314.84"
          cy="44.68"
          r="44.68"
        />
        <path
          fill="url(#radial-gradient-8-dark)"
          d="m215.62,113.41c-5.35,0-9.69-2.24-9.69-5.69,0-40.03,32.56-72.59,72.59-72.59,5.35,0,9.69,4.34,9.69,9.69s-4.34,9.69-9.69,9.69c-29.34,0-53.22,23.87-53.22,53.22,0,3.45-4.34,5.69-9.69,5.69Z"
        />

        <path
          fill="#ff6101"
          d="m151.29,242.18c0,8.28-8.81,12-19.69,12s-19.69-3.72-19.69-12,8.81-15,19.69-15,19.69,6.72,19.69,15Z"
        />
        <path
          fill="#ff6101"
          d="m320.6,242.18c0,8.28-8.81,12-19.69,12s-19.69-3.72-19.69-12,8.81-15,19.69-15,19.69,6.72,19.69,15Z"
        />
      </g>

      {/* Reddit text */}
      <g>
        <path
          fill="#fff"
          d="m331.62,77.92l-12.01,28.56c-1.51-.76-5.11-1.61-8.51-1.61s-6.81.85-10.12,2.46c-6.53,3.31-11.35,9.93-11.35,19.48v52.3h-29.89v-101.77h29.04v14.28h.57c6.81-9.08,17.21-15.79,30.74-15.79,4.92,0,9.65.95,11.54,2.08Z"
        />
        <path
          fill="#fff"
          d="m325.84,128.52c0-29.41,20.15-52.68,50.32-52.68,27.33,0,46.91,19.96,46.91,48.05,0,4.92-.47,9.55-1.51,14h-68.48c3.12,10.69,12.39,19.01,26.29,19.01,7.66,0,18.54-2.74,24.4-7.28l9.27,22.32c-8.61,5.86-21.75,8.7-33.29,8.7-32.25,0-53.91-20.81-53.91-52.11Zm26.67-9.36h43.03c0-13.05-8.89-19.96-19.77-19.96-12.3,0-20.62,7.94-23.27,19.96Z"
        />
        <path
          fill="#fff"
          d="m679.53,31.63c10.03,0,18.25,8.23,18.25,18.25s-8.23,18.25-18.25,18.25-18.25-8.23-18.25-18.25,8.23-18.25,18.25-18.25Zm14.94,147.49h-29.89v-101.77h29.89v101.77Z"
        />
        <path
          fill="#fff"
          d="m506,33.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V33.47h-29.89Zm1.42,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z"
        />
        <path
          fill="#fff"
          d="m620.15,33.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V33.47h-29.89Zm1.28,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z"
        />
        <path
          fill="#fff"
          d="m752.44,77.35h21.85v25.44h-21.85v76.33h-29.89v-76.33h-21.75v-25.44h21.75v-27.66h29.89v27.66Z"
        />
      </g>
    </svg>
  );
}

function RedditLockup({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 774 216"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient
          id="radial-gradient-light"
          cx="370.49"
          cy="151.59"
          fx="370.49"
          fy="142.47"
          r="127.45"
          gradientTransform="translate(0 19.13) scale(1 .87)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#feffff" />
          <stop offset=".4" stopColor="#feffff" />
          <stop offset=".51" stopColor="#f9fcfc" />
          <stop offset=".62" stopColor="#edf3f5" />
          <stop offset=".7" stopColor="#dee9ec" />
          <stop offset=".72" stopColor="#d8e4e8" />
          <stop offset=".76" stopColor="#ccd8df" />
          <stop offset=".8" stopColor="#c8d5dd" />
          <stop offset=".83" stopColor="#ccd6de" />
          <stop offset=".85" stopColor="#d8dbe2" />
          <stop offset=".88" stopColor="#ede3e9" />
          <stop offset=".9" stopColor="#ffebef" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-2-light"
          cx="64.38"
          fx="64.38"
          fy="142.47"
          r="127.45"
          xlinkHref="#radial-gradient-light"
        />
        <radialGradient
          id="radial-gradient-3-light"
          cx="220.14"
          cy="135.08"
          fx="220.14"
          fy="135.08"
          r="384.44"
          gradientTransform="translate(0 40.35) scale(1 .7)"
          xlinkHref="#radial-gradient-light"
        />
        <radialGradient
          id="radial-gradient-4-light"
          cx="134.7"
          cy="240.48"
          fx="134.7"
          fy="240.48"
          r="32.12"
          gradientTransform="translate(0 -110.04) scale(1 1.46)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f60" />
          <stop offset=".5" stopColor="#ff4500" />
          <stop offset=".7" stopColor="#fc4301" />
          <stop offset=".82" stopColor="#f43f07" />
          <stop offset=".92" stopColor="#e53812" />
          <stop offset="1" stopColor="#d4301f" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-5-light"
          cx="6191.5"
          cy="240.48"
          fx="6191.5"
          fy="240.48"
          r="32.12"
          gradientTransform="translate(6489.32 -110.04) rotate(-180) scale(1 -1.46)"
          xlinkHref="#radial-gradient-4-light"
        />
        <radialGradient
          id="radial-gradient-6-light"
          cx="215.93"
          cy="338.52"
          fx="215.93"
          fy="338.52"
          r="113.26"
          gradientTransform="translate(0 116.39) scale(1 .66)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#172e35" />
          <stop offset=".29" stopColor="#0e1c21" />
          <stop offset=".73" stopColor="#030708" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <radialGradient
          id="radial-gradient-7-light"
          cx="315.81"
          cy="3.47"
          fx="315.81"
          fy="3.47"
          r="99.42"
          gradientTransform="translate(0 .06) scale(1 .98)"
          xlinkHref="#radial-gradient-light"
        />
        <radialGradient
          id="radial-gradient-8-light"
          cx="274.38"
          cy="103.82"
          fx="274.38"
          fy="103.82"
          r="81.49"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".48" stopColor="#7a9299" />
          <stop offset=".67" stopColor="#172e35" />
          <stop offset=".75" stopColor="#000" />
          <stop offset=".82" stopColor="#172e35" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <path
        fill="#ff4500"
        d="m108,0h0C48.35,0,0,48.35,0,108h0c0,29.82,12.09,56.82,31.63,76.37l-20.57,20.57c-4.08,4.08-1.19,11.06,4.58,11.06h92.36s0,0,0,0c59.65,0,108-48.35,108-108h0C216,48.35,167.65,0,108,0Z"
      />

      {/* Snoo mascot */}
      <g transform="translate(21.56 31.55) scale(.4)">
        <circle
          fill="url(#radial-gradient-light)"
          cx="369.16"
          cy="188.55"
          r="63.05"
        />
        <circle
          fill="url(#radial-gradient-2-light)"
          cx="63.05"
          cy="188.55"
          r="63.05"
        />
        <ellipse
          fill="url(#radial-gradient-3-light)"
          cx="216.26"
          cy="242.72"
          rx="180"
          ry="135"
        />

        <g>
          <path
            fill="#842123"
            d="m163.04,229.59c-1.05,22.87-16.23,31.17-33.91,31.17s-31.15-11.71-30.09-34.58c1.05-22.87,16.23-38.01,33.91-38.01s31.15,18.54,30.09,41.42Z"
          />
          <path
            fill="#842123"
            d="m333.48,226.18c1.05,22.87-12.42,34.58-30.09,34.58s-32.85-8.3-33.91-31.17c-1.05-22.87,12.42-41.42,30.09-41.42s32.85,15.13,33.91,38.01Z"
          />
        </g>

        <path
          fill="url(#radial-gradient-4-light)"
          d="m163.05,231.59c-.99,21.41-15.19,29.17-31.73,29.17s-29.15-11.63-28.16-33.03c.99-21.41,15.19-35.41,31.73-35.41s29.15,17.86,28.16,39.27Z"
        />
        <path
          fill="url(#radial-gradient-5-light)"
          d="m269.47,231.59c.99,21.41,15.19,29.17,31.73,29.17,16.54,0,29.15-11.63,28.16-33.03-.99-21.41-15.19-35.41-31.73-35.41s-29.15,17.86-28.16,39.27Z"
        />

        <ellipse fill="#ffc49c" cx="145.19" cy="212.04" rx="7" ry="7.64" />
        <ellipse fill="#ffc49c" cx="311.64" cy="212.04" rx="7" ry="7.64" />

        <path
          fill="#bbcfda"
          d="m216.26,276.02c-22.32,0-43.71,1.08-63.49,3.04-3.38.34-5.52,3.78-4.21,6.86,11.08,25.97,37.22,44.21,67.7,44.21s56.62-18.24,67.7-44.21c1.31-3.08-.83-6.52-4.21-6.86-19.78-1.97-41.17-3.04-63.49-3.04Z"
        />
        <path
          fill="#fff"
          d="m216.26,280.98c-22.25,0-43.57,1.09-63.29,3.09-3.37.34-5.51,3.84-4.2,6.97,11.05,26.38,37.1,44.91,67.49,44.91s56.44-18.53,67.49-44.91c1.31-3.12-.83-6.62-4.2-6.97-19.72-2-41.04-3.09-63.29-3.09Z"
        />
        <path
          fill="url(#radial-gradient-6-light)"
          d="m216.26,278.4c-21.9,0-42.89,1.08-62.3,3.04-3.32.34-5.42,3.78-4.13,6.86,10.87,25.97,36.52,44.21,66.44,44.21s55.56-18.24,66.44-44.21c1.29-3.08-.81-6.52-4.13-6.86-19.41-1.97-40.4-3.04-62.31-3.04Z"
        />

        <circle
          fill="url(#radial-gradient-7-light)"
          cx="314.84"
          cy="44.68"
          r="44.68"
        />
        <path
          fill="url(#radial-gradient-8-light)"
          d="m215.62,113.41c-5.35,0-9.69-2.24-9.69-5.69,0-40.03,32.56-72.59,72.59-72.59,5.35,0,9.69,4.34,9.69,9.69s-4.34,9.69-9.69,9.69c-29.34,0-53.22,23.87-53.22,53.22,0,3.45-4.34,5.69-9.69,5.69Z"
        />

        <path
          fill="#ff6101"
          d="m151.29,242.18c0,8.28-8.81,12-19.69,12s-19.69-3.72-19.69-12,8.81-15,19.69-15,19.69,6.72,19.69,15Z"
        />
        <path
          fill="#ff6101"
          d="m320.6,242.18c0,8.28-8.81,12-19.69,12s-19.69-3.72-19.69-12,8.81-15,19.69-15,19.69,6.72,19.69,15Z"
        />
      </g>

      {/* Reddit text */}
      <g>
        <path
          fill="#ff4500"
          d="m331.62,77.92l-12.01,28.56c-1.51-.76-5.11-1.61-8.51-1.61s-6.81.85-10.12,2.46c-6.53,3.31-11.35,9.93-11.35,19.48v52.3h-29.89v-101.77h29.04v14.28h.57c6.81-9.08,17.21-15.79,30.74-15.79,4.92,0,9.65.95,11.54,2.08Z"
        />
        <path
          fill="#ff4500"
          d="m325.84,128.52c0-29.41,20.15-52.68,50.32-52.68,27.33,0,46.91,19.96,46.91,48.05,0,4.92-.47,9.55-1.51,14h-68.48c3.12,10.69,12.39,19.01,26.29,19.01,7.66,0,18.54-2.74,24.4-7.28l9.27,22.32c-8.61,5.86-21.75,8.7-33.29,8.7-32.25,0-53.91-20.81-53.91-52.11Zm26.67-9.36h43.03c0-13.05-8.89-19.96-19.77-19.96-12.3,0-20.62,7.94-23.27,19.96Z"
        />
        <path
          fill="#ff4500"
          d="m679.53,31.63c10.03,0,18.25,8.23,18.25,18.25s-8.23,18.25-18.25,18.25-18.25-8.23-18.25-18.25,8.23-18.25,18.25-18.25Zm14.94,147.49h-29.89v-101.77h29.89v101.77Z"
        />
        <path
          fill="#ff4500"
          d="m506,33.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V33.47h-29.89Zm1.42,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z"
        />
        <path
          fill="#ff4500"
          d="m620.15,33.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V33.47h-29.89Zm1.28,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z"
        />
        <path
          fill="#ff4500"
          d="m752.44,77.35h21.85v25.44h-21.85v76.33h-29.89v-76.33h-21.75v-25.44h21.75v-27.66h29.89v27.66Z"
        />
      </g>
    </svg>
  );
}
