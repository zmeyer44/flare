import prisma from "@/lib/prisma";

export default async function signIn(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(email),
    },
  });
  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = true;
  if (isMatch) {
    return user;
  }
  throw new Error("Invalid Credentials");
}
