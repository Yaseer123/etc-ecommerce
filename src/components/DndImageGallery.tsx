"use client";

import React, { useState } from "react";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type ProductImage,
  useProductImageStore,
} from "@/app/context/ProductImageProvider";
import { IoMdClose } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FileUploader } from "react-drag-drop-files";
import { uploadFile } from "@/app/actions/file";
import Image from "next/image";

export default function DndImageGallery({
  imageId,
  onClose,
}: {
  imageId: string;
  onClose: (state: string) => void;
}) {
  const { images, setImages, updateImages } = useProductImageStore();
  const [isUploading, setIsUploading] = useState(false);
  //   const [images, setImages] = useState<ImageItem[]>(initialImages);

  const handleClose = () => {
    onClose("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      setImages(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div
      tabIndex={-1}
      onKeyDown={({ key }) => {
        if (key === "Escape") handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
    >
      <div className="relative h-[80%] w-[80%] overflow-y-auto rounded-md bg-white p-4 md:w-[760px]">
        <div className="absolute right-4 top-4 z-50 p-2">
          <button onClick={handleClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <FileUploader
          handleChange={async (file: File) => {
            setIsUploading(true);
            try {
              const formData = new FormData();
              formData.append("file", file);
              const res = await uploadFile(formData, imageId);
              if (res && updateImages) {
                updateImages([res.secure_url]);
              }
            } catch (error) {
              console.log(error);
            }

            setIsUploading(false);
          }}
          name="file"
          types={["png", "jpg", "jpeg", "webp"]}
        >
          <div className="flex w-full items-center justify-center">
            <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <IoCloudUploadOutline size={30} className="text-gray-500" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Image file
                </p>
              </div>
            </label>
          </div>
        </FileUploader>

        {!images?.length ? (
          <p className="p-4 text-center text-2xl font-semibold opacity-45">
            No Images to Render...
          </p>
        ) : null}

        <div className="mt-4 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {isUploading && (
            <div className="">
              <div className="aspect-square animate-pulse rounded bg-gray-200"></div>
            </div>
          )}

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSortingStrategy}>
              {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-4"> */}
              {images.map((image) => (
                <SortableImage key={image.id} image={image} />
              ))}
              {/* </div> */}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

function SortableImage({ image }: { image: ProductImage }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative overflow-hidden rounded-lg bg-white shadow-md"
    >
      <Image
        src={image.src}
        alt={`Image ${image.id}`}
        className="h-40 w-full rounded-lg object-cover"
        height={400}
        width={400}
      />
    </div>
  );
}
