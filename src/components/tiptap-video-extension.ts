import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (src: string) => ReturnType;
    };
  }
}

export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true }
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

renderHTML({ HTMLAttributes }) {
  return ["video", mergeAttributes(HTMLAttributes, { class: "rounded-xl my-4 w-full max-h-[480px] object-contain bg-black" })];
},

  addCommands() {
    return {
      setVideo:
        (src: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src, controls: true }
          });
        }
    };
  }
});