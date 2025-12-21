"use client";

import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import { mergeAttributes, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CustomField } from "@/custom-fields/schema";
import { Item } from "../ui/item";
import { Badge } from "../ui/badge";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Undo,
} from "lucide-react";

export const TemplateLoop = Node.create({
  name: "templateLoop",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      each: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-template-loop]",
      },
    ];
  },

  renderHTML({ node }) {
    const name = node.attrs.each;

    return [
      "template-loop",
      { each: name },

      ["template-open", {}, `{{#each ${name}}}`],

      ["div", {}, 0],

      ["template-close", {}, `{{/each}}`],
    ];
  },
});

export const TemplateVariable = Node.create({
  name: "templateVariable",
  inline: true,
  group: "inline",
  atom: true,
  addAttributes() {
    return {
      name: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "template-variable",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "template-variable",
      mergeAttributes(HTMLAttributes),
      `{{${HTMLAttributes.name}}}`,
    ];
  },
});

function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-input placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-all outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm *:size-full min-h-120 flex-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function RichTextEditorSection({
  value,
  onChange,
  invalid,
  customFields,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  customFields: Omit<CustomField, "id">[];
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TemplateVariable,
      TemplateLoop,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none w-full border-none outline-none h-full w-full focus-visible:border-none focus-visible:outline-none",
      },
    },
    immediatelyRender: false,
  });

  const fields = customFields.filter(
    (field) => field.name !== "" && field.displayName !== "",
  );
  return (
    <div className="flex flex-row gap-4">
      <div className="w-full space-y-4 flex flex-col">
        {editor && <MenuBar editor={editor} />}
        <Wrapper>
          <EditorContent
            id="textarea"
            name="textarea"
            editor={editor}
            aria-invalid={invalid}
          />
        </Wrapper>
      </div>
      <div className="w-[40%]">
        <span className="text-muted-foreground mb-4 block">
          Нажмите на поле, чтобы вставить его в текст
        </span>
        <ul className="space-y-4">
          {fields.map((field, index) => (
            <Button
              key={`${field.displayName}-${index}`}
              type="button"
              asChild
              className="w-full block h-fit"
              variant="outline"
              onClick={() =>
                field.type === "single"
                  ? editor
                      ?.chain()
                      .focus()
                      .insertContent({
                        type: "templateVariable",
                        attrs: { name: field.name },
                      })
                      .run()
                  : editor
                      ?.chain()
                      .focus()
                      .insertContent({
                        type: "templateLoop",
                        attrs: { each: "tourists" },
                        content: [
                          {
                            type: "paragraph",
                            content: [{ type: "text", text: " " }],
                          },
                        ],
                      })
                      .run()
              }
            >
              <Item variant="outline" className="space-y-2">
                <div>
                  <div className="flex flex-row gap-2 justify-between">
                    <p className="font-bold">{field.displayName}</p>
                    {field.type === "single" && (
                      <Badge variant="secondary">Одиночный</Badge>
                    )}
                    {field.type === "multiple" && (
                      <Badge className="bg-primary/70 text-primary-foreground">
                        Множественный
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground font-normal">
                    {field.description}
                  </p>
                </div>
                <p className="p-1 rounded-md bg-bg-color text-primary text-center">
                  {field.type === "single" && <>{`{{ ${field.name} }}`}</>}
                  {field.type === "multiple" && (
                    <>{`{{ #each ${field.name} }}`}</>
                  )}
                </p>
              </Item>
            </Button>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="control-group">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
          size="icon"
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <TextAlignStart />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          size="icon"
          onClick={() => editor.chain().focus().toggleTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <TextAlignCenter />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleTextAlign("right").run()}
          size="icon"
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <TextAlignEnd />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleTextAlign("justify").run()
          }
          size="icon"
          className={
            editor.isActive({ textAlign: "justify" })
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <TextAlignJustify />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          size="icon"
          className={
            editorState.isBold
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <Bold />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          size="icon"
          className={
            editorState.isItalic
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <Italic />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          size="icon"
          className={
            editorState.isStrike
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <Strikethrough />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          size="icon"
          className={
            editorState.isParagraph
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          P
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          size="icon"
          className={
            editorState.isHeading1
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          H1
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          size="icon"
          className={
            editorState.isHeading2
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          H2
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          size="icon"
          className={
            editorState.isHeading3
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          H3
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          size="icon"
          className={
            editorState.isHeading4
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          H4
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          size="icon"
          className={
            editorState.isHeading5
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          H5
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          size="icon"
          className={
            editorState.isHeading6
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          H6
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="icon"
          className={
            editorState.isBulletList
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <List />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="icon"
          className={
            editorState.isOrderedList
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          <ListOrdered />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editorState.isBlockquote
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : ""
          }
        >
          Blockquote
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard break
        </Button>
        <Button
          variant={"outline"}
          type="button"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <Undo />
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          size="icon"
          disabled={!editorState.canRedo}
        >
          <Redo />
        </Button>
      </div>
    </div>
  );
}
