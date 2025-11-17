"use client";

import React, { useEffect, useState } from "react";
import CreateSoundForm from "@/components/forms/CreateSoundForm";
import { useRouter } from "next/navigation";
import axios from "axios";

const New = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await axios.get(
          `https://soundio.onrender.com/api/users/currentuser`,
          { withCredentials: true }
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
    fetchCurrentUser();
  }, [router]);

  if (!currentUser) {
    return null;
  }

  return <CreateSoundForm />;
};

export default New;
