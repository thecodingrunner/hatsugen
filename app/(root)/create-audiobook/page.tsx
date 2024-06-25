"use client"

import { ProfileForm } from "@/components/Form"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const { data: session } = useSession();
  const router = useRouter()

  useEffect(() => {
    if (!session?.user) router.push('/sign-in')
  },[])

  return (
    <div className="max-h-screen bg-white p-10 rounded-xl overflow-y-auto">
        <ProfileForm />
    </div>
  )
}

export default page