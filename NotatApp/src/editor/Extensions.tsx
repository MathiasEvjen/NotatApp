import "./textEditor.css";
import Blockquote from '@tiptap/extension-blockquote';
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
import { CustomKeybinds } from "./CustomKeybinds";
import { ListKit } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table'


export const extensions = [
        Document, 
        Text, Bold, Italic, Strike, Underline,
        UndoRedo, 
        ListKit,
        Blockquote,
        CodeBlock,
        Heading.configure({
            levels: [1, 2, 3],
        }),
        Image.configure({
            inline: true,
        }),
        Typography,
        Math,
        TableKit.configure({
            table: { resizable: true },
        }),
        CustomKeybinds, 
    ];