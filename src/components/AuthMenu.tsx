import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { login, signup } from "@/app/action";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AuthMenu({
  type,
  setType,
}: {
  type: number;
  setType: (type: number) => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="w-full md:w-[640px] h-[525px] pt-10 relative flex flex-col justify-center items-center gap-2 bg-light
     dark:bg-dark_secondary md:rounded-2xl"
    >
      <button
        onClick={() => {
          setType(0);
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
      {type === 3 && (
        <button
          onClick={() => {
            setType(1);
          }}
          className="absolute left-[18px] top-[18px] p-[4px] rounded-full cursor-pointer hover:bg-black/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={theme === "dark" ? "#e3e3e3" : "#434343"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      )}

      {type === 1 && <LogIn type={type} setType={setType} />}
      {type === 2 && <SignUp type={type} setType={setType} />}
    </div>
  );
}

function LogIn({
  type,
  setType,
}: {
  type: number;
  setType: (type: number) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginButton() {
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!emailRegex.test(email)) {
      toast.error("Email is not valid");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    await login(email, password);
    console.log("logged in");
    await setType(0);
  }

  return (
    <>
      <div className="w-7/10 flex flex-col gap-4 items-center mt-[20px]">
        <h1 className="text-3xl font-bold">Log In</h1>
        <button className="w-8/10 h-[40px] rounded-4xl flex justify-center items-center border-1 bg-white text-black cursor-pointer px-4 hover:brightness-90 dark:hover:brightness-75">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
            className="size-[32px] "
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          <h1 className="mx-auto">Continue with Google</h1>
        </button>
      </div>
      <div className="w-7/10 flex items-center justify-center gap-4">
        <hr className="w-full h-1" />
        <span className="text-gray-400 font-light">OR</span>
        <hr className="w-full h-1" />
      </div>
      <div className="flex flex-col w-56/100 items-start gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          id="email"
          placeholder="Email"
        />
      </div>
      <div className="flex flex-col w-56/100 items-start gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          id="password"
          placeholder="Password"
        />
      </div>
      <div className="w-56/100 flex flex-col gap-2 mt-2">
        <span className="text-sm">
          New to Reddit?&nbsp;
          <a
            onClick={() => {
              setType(2);
            }}
            className="text-blue-500 hover:text-blue-400 text-sm cursor-pointer"
          >
            Sign Up
          </a>
        </span>
      </div>
      <div className="w-full h-[100px] border-t-1 flex items-center justify-center mt-auto">
        <button
          onClick={loginButton}
          className="w-7/10 h-6/10 rounded-4xl text-white text-xl font-bold bg-orange cursor-pointer hover:brightness-90 dark:hover:brightness-75"
        >
          Log In
        </button>
      </div>
    </>
  );
}

function SignUp({
  type,
  setType,
}: {
  type: number;
  setType: (type: number) => void;
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function signupButton() {
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!emailRegex.test(email)) {
      toast.error("Email is not valid");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    await signup(email, username, password);
    console.log("signed up");
    await setType(0);
  }

  return (
    <>
      <div className="w-7/10 flex flex-col gap-4 items-center mt-[20px]">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <button className="w-8/10 h-[40px] rounded-4xl flex justify-center items-center border-1 bg-white text-black cursor-pointer px-4 hover:brightness-90 dark:hover:brightness-75">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
            className="size-[32px] "
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          <h1 className="mx-auto">Continue with Google</h1>
        </button>
      </div>
      <div className="w-7/10 flex items-center justify-center gap-4">
        <hr className="w-full h-1" />
        <span className="text-gray-400 font-light">OR</span>
        <hr className="w-full h-1" />
      </div>
      <div className="flex flex-col w-56/100 items-start gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          id="email"
          placeholder="Email"
        />
      </div>
      <div className="flex flex-col w-56/100 items-start gap-1">
        <Label htmlFor="username">Username</Label>
        <Input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type="text"
          id="username"
          placeholder="Username"
        />
      </div>
      <div className="flex flex-col w-56/100 items-start gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          id="password"
          placeholder="Password"
        />
      </div>
      <div className="w-56/100 flex flex-col gap-2 mt-2">
        <span className="text-sm">
          Already a Redditor?&nbsp;
          <a
            onClick={() => {
              setType(1);
            }}
            className="text-blue-500 hover:text-blue-400 text-sm cursor-pointer"
          >
            Log In
          </a>
        </span>
      </div>
      <div className="w-full h-[100px] border-t-1 flex items-center justify-center mt-auto">
        <button
          onClick={signupButton}
          className="w-7/10 h-6/10 rounded-4xl text-white text-xl font-bold bg-orange cursor-pointer hover:brightness-90 dark:hover:brightness-75"
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
