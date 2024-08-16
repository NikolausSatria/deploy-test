"use client";
import React from "react";
import Sidebar from "../Sidebar";
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";

const RouteLayout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect pengguna ke halaman login
      signIn();
    },
  });
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen flex flex-row justify-start">
    <Sidebar />
    <div className="bg-primary flex-1 p-4 text-black">
        {children}
    </div>
  </div>
  );
};

export default RouteLayout;

// const RouteLayout = ({ children }) => {
//   return (
//     <div className="h-screen flex flex-row justify-start">
//     <Sidebar />
//     <div className="bg-primary flex-1 p-4 text-black">
//         {children}
//     </div>
//   </div>
//   );
// };

// export default RouteLayout;
