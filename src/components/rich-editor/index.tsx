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
    content: `<p>The Link extension adds support for <code>&lt;a&gt;</code> tags to the editor. The extension is headless too, there is no actual UI to add, modify or delete links. The usage example below uses the native JavaScript prompt to show you how that could work.</p><p>In a real world application, you would probably add a more sophisticated user interface.</p><p></p><img class="w-[80%] mx-auto" src="https://res.cloudinary.com/dd7vcc2o3/image/upload/v1725876064/rich-editor/m5u7cjfzaul7ydcist5g.png" alt="this is an image"><h1>In a real world application, you would probably add a more sophisticated user interface.</h1><p>The Link extension adds support for <code>&lt;a&gt;</code> tags to the editor. The extension is headless too, there is no actual UI to add, modify or delete links. The usage example below uses the native JavaScript prompt to show you how that could work.</p><p>In a real world application, you would probably add a more sophisticated user interface.</p>`,
  });

  //   editor?.commands.setContent("")

  const onImageSelect = (image: string) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: image, alt: "this is an image" })
      .run();
  };

  return (
    <>
      <div className="flex h-screen flex-col space-y-6">
        <div className="sticky top-0 z-50 bg-white">
          <Tools
            editor={editor}
            onImageSelection={() => setShowImageGallery(true)}
          />
        </div>
        <div className="flex-1">
          <EditorContent
            editor={editor}
            className="h-full"
            // extensions={[StarterKit]}
            // content="<h1>Hello world <strong>How are you?</strong></h1>"
          />
        </div>

        <div className="p-4 text-right">
          <button
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
          </button>
        </div>
      </div>
      <ImageGallery
        onSelect={onImageSelect}
        visible={showImageGallery}
        onClose={setShowImageGallery}
      />
    </>
  );
}
