import React from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "./Nav";
import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <>
      <header>
        <nav>
          <div className="button-group relative">
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

          <Nav />
        </nav>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;
