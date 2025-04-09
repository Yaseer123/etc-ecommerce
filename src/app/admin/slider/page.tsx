"use client";

import React, { useState } from "react";
import { api } from "@/trpc/react";
import Image from "next/image";
import { uploadFile, removeImage } from "@/app/actions/file";
import { toast } from "sonner";

export default function AdminSliderPage() {
  const { data: sliders, refetch } = api.slider.getAll.useQuery();
  const addSlider = api.slider.add.useMutation({ onSuccess: () => refetch() });
  const updateSlider = api.slider.update.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteSlider = api.slider.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const [editingSlider, setEditingSlider] = useState<{
    id?: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    imageId: string;
    link: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      // Delete existing image if updating
      if (editingSlider?.imageId) {
        await removeImage(editingSlider.imageId);
      }

      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(formData, "slider-images");

      if (!result) {
        throw new Error("Failed to upload image");
      }

      setEditingSlider((prev) =>
        prev
          ? {
              ...prev,
              imageUrl: result.secure_url,
              imageId: result.public_id,
            }
          : null,
      );
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingSlider) return;

    // Validate required fields
    if (
      !editingSlider.title ||
      !editingSlider.imageUrl ||
      !editingSlider.link
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingSlider.id) {
        await updateSlider.mutateAsync({
          id: editingSlider.id,
          title: editingSlider.title,
          subtitle: editingSlider.subtitle,
          description: editingSlider.description,
          imageUrl: editingSlider.imageUrl,
          imageId: editingSlider.imageId,
          link: editingSlider.link,
        });
        toast.success("Slider updated successfully");
      } else {
        await addSlider.mutateAsync({
          title: editingSlider.title,
          subtitle: editingSlider.subtitle,
          description: editingSlider.description,
          imageUrl: editingSlider.imageUrl,
          imageId: editingSlider.imageId,
          link: editingSlider.link,
        });
        toast.success("Slider created successfully");
      }
      setEditingSlider(null);
    } catch (error) {
      toast.error("Failed to save slider");
    }
  };

  const handleDelete = async (slider: typeof editingSlider) => {
    if (!slider?.id || !slider.imageId) return;

    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      await removeImage(slider.imageId);
      await deleteSlider.mutateAsync({ id: slider.id });
      toast.success("Slider deleted successfully");
    } catch (error) {
      toast.error("Failed to delete slider");
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        Slider Management
      </h1>

      <div className="mb-8">
        <button
          onClick={() =>
            setEditingSlider({
              title: "",
              subtitle: "",
              description: "",
              imageId: "",
              imageUrl: "",
              link: "",
            })
          }
          className="rounded-lg bg-black px-6 py-2.5 text-white transition-colors duration-200 hover:bg-gray-800"
        >
          Add New Slide
        </button>
      </div>

      {editingSlider && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            {editingSlider.id ? "Edit Slide" : "New Slide"}
          </h2>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={editingSlider.title}
                onChange={(e) =>
                  setEditingSlider({ ...editingSlider, title: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 p-3 transition-colors duration-200 focus:border-black focus:ring-black"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subtitle
              </label>
              <input
                type="text"
                placeholder="Enter subtitle"
                value={editingSlider.subtitle}
                onChange={(e) =>
                  setEditingSlider({
                    ...editingSlider,
                    subtitle: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 p-3 transition-colors duration-200 focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                value={editingSlider.description}
                onChange={(e) =>
                  setEditingSlider({
                    ...editingSlider,
                    description: e.target.value,
                  })
                }
                className="min-h-[100px] w-full rounded-lg border-gray-200 p-3 transition-colors duration-200 focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleImageUpload(file);
                }}
                className="w-full cursor-pointer rounded-lg border border-gray-200 p-3"
                disabled={uploading}
              />
              {uploading && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              )}
            </div>
            {editingSlider.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={editingSlider.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Link *
              </label>
              <input
                type="text"
                placeholder="Enter link"
                value={editingSlider.link}
                onChange={(e) =>
                  setEditingSlider({ ...editingSlider, link: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 p-3 transition-colors duration-200 focus:border-black focus:ring-black"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="rounded-lg bg-black px-6 py-2.5 text-white transition-colors duration-200 hover:bg-gray-800"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSlider(null)}
                className="rounded-lg bg-gray-100 px-6 py-2.5 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sliders?.map((slider) => (
          <div
            key={slider.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={slider.imageUrl}
                alt={slider.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {slider.title}
            </h3>
            <p className="mb-4 text-gray-600">{slider.subtitle}</p>
            <a
              href={slider.link}
              target="_blank"
              className="mb-4 block truncate text-gray-900 transition-colors duration-200 hover:text-gray-600"
            >
              {slider.link}
            </a>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setEditingSlider({
                    id: slider.id,
                    title: slider.title,
                    subtitle: slider.subtitle,
                    description: slider.description,
                    imageUrl: slider.imageUrl,
                    imageId: slider.imageId,
                    link: slider.link,
                  })
                }
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={async () =>
                  await handleDelete({
                    ...slider,
                    imageId: slider.imageId,
                  })
                }
                className="rounded-lg bg-black px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
