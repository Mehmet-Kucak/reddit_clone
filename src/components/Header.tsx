"use client";

import { useState, useRef, useEffect, use } from "react";
import Image from "next/image";
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
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { signOut } from "@/app/action";
import AuthMenu from "@/components/AuthMenu";
import Reddit_Lockup from "@public/icons/Reddit_Lockup.svg";
import Reddit_Lockup_OnDark from "@public/icons/Reddit_Lockup_OnDark.svg";
import Reddit_Icon from "@public/icons/Reddit_Icon.svg";

export default function Header(user: any) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<{ value: string; focused: boolean }>({
    value: "",
    focused: false,
  });
  const [authType, setAuthType] = useState(0); //0: No menu, 1: Log in, 2: Sign Up, 3: Forgot password

  useEffect(() => {
    setMounted(true);
    console.log(user);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="w-screen h-[60px] bg-light dark:bg-[#0e1113] border-b flex items-center justify-between px-6 gap-x-4">
        <Image
          src={theme === "dark" ? Reddit_Lockup_OnDark : Reddit_Lockup}
          alt="Reddit Logo"
          className="h-6/10 w-auto hidden md:block"
        />
        <Image
          src={Reddit_Icon}
          alt="Reddit Logo"
          className="h-6/10 w-auto block md:hidden"
        />
        <SearchField
          search={search}
          setSearch={setSearch}
          theme={theme ?? "ligth"}
        />
        {user.user.data !== null ? (
          <div className="h-6/10 flex items-center gap-2">
            <button
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
              theme={theme ?? "ligth"}
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

function AvatarIcon({
  theme,
  setTheme,
  user,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  user: any;
}) {
  async function signOutButton() {
    const a = await signOut();
    await console.log(a);
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
