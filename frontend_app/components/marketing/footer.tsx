"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

export const Footer = () => {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <footer className="w-full border-t border-border bg-background dark:bg-[#1F1F1F] py-6 px-6 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo and copyright */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Logo />
          <span className="ml-2">
            &copy; {new Date().getFullYear()} Aethra by CyberHash. All rights reserved.
          </span>
        </div>

        {/* Center: Toggle Legal Info */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegal(!showLegal)}
            className="hover:text-primary"
          >
            {showLegal ? "Hide Legal" : "Terms & Privacy"}
          </Button>
        </div>

        {/* Right: Social links */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Toggleable Legal Section */}
      {showLegal && (
        <div className="mt-6 text-muted-foreground text-xs max-w-4xl mx-auto space-y-4 px-2 transition-all duration-300">
          <div>
            <h4 className="text-sm font-semibold text-primary">Privacy Policy</h4>
            <p>
              Aethra respects your privacy. No personal data is sold or shared without consent.
              All usage data is stored securely and used solely to enhance your experience.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary">Terms & Conditions</h4>
            <p>
              By using Aethra, you agree to use the platform ethically and respectfully.
              All content you create remains yours. CyberHash reserves the right to make updates,
              and your continued use indicates agreement with the latest terms.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};
