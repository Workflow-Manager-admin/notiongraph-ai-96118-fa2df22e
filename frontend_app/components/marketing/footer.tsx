"use client";

import { useState } from "react";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

export const Footer = () => {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <footer className="w-full border-t bg-background py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo and copyright */}
          <div className="flex items-center gap-3">
            <Logo className="h-6" />
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Aethra. All rights reserved.
            </span>
          </div>

          {/* Center: Legal */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLegal(!showLegal)}
              className="text-muted-foreground hover:text-primary"
            >
              {showLegal ? "Hide Legal" : "Legal"}
            </Button>
          </div>

          {/* Right: Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Legal Section */}
        {showLegal && (
          <div className="mt-6 text-muted-foreground text-sm max-w-3xl mx-auto space-y-3 px-2">
            <div>
              <h4 className="font-medium text-primary">Terms of Service</h4>
              <p className="mt-1">
                By using Aethra, you agree to our terms. Your notes remain your property.
                We may update these terms occasionally.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary">Privacy Policy</h4>
              <p className="mt-1">
                We respect your privacy. Your data is encrypted and never shared with third parties
                without your consent.
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};