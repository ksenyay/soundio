"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "./Nav";
import { CurrentUser } from "@/types/types";
import axios from "axios";

const Header = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/currentuser`,
          { withCredentials: true }
        );
        setCurrentUser(response.data.currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        setCurrentUser(undefined);
      }
    }
    fetchCurrentUser();
  }, []);

  return (
    <header>
      <nav>
        <div className="button-group">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity duration-200"
          >
            <p className="font-bold text-xl flex flex-row justify-center items-center gap-2">
              Sound.io
              <Image
                src="/logo.png"
                alt="logo"
                width={36}
                height={36}
                className="mb-1 rounded-lg"
                priority
              />
            </p>
          </Link>
        </div>

        <Nav currentUser={currentUser} />
      </nav>
    </header>
  );
};

export default Header;
