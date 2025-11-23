"use client";

import React, { useEffect, useState } from "react";
import CreateSoundForm from "@/components/forms/CreateSoundForm";
import { useRouter } from "next/navigation";
import { buildClient } from "@/api/buildClient";
import { AUTH_BASE_URL } from "@/constants/constants";

const New = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  const client = buildClient();

  async function fetchCurrentUser() {
    try {
      const response = await client.get(
        `${AUTH_BASE_URL}/api/users/currentuser`
      );
      setCurrentUser(response.data.currentUser);
      if (!response.data.currentUser) {
        router.push("/auth/login");
      }
    } catch (error) {
      setCurrentUser(null);
      router.push("/auth/login");
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, [router]);

  if (!currentUser) {
    return null;
  }

  return <CreateSoundForm />;
};

export default New;
