"use client"

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // console.log(pathname)

  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center pb-10 max-lg:justify-center"
        >
          <Image src="/icons/wave-white.svg" alt="logo" width={40} height={40} className="mr-2" />
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
                  "bg-nav-focus border-r-4 border-[#D9D9D9] bg-gray-300 pl-4": isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;