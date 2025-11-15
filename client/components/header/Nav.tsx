"use client";

import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import useRequest from "../../hooks/sendRequest";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import { Search } from "lucide-react";
import { CurrentUser } from "@/types/types";

const Nav = ({ currentUser }: { currentUser: CurrentUser | undefined }) => {
  const [search, setSearch] = useState("");
  const pathName = usePathname();
  const router = useRouter();
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  const { makeRequest } = useRequest({
    url: `${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/signout`,
    method: "post",
  });

  async function signout() {
    try {
      await makeRequest();
      router.refresh();
    } catch (error) {
      console.error("Signout failed:", error);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    localStorage.setItem("searchInput", value);

    // Always work with a fresh copy of params
    const newParams = new URLSearchParams(params.toString());
    if (value === "") {
      newParams.delete("search");
      setSearch("");
    } else {
      newParams.set("search", value);
    }
    newParams.set("page", "1");

    router.push(`?${newParams.toString()}`);
    setParams(newParams);
  }

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
    const savedSearch = localStorage.getItem("searchInput") || "";
    setSearch(savedSearch);
  }, []);

  return (
    <>
      <div className="hidden md:flex flex-col items-center justify-center gap-2 md:justify-start md:flex-row mt-2 mb-2">
        <Link
          href="/"
          className={clsx(
            "relative font-semibold text-[15px] px-4 py-1.5 rounded-2xl transition-colors duration-200",
            "hover:bg-primary/10 hover:text-primary",

            pathName === "/"
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-foreground"
          )}
        >
          Shop
        </Link>

        <Link
          href="/about"
          className={clsx(
            "relative font-semibold text-[15px] px-4 py-1.5 rounded-2xl transition-colors duration-200",
            "hover:bg-primary/10 hover:text-primary",

            pathName === "/about"
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-foreground"
          )}
        >
          About
        </Link>

        <div className="relative flex flex-row">
          <Input
            type="text"
            className="search-bar border-white/20"
            placeholder="Search sounds..."
            value={search}
            onChange={(e) => handleSearch(e)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center gap-2 md:justify-start md:flex-row mt-2 mb-2">
        {currentUser !== undefined ? (
          <div className="flex flex-row gap-3 justify-center items-center">
            <div className=" cursor-pointer bg-white/5 hover:bg-white/10 p-2 rounded-2xl hover:scale-105 transition-all duration-200">
              <Link href="/new" className="flex flex-row gap-2 items-center">
                <p className="font-bold text-sm">+ Add New</p>
              </Link>
            </div>
            <ProfileDropdown signout={signout} user={currentUser} />
          </div>
        ) : (
          <>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="px-5 font-bold rounded-2xl border-white/20 hover:bg-white/10 transition-all duration-200"
              >
                Login
              </Button>
            </Link>

            <Link href="/auth/signup">
              <Button
                variant="default"
                className="rounded-2xl font-bold bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Nav;
