import "./textEditor.css";
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Text from '@tiptap/extension-text';
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Math from "@tiptap/extension-mathematics";
import Typography from "@tiptap/extension-typography";
import { UndoRedo } from '@tiptap/extensions';
import { CustomParagraphKeybinds } from "./CustomKeybinds";
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';


export const extensions = [
        Document, 
        CustomParagraphKeybinds, 
        Text, Bold, Italic, Strike, Underline,
        UndoRedo, 
        HardBreak,
        BulletList,
        ListItem,
        OrderedList,
        Blockquote,
        CodeBlock,
        Heading.configure({
            levels: [1, 2, 3],
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Image.configure({
            inline: true,
        }),
        Typography,
        Math,
    ];