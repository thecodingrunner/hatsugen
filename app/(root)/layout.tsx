import LeftSidebar from "@/components/LeftSidebar";
import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/RightSidebar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import Image from "next/image";
import wave from '../../public/icons/wave.svg'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    console.log(wave)
  return (
    <div className="relative flex flex-col h-screen">
        <main className="relative flex bg-black h-screen">
            <LeftSidebar />
            <section className="flex h-screen flex-1 flex-col overflow-y-auto bg-black">
                <div className="mx-auto flex w-full flex-col">
                    <div className="flex h-16 items-center justify-between md:hidden">
                        <Image src={wave} width={40} height={40} alt="menu icon" /> 
                        {/* <Image src="/icons/wave-white.svg" alt="logo" width={40} height={40} className="mr-2" /> */}
                        <MobileNav />
                    </div>
                    <div className="h-screen flex flex-col p-2 overflow-hidden">
                        <Toaster />
                        {children}
                    </div>
                </div>
            </section>

            {/* <RightSidebar /> */}
        </main>
    </div>
  );
}
