<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  TableIcon,
  Trash2,
  Columns2,
  Rows2,
} from "lucide-vue-next";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  editable?: boolean;
  dir?: "ltr" | "rtl";
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:textContent": [value: string];
}>();

const editor = useEditor({
  content: props.modelValue || "",
  editable: props.editable !== false,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  editorProps: {
    attributes: {
      class: "tiptap-content outline-none min-h-[200px]",
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit("update:modelValue", html);
    emit("update:textContent", editor.getText());
  },
});

// Sync external value changes into the editor
watch(
  () => props.modelValue,
  (newVal) => {
    if (!editor.value) return;
    const currentHTML = editor.value.getHTML();
    if (newVal !== currentHTML) {
      editor.value.commands.setContent(newVal || "", { emitUpdate: false });
    }
  },
);

watch(
  () => props.editable,
  (val) => {
    editor.value?.setEditable(val !== false);
  },
);

watch(
  () => props.dir,
  (val) => {
    if (editor.value) {
      editor.value.view.dom.setAttribute("dir", val || "ltr");
    }
  },
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const insertTable = () => {
  editor.value
    ?.chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();
};
</script>

<template>
  <div class="tiptap-editor" :dir="dir || 'ltr'">
    <!-- Toolbar (only shown when editable) -->
    <div
      v-if="editable !== false && editor"
      class="tiptap-toolbar flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#252525]"
    >
      <!-- Text formatting -->
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="toolbar-btn"
        title="Bold"
        type="button"
      >
        <Bold class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="toolbar-btn"
        title="Italic"
        type="button"
      >
        <Italic class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        class="toolbar-btn"
        title="Strikethrough"
        type="button"
      >
        <Strikethrough class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Headings -->
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="toolbar-btn"
        title="Heading 1"
        type="button"
      >
        <Heading1 class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="toolbar-btn"
        title="Heading 2"
        type="button"
      >
        <Heading2 class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="toolbar-btn"
        title="Heading 3"
        type="button"
      >
        <Heading3 class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Lists -->
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="toolbar-btn"
        title="Bullet List"
        type="button"
      >
        <List class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="toolbar-btn"
        title="Ordered List"
        type="button"
      >
        <ListOrdered class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Block elements -->
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        class="toolbar-btn"
        title="Blockquote"
        type="button"
      >
        <Quote class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="toolbar-btn"
        title="Horizontal Rule"
        type="button"
      >
        <Minus class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Table controls -->
      <button
        @click="insertTable"
        class="toolbar-btn"
        title="Insert Table"
        type="button"
      >
        <TableIcon class="w-4 h-4" />
      </button>
      <template v-if="editor.isActive('table')">
        <button
          @click="editor.chain().focus().addColumnAfter().run()"
          class="toolbar-btn"
          title="Add Column"
          type="button"
        >
          <Columns2 class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().addRowAfter().run()"
          class="toolbar-btn"
          title="Add Row"
          type="button"
        >
          <Rows2 class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().deleteTable().run()"
          class="toolbar-btn text-red-500 hover:text-red-600"
          title="Delete Table"
          type="button"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </template>

      <div class="flex-1"></div>

      <!-- Undo/Redo -->
      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="toolbar-btn"
        title="Undo"
        type="button"
      >
        <Undo2 class="w-4 h-4" />
      </button>
      <button
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="toolbar-btn"
        title="Redo"
        type="button"
      >
        <Redo2 class="w-4 h-4" />
      </button>
    </div>

    <!-- Editor content -->
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
@reference "../style.css";

/* Toolbar button styles */
.toolbar-btn {
  @apply p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed;
}
.toolbar-btn.is-active {
  @apply bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400;
}

/* TipTap editor content styles */
.tiptap-content {
  @apply text-gray-700 dark:text-gray-300 text-lg leading-relaxed;
  padding: 0;
}

.tiptap-content:focus {
  outline: none;
}

/* Placeholder */
.tiptap-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  @apply text-gray-400 pointer-events-none float-left h-0;
}

/* Headings */
.tiptap-content h1 {
  @apply text-2xl font-bold mb-3 mt-4;
}
.tiptap-content h2 {
  @apply text-xl font-bold mb-2 mt-3;
}
.tiptap-content h3 {
  @apply text-lg font-semibold mb-2 mt-3;
}

/* Paragraphs */
.tiptap-content p {
  @apply mb-2;
}

/* Lists */
.tiptap-content ul {
  @apply list-disc pl-6 mb-3;
}
.tiptap-content ol {
  @apply list-decimal pl-6 mb-3;
}
.tiptap-content li {
  @apply mb-1;
}

/* Blockquote */
.tiptap-content blockquote {
  @apply border-l-4 border-cyan-400 pl-4 italic text-gray-600 dark:text-gray-400 my-3;
}

/* Horizontal rule */
.tiptap-content hr {
  @apply border-gray-300 dark:border-gray-600 my-4;
}

/* Code */
.tiptap-content code {
  @apply bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono;
}
.tiptap-content pre {
  @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-3 overflow-x-auto;
}
.tiptap-content pre code {
  @apply bg-transparent p-0;
}

/* Bold, italic, strikethrough */
.tiptap-content strong {
  @apply font-bold;
}
.tiptap-content em {
  @apply italic;
}
.tiptap-content s {
  @apply line-through;
}

/* Table styles */
.tiptap-content table {
  @apply w-full border-collapse my-3 text-base;
}
.tiptap-content table th {
  @apply bg-gray-100 dark:bg-gray-800 font-semibold text-left px-3 py-2 border border-gray-300 dark:border-gray-600;
}
.tiptap-content table td {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600;
}
.tiptap-content table tr:hover td {
  @apply bg-gray-50 dark:bg-gray-800/50;
}

/* Selected cell highlight */
.tiptap-content .selectedCell {
  @apply bg-cyan-50 dark:bg-cyan-900/30;
}

/* Table resize handle */
.tiptap-content .column-resize-handle {
  position: absolute;
  top: 0;
  right: -2px;
  bottom: -2px;
  width: 4px;
  background: #22d3ee;
  pointer-events: none;
}
.tiptap-content .tableWrapper {
  @apply overflow-x-auto my-3;
}
.tiptap-content table .resize-cursor {
  cursor: col-resize;
}
</style>
