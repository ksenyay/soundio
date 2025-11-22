"use client";

import { Checkbox } from "../ui/checkbox";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import ErrorMessage from "../ErrorMessage";
import useRequest from "../../hooks/sendRequest";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { makeRequest, errors } = useRequest({
    url: `https://soundio.onrender.com/api/users/signup`,
    method: "post",
    body: {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    },
  });

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }
    setIsLoading(true);
    const res = await makeRequest();
    const token = res?.data.token;
    if (token) {
      localStorage.setItem("jwt", token);
      router.push("/");
      toast.success("Account created successfully!");
    }
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={submitForm}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-5"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <Image
              src="/logo.png"
              alt="Sound.io logo"
              width={80}
              height={80}
              className="mx-auto rounded-2xl"
              priority
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Join Sound.io</h1>
              <p className="text-gray-400 text-sm mt-1">
                Create your account to get started
              </p>
            </div>
          </div>

          {/* Error Messages */}
          {errors && Array.isArray(errors) && errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <ErrorMessage errors={errors} />
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={15}
                className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12"
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  maxLength={20}
                  className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12 pr-12"
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 6 characters, and contain at least 1 number.
              </p>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, agreeToTerms: !!checked }))
              }
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-300 cursor-pointer"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms || isLoading}
            className="w-full h-10.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            Create Account
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="90"
                  strokeDashoffset="60"
                />
              </svg>
            )}
          </Button>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
