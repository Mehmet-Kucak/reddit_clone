"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentCard from "./ContentCard";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { createPost, getSubbredit } from "@/app/action";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function MainDisplay({
  user,
  post,
}: {
  user: any;
  post: boolean;
}) {
  const [sidebar, setSidebar] = useState(true);
  const [sub, setSub] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [contentType, setContentType] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  async function postButton() {
    const subRegex = /^(?!_)[A-Za-z0-9_]{3,21}$/;
    const urlRegex =
      /^(https?:\/\/)([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?::\d{1,5})?(\/[^\s]*)?$/;

    if (user.data === null) {
      toast.error("Please log in");
      router.push("/");
      return;
    }

    if (title === "") {
      toast.error("You must enter a title");
      return;
    }
    if (title.length > 100) {
      toast.error("Titles length must be less than 100 characters");
      return;
    }
    if (sub.slice(0, 2).toLowerCase() === "r/") {
      if (!subRegex.test(sub.slice(2))) {
        toast.error("Subreddit name is formatted wrong");
        return;
      }
    } else if (!subRegex.test(sub)) {
      toast.error("Subreddit name is formatted wrong");
      return;
    }

    if (contentType === 0) {
      if (text === "") {
        toast.error("Please enter description");
        return;
      }
    } else {
      if (img === "") {
        toast.error("Please enter url");
        return;
      }
      if (!urlRegex.test(img)) {
        toast.error("Image url is formatted wrong");
        return;
      }
    }

    const { data: d, error: e } = await getSubbredit(
      sub.slice(0, 2).toLowerCase() === "r/" ? sub.slice(2) : sub
    );

    if (e !== null) {
      toast.error("Couldnt find the subreddit");
      return;
    }

    const { data, error } = await createPost(
      title,
      contentType === 0 ? text : img,
      contentType,
      d,
      user
    );

    console.log(data, error);

    if (error !== null) {
      toast.error("Error:" + error.message);
    } else {
      toast.success("Post created");
      router.push("/");
    }
  }

  return (
    <main className="relative flex h-[calc(100vh-60px)]">
      <Sidebar open={sidebar} setOpen={setSidebar} user={user} />

      <div
        className={`
          flex-1 h-full transition-[margin-left] duration-300 flex justify-center 
          ${sidebar ? "md:ml-[250px]" : "md:ml-[25px]"} px-[10px] py-[40px]
        `}
      >
        {post ? (
          <>
            <div className="w-full h-full flex flex-col justify-start gap-4 px-6">
              <div className="max-w-[640px] w-full absolute">
                <button
                  onClick={() => {
                    router.push("/");
                  }}
                  className="absolute right-[0px] top-[0px] p-[4px] rounded-full cursor-pointer hover:bg-black/10"
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
              </div>
              <h1 className="text-3xl font-bold">Create Post</h1>
              <div className="flex flex-col max-w-[640px] w-full items-start gap-1">
                <Label htmlFor="sub">Subreddit</Label>
                <Input
                  onChange={(e) => {
                    setSub(e.target.value);
                  }}
                  type="text"
                  id="sub"
                  placeholder="Subreddit Name"
                  value={sub}
                />
              </div>
              <div className="flex flex-col grow max-w-[640px] w-full items-start gap-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  type="text"
                  id="title"
                  placeholder="Title"
                  value={title}
                />
                <Tabs defaultValue="text" className=" w-full mt-8">
                  <TabsList>
                    <TabsTrigger onClick={() => setContentType(0)} value="text">
                      Text
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setContentType(1)} value="img">
                      Images
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <div className="flex flex-col grow w-full items-start gap-1">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        onChange={(e) => {
                          setText(e.target.value);
                          console.log(contentType);
                        }}
                        id="description"
                        placeholder="Description"
                        value={text}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="img" className="mt-4">
                    <div className="flex flex-col grow w-full items-start gap-1">
                      <Label htmlFor="img">Image</Label>
                      <Input
                        onChange={(e) => {
                          setImg(e.target.value);
                          console.log(contentType);
                        }}
                        type="url"
                        id="img"
                        placeholder="Image Url"
                        value={img}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="max-w-[640px] w-full h-[100px] flex items-center justify-center mt-auto">
                <button
                  onClick={() => {
                    postButton();
                  }}
                  className="w-full h-6/10 rounded-4xl text-white text-xl font-bold bg-orange cursor-pointer hover:brightness-90 dark:hover:brightness-75"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        ) : (
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
        )}
      </div>
      <p></p>
    </main>
  );
}
