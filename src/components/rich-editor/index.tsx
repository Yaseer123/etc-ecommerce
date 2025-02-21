"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Tools from "./Tools";
import ImageGallery from "./ImageGallery";
import Link from "@tiptap/extension-link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TextStyle from "@tiptap/extension-text-style";
import { FontSize } from "./extensions/fontSize";
import { useImageStore } from "@/app/context/ImageProvider";

const extensions = [
  StarterKit,
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: false,
    linkOnPaste: true,
    HTMLAttributes: {
      target: "",
    },
  }),
  Image.configure({
    inline: false,
    HTMLAttributes: {
      class: "w-[80%] mx-auto",
    },
  }),
  TextAlign.configure({
    types: ["paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
  TextStyle,
  FontSize.configure({ defaultSize: "14pt" }), // Set default size here,
];

export default function RichEditor({
  title,
  setTitle,
  slug,
  setSlug,
  content,
  imageId,
  handleSubmit,
  pending,
}: {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  slug: string;
  setSlug: Dispatch<SetStateAction<string>>;
  content: string;
  imageId: string;
  handleSubmit: (content: string) => void;
  pending: boolean;
}) {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const { loadImages } = useImageStore();

  useEffect(() => {
    void (async () => {
      try {
        await loadImages(imageId);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    })();
  }, [loadImages, imageId]);

  useEffect(() => {
    const name = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setSlug(name);
  }, [setSlug, title]);

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl outline-none",
      },
    },
    content: content,
  });

  const onImageSelect = (image: string) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: image, alt: "this is an image" })
      .run();
  };

  const handleShowImageGallery = (state: boolean) => {
    setShowImageGallery(state);
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="flex min-h-[65vh] flex-col justify-center items-center space-y-4 rounded-md border p-5">
          <div className="sticky top-0 z-50 bg-white">
            <Tools editor={editor} onImageSelection={handleShowImageGallery} />
          </div>
          <div className="flex-1 text-sm">
            <EditorContent editor={editor} className="h-full" />
          </div>
        </div>
        <div className="p-4 text-right">
          <Button
            onClick={() => {
              handleSubmit(editor?.getHTML() ?? "");
              // editor?.commands.clearContent();
            }}
            disabled={pending}
          >
            {pending ? "Submitting..." : "Create New Post"}
          </Button>
        </div>
      </div>
      <ImageGallery
        onSelect={onImageSelect}
        visible={showImageGallery}
        onClose={handleShowImageGallery}
        imageId={imageId}
      />
    </>
  );
}
