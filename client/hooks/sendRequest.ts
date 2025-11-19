/* eslint-disable import/no-anonymous-default-export */
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RequestOptions {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  body?: unknown;
  isFormData?: boolean;
  sessionCookie?: string;
}

export default ({
  url,
  method,
  body,
  isFormData = false,
  sessionCookie,
}: RequestOptions) => {
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const makeRequest = async (formData?: unknown) => {
    setErrors([]);

    try {
      const headers: Record<string, string> = isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

      if (sessionCookie) {
        headers["cookie"] = `session=${sessionCookie}`;
      }

      const response = await axios({
        method,
        url,
        data: formData ? formData : body,
        headers,
      });

      console.log("Success:", response.data);
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string | string[] }>;
      const message = error.response?.data?.message;

      if (Array.isArray(message)) setErrors(message);
      else if (typeof message === "string") setErrors([message]);
      else setErrors(["An unexpected error occurred"]);
    }
  };

  return { makeRequest, errors };
};
