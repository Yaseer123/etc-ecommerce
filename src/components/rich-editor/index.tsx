"use client";

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
import TextStyle from "@tiptap/extension-text-style";
import { FontSize } from "./extensions/fontSize";
import { useImageStore } from "@/context/admin-context/ImageProvider";

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
  content,
  imageId,
  handleSubmit,
  pending,
  submitButtonText,
  children,
}: {
  content: string;
  imageId: string;
  handleSubmit: (content: string) => void;
  pending: boolean;
  submitButtonText: string;
  children: React.ReactNode;
}) {
  const [showImageGallery, setShowImageGallery] = useState("");
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

  const handleShowImageGallery = (state: string) => {
    setShowImageGallery(state);
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        {children}
        <div className="flex min-h-[65vh] flex-col items-center justify-center space-y-4 rounded-md border p-5">
          <div className="sticky top-0 z-30 bg-white">
            <Tools
              editor={editor}
              onImageSelection={() => handleShowImageGallery(imageId)}
            />
          </div>
          <div className="mr-auto flex-1 text-sm">
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
            {pending ? "Submitting..." : submitButtonText}
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
