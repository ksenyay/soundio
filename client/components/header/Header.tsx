import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { buildClient } from "@/api/buildClient";
import Nav from "./Nav";
import { CurrentUser } from "@/types/types";

const Header = async () => {
  let currentUser: CurrentUser | undefined;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  try {
    const client = buildClient(sessionCookie);
    const response = await client.get(
      `${process.env.AUTH_URL}/api/users/currentuser`
    );
    currentUser = response.data.currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    currentUser = undefined;
  }

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
