"use client";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the floating global chat widget
const AethraBotChat = dynamic(() => import("./aethrabot-chat"), { ssr: false });

// You can add user personalization here if desired
// import { useUser } from "@clerk/nextjs";

// PUBLIC_INTERFACE
export default function AethraBotGlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user } = useUser();
  const user = null; // Replace with user fetch for personalization
  return (
    <>
      {children}
      <AethraBotChat />
    </>
  );
}
