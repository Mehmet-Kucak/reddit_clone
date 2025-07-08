"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSubreddit } from "@/app/action";
import toast from "react-hot-toast";

export default function Sidebar({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  user: any;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [createSub, setCreateSub] = useState(false);
  const [subName, setSubName] = useState("");
  const [subDesc, setSubDesc] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <section
        className={`
        absolute top-0 left-0 w-[250px] h-full border-r p-[10px] pr-[24px]
        flex-col items-start gap-1
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-[90%]"} hidden md:flex 
      `}
      >
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="absolute size-[40px] border bg-[#ffffff] dark:bg-[#0e1113] rounded-full left-[230px] hover:bg-[#fafafa] dark:hover:bg-dark_secondary"
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={theme === "dark" ? "#e3e3e3" : "#434343"}
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </div>
        </button>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === "dark" ? "#e3e3e3" : "#434343"}
          >
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
          </svg>
          Home
        </Button>
        <hr className="w-full" />
        <h1 className="w-full h-[40px] rounded-md px-[20px] text-xl flex items-center justify-start gap-2">
          Communities
        </h1>
        {user.user.data !== null && (
          <button
            onClick={() => {
              setCreateSub(true);
            }}
            className="w-full h-[40px] rounded-md px-[20px] text-md flex items-center justify-start gap-2 hover:bg-light_primary dark:hover:bg-dark_secondary"
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
            Create a community
          </button>
        )}
        <Button src="">AAA</Button>
        <Button src="">AAA</Button>
        <Button src="">AAA</Button>
        <Button src="">AAA</Button>
        <Button src="">AAA</Button>
      </section>
      {createSub && (
        <div className="w-svw h-svh z-[1000] fixed top-0 left-0 bg-black/50 p-0 m-0">
          <div className="w-svw h-svh flex items-center justify-center ">
            <div className="w-full md:w-[640px] h-[525px] pt-10 relative flex flex-col justify-start items-center gap-8 bg-light dark:bg-dark_secondary md:rounded-2xl">
              <button
                onClick={() => {
                  setCreateSub(false);
                }}
                className="absolute right-[18px] top-[18px] p-[4px] rounded-full cursor-pointer hover:bg-black/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="size-6"
                  stroke={theme === "dark" ? "#e3e3e3" : "#434343"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="w-7/10 flex flex-col gap-4 items-center mt-[20px]">
                <h1 className="text-3xl text-center font-bold">
                  Tell us about your community
                </h1>
                <p className="text-center font-light">
                  A name and description help people understand what your
                  community is all about.
                </p>
              </div>
              <div className="flex flex-col w-7/10 items-start gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  onChange={(e) => {
                    setSubName(e.target.value);
                  }}
                  type="text"
                  id="name"
                  placeholder="Name"
                />
              </div>
              <div className="flex flex-col grow w-7/10 items-start gap-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  onChange={(e) => {
                    setSubDesc(e.target.value);
                  }}
                  id="description"
                  placeholder="Description"
                  className="resize-none grow"
                />
              </div>
              <div className="w-full h-[100px] border-t-1 flex items-center justify-center mt-auto">
                <button
                  onClick={() => {
                    createSubreddit(subName, subDesc, user);
                    setCreateSub(false);
                    toast.success("Succesfully created your subreddit.");
                  }}
                  className="w-7/10 h-6/10 rounded-4xl text-white text-xl font-bold bg-orange cursor-pointer hover:brightness-90 dark:hover:brightness-75"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Button({
  src,
  children,
}: {
  src?: string;
  children: React.ReactNode;
}) {
  return (
    <button className="w-full h-[40px] rounded-md px-[20px] text-xl flex items-center justify-start gap-2 hover:bg-light_primary dark:hover:bg-dark_secondary">
      {src !== undefined && (
        <Avatar>
          <AvatarImage src={src} />
          <AvatarFallback>r /</AvatarFallback>
        </Avatar>
      )}
      {children}
    </button>
  );
}
