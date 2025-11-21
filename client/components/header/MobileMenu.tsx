"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { CurrentUser } from "@/types/types";

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
          `https://soundio.onrender.com/api/users/currentuser`
        );
        setCurrentUser(response.data.currentUser);
      } catch (error) {
        setCurrentUser(undefined);
      }
    }
    fetchCurrentUser();
  }, []);

  function signout() {
    localStorage.removeItem("jwt");
    setOpen(false);
    window.location.href = "/";
  }

  return (
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
          {currentUser && (
            <p className="px-6 py-3 hover:bg-white/10 text-lg transition-colors border-b-1 border-white/50">
              {currentUser.username}
            </p>
          )}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="px-6 py-4 hover:bg-white/10 transition-colors border-b-1 border-white/10"
          >
            Shop
          </Link>

          {currentUser ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="px-6 py-4 hover:bg-white/10 transition-colors border-b-1 border-white/10"
              >
                Profile {}
              </Link>
              <Link
                href="/new"
                onClick={() => setOpen(false)}
                className="px-6 py-4 hover:bg-white/10 transition-colors border-b-1 border-white/10"
              >
                + Add New
              </Link>

              <button
                onClick={signout}
                className="px-6 py-4 text-left hover:bg-white/10 transition-colors  text-red-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
