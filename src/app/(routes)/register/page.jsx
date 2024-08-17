"use client";
import React, { useState } from "react";
import Image from "next/image";
import HakedoLogo from "../images/Hakedologo.png";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !name || !password) {
      toast.error("Please input the form correctly");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: name,
          password: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json(); // Mendapatkan pesan kesalahan dari respons
        console.error("Register failed:", errorData);
        toast.error(`User register failed: ${errorData.message}`);
      } else {
        toast.success("User Register Successfully");
        router.push("/");
      }
    } catch (error) {
      console.log("Error during registration:", error);
      toast.error("An unexpected error occurred");
    }
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
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="userId"
                      name="userId"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
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
                      id="name"
                      name="name"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Name
                    </label>
                  </div>
                  <br />
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Password
                    </label>
                  </div>
                  <br />
                  <button
                    id="submitButton"
                    className="bg-blue-500 text-white rounded-md px-2 py-1 w-[300px] h-[50px]"
                  >
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
