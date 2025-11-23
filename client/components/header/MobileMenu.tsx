"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { CurrentUser } from "@/types/types";
import { AUTH_BASE_URL } from "@/constants/constants";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const { buildClient } = await import("@/api/buildClient");
        const client = buildClient();
        const response = await client.get(
          `${AUTH_BASE_URL}/api/users/currentuser`
        );
        setCurrentUser(response.data.currentUser);
      } catch (error) {
        setCurrentUser(undefined);
      }
    }
    fetchCurrentUser();
  }, []);

  return (
    !currentUser && (
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 right-4 p-2 rounded-xl  hover:bg-white/20 transition-all backdrop-blur-xl z-[1000]"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div
          className={clsx(
            "fixed top-19 left-0 w-full z-40 border-t border-white/10 " +
              "bg-black/10 shadow-xl overflow-hidden backdrop-blur-xl " +
              "transition-all duration-300 origin-top border-1 border-white",
            open
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          )}
        >
          <nav className="flex flex-col py-2 text-md font-medium text-foreground">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="px-6 py-4 hover:bg-white/10 transition-colors border-b-1 border-white/10"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setOpen(false)}
              className="px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </div>
    )
  );
};

export default MobileMenu;
