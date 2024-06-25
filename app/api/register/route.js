import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/models/user";
import connectToDB from "@/utils/database";
import { mongo } from "mongoose";

export const POST = async (req, res) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
  }

  const { username, password } = await req.json()

  console.log(username, password)

  try {
    await connectToDB();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    await user.save()

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error }), { status: 400 });
  }
}