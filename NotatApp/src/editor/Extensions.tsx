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
import Math from "@tiptap/extension-mathematics";
import Typography from "@tiptap/extension-typography";
import { UndoRedo } from '@tiptap/extensions';
import { CustomKeybinds } from "./CustomKeybinds";
import { ListKit } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import java from 'highlight.js/lib/languages/java'
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('java', java)

export const extensions = [
        Document, 
        Text, Bold, Italic, Strike, Underline,
        UndoRedo, 
        ListKit,
        Blockquote,
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
        CodeBlockLowlight.configure({
            lowlight,
            defaultLanguage: "java",
        }),
    ];