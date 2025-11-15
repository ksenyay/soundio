import { buildClient } from "@/api/buildClient";
import CreateSoundForm from "@/components/forms/CreateSoundForm";
import { CurrentUser } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const New = async () => {
  let currentUser: CurrentUser | null = null;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  try {
    const client = buildClient(sessionCookie);
    const response = await client.get(
      `${process.env.AUTH_URL}/api/users/currentuser`
    );
    currentUser = response.data.currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    currentUser = null;
  }

  if (!currentUser) {
    redirect("/auth/login");
  }

  return <CreateSoundForm />;
};

export default New;
