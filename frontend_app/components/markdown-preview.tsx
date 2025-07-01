"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import to avoid SSR issues
const MarkdownPreviewUI = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className,
}) => {
  return (
    <div className={className}>
      <MarkdownPreviewUI
        source={content}
        style={{
          backgroundColor: "transparent",
          color: "white",
          padding: 12,
          fontSize: 14,
        }}
      />
    </div>
  );
};
