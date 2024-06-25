"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import google from '../public/icons/google-icon.svg'

import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // Other props...
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const SignUp = () => {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session]);

  useEffect(() => {
    console.log(providers)
  }, [providers]);

  useEffect(() => {
    const setUpProviders = async () => {
      const response: any = await getProviders();
      console.log(response);

      setProviders(response);
    };

    setUpProviders();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // const result = await signIn("credentials", {
    //   username: values.username,
    //   password: values.password,
    //   redirect: false,
    // });

    console.log(values)

    const user = {
      username: values.username,
      password: values.password,
    }

    console.log(user)

    const result = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (result.ok) {
      router.push("/");
    }
  }

  return (
    <div className="shadow-xl py-6 px-10 bg-[#D9D9D9] w-1/3">
      <h1 className="text-3xl font-semibold">Sign up</h1>
      <h3 className="pb-6">Get started creating audiobooks</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>This is your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="outline" className="w-full font-bold">
            Sign up
          </Button>
        </form>
      </Form>
      <p className="w-full text-center my-4">or</p>
      {session?.user ? (
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => signOut()}
          >
            <img src={google.src} className="h-6 mr-2" alt="google icon" />
            Sign out with Google
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {providers &&
            Object.values(providers).filter(provider => provider.name === 'Google').map((provider: Provider) => (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                key={provider.name}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  signIn(provider.id)
                }
              >
                <img src={google.src} className="h-6 mr-2" alt="google icon" />
                Sign up with Google
              </Button>
            ))}
        </div>
      )}
      <p className="mt-4">
        Already have an account? <Link href="/sign-in" className="underline">Sign in</Link>
      </p>
    </div>
  );
};

export default SignUp;
