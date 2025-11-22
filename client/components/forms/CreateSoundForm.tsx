"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ErrorMessage from "../ErrorMessage";
import useRequest from "../../hooks/sendRequest";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const categories = [
  "nature",
  "urban",
  "noise",
  "seasonal",
  "meditation",
  "instrumental",
];

const CreateSoundForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: undefined,
    category: "nature",
    tags: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { makeRequest, errors } = useRequest({
    url: `https://product-service-fsp5.onrender.com/api/products`,
    method: "post",
    isFormData: true,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", String(formData.price));
    data.append("category", formData.category);
    data.append("tags", formData.tags);
    if (imageFile) data.append("image", imageFile);
    if (soundFile) data.append("file", soundFile);

    await makeRequest(data);
    setIsLoading(false);
    router.push("/");
    toast.success("Sound created successfully!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={submitForm}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-5"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-white">Create New Sound</h1>
            <p className="text-gray-400 text-sm mt-1">
              Fill out the details to add a new sound to the platform.
            </p>
          </div>

          {errors && Array.isArray(errors) && errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <ErrorMessage errors={errors} />
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12"
            />
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-white/5 border-white/10 rounded-xl h-24 w-full p-3 mb-2 resize-none focus:outline-none"
            />
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="bg-white/5 border-white/10 px-2 rounded-xl h-12 w-full text-gray-300 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <Input
              id="price"
              type="number"
              name="price"
              placeholder="Price (USD)"
              value={formData.price}
              onChange={handleChange}
              required
              min={0.01}
              step="0.01"
              className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12"
            />
            <Input
              id="tags"
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12"
            />
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                required
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-300 file:bg-primary file:text-white file:rounded-xl file:border-none file:p-2 file:mr-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Sound File Upload
              </label>
              <input
                type="file"
                accept="audio/*"
                required
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSoundFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-300 file:bg-primary file:text-white file:rounded-xl file:border-none file:p-2 file:mr-2"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10.5 bg-primary hover:bg-primary/90 font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            Create Sound
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
        </form>
      </div>
    </div>
  );
};

export default CreateSoundForm;
