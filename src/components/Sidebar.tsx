"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [open, setopen] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section
      className={`
        w-[250px] h-full border-r p-[10px] pr-[24px]
        flex-col gap-1
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-[90%]"} hidden md:flex
      `}
    >
      <button
        onClick={() => {
          setopen((o) => !o);
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
      <hr />
      <Button src="">AAA</Button>
      <Button src="">AAA</Button>
      <Button src="">AAA</Button>
      <Button src="">AAA</Button>
      <Button src="">AAA</Button>
    </section>
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
          <AvatarFallback>{children?.toString().slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}
      {children}
    </button>
  );
}
