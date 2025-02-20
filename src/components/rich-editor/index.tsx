"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Tools from "./Tools";
import ImageGallery from "./ImageGallery";
import Link from "@tiptap/extension-link";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";

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
];

export default function RichEditor({ userId }: { userId: string }) {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const addPost = api.post.add.useMutation();

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl outline-none",
      },
    },
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
      <div className="flex flex-col space-y-6">
        <div className="flex min-h-[70vh] flex-col space-y-4 rounded-md border p-5">
          <div className="sticky top-0 z-50 bg-white">
            <Tools
              editor={editor}
              onImageSelection={handleShowImageGallery}
            />
          </div>
          <div className="flex-1">
            <EditorContent editor={editor} className="h-full" />
          </div>
        </div>
        <div className="p-4 text-right">
          <Button
            onClick={() => {
              addPost.mutate({
                title: "demo",
                content: editor?.getHTML() ?? "",
                slug: "demo",
                createdBy: userId,
              });
            }}
            className="bg-black p-2 text-white"
          >
            Create New Post
          </Button>
        </div>
      </div>
      <ImageGallery
        onSelect={onImageSelect}
        visible={showImageGallery}
        onClose={handleShowImageGallery}
      />
    </>
  );
}
