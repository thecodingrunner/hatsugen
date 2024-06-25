"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { GrLogout } from "react-icons/gr";
import { GrLogin } from "react-icons/gr";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // console.log(pathname)

  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center pb-10 max-lg:justify-center"
        >
          <Image
            src="/icons/wave-white.svg"
            alt="logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Hatsugen
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`);

          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start bg-gray-500 pl-4 bg-opacity-60 rounded-l-xl",
                {
                  "bg-nav-focus border-r-4 border-[#D9D9D9] bg-gray-300 pl-4":
                    isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}

        {session?.user ? (
          <button
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => signOut()}
            className="flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start bg-gray-500 pl-4 bg-opacity-60 rounded-l-xl"
          >
            <span className="text-xl"><GrLogout /></span>
            <p>Log out</p>
          </button>
        ) : (
          <Link
            href={"/sign-in"}
            className="flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start bg-gray-500 pl-4 bg-opacity-60 rounded-l-xl"
          >
            <span className="text-xl"><GrLogin /></span>
            <p>Sign in</p>
          </Link>
        )}
      </nav>
    </section>
  );
};

export default LeftSidebar;
