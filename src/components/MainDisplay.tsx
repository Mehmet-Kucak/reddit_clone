"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import ContentCard from "./ContentCard";

export default function MainDisplay(user: any) {
  const [open, setOpen] = useState(true);

  return (
    <main className="relative flex h-[calc(100vh-60px)]">
      <Sidebar open={open} setOpen={setOpen} user={user} />

      <div
        className={`
          flex-1 h-full transition-[margin-left] duration-300 flex justify-center 
          ${open ? "md:ml-[250px]" : "md:ml-[25px]"} px-[10px] py-[40px]
        `}
      >
        <ContentCard
          user={{ username: "", img: "" }}
          content={{
            title: "Title",
            sub: "ABCD",
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur quisquam, aliquid iure pariatur eos quidem at temporibus minima, ipsa obcaecati nisi deleniti dolore odio, nam adipisci exercitationem ab. Sit, quo quis? Eligendi ipsa natus perferendis officia itaque nobis totam, corrupti voluptates sapiente voluptate, rem aut. Dolorem similique ea repudiandae facere. Vero impedit excepturi pariatur sunt aut, deserunt voluptate aliquam! Rem, expedita possimus rerum, repudiandae ex quod nobis autem perferendis illo unde repellendus officia quam animi? Sed fuga ducimus vel quibusdam fugiat doloremque consectetur iusto rem dolorum ab, sit in. Quo error voluptatibus nulla placeat quasi rerum suscipit ex quidem facere!",
            up: 10,
            down: 2,
            comment: 10,
            date: new Date("2025-07-05T12:00:00Z"),
          }}
        />
      </div>
      <p></p>
    </main>
  );
}
