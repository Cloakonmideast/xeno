import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return new Response("Invalid credentials", { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return new Response("Invalid credentials", { status: 401 });

 const cookie = await cookies();
cookie.set({
  name: "auth",
  value: user.id,
  httpOnly: true,
  secure: false,  // REQUIRED FOR localhost
  sameSite: "strict", // prevents Chrome dropping cookie on redirect
  path: "/", 
});


  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
