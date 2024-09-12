"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import HakedoLogo from "../images/Hakedologo.png";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId || !password){
      setError("User ID and Password are Required");
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        userId,
        password,
      });
  
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("User Login Successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Login Failed");
    } finally {
      setIsLoading(false);
    }

    // const result = await signIn("credentials", {
    //   redirect: false,
    //   userId,
    //   password,
    // });

    // if (!result.error) {
    //   toast.success("User Login Successfully");
    //   router.push("/dashboard");
    // } else {
    //   toast.error("Login Failed");
    //   console.log(result.error);

    //   const url = new URL(window.location.href);
    //   url.searchParams.delete("error");
    //   history.replaceState(null, "", url.href);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="flex items-center justify-center">
        <Image
          src={HakedoLogo}
          className="pl-5 m-10 left-[350px] top-[170px]"
          alt="company logo"
        ></Image>
      </div>
      <div className="relative py-4 sm:max-w-xl sm:mx-auto flex space-x-4 justify-between">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 border-4 border-blue-500">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Warehouse Portal</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={loginUser}>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="User ID"
                      name="User ID"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="User ID"
                      onChange={(e) => setUserId(e.target.value)}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      User ID
                    </label>
                  </div>
                  <br />
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="Password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    {/*<a href="/dashboard">*/}
                    <br />
                    <button
                      id="submitButton"
                      className="bg-blue-500 text-white rounded-md px-2 py-1 w-[300px] h-[50px]"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
