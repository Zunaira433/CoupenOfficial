"use client";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Link as LinkIcon, ImageIcon, Loader2 } from "lucide-react";

export type RichTextEditorHandle = {
  getHTML: () => string;
};

const RichTextEditor = forwardRef<RichTextEditorHandle, { content: string }>(function RichTextEditor(
  { content },
  ref
) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-4" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } })
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-gray dark:prose-invert max-w-none min-h-[300px] focus:outline-none px-2 py-2"
      }
    },
    immediatelyRender: false
  });

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || ""
  }));

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function insertLink() {
    const url = window.prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  if (!editor) return null;

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={insertLink} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <LinkIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});

export default RichTextEditor;