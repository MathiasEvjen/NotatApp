import "./textEditor.css";
import Blockquote from '@tiptap/extension-blockquote'
import HardBreak from '@tiptap/extension-hard-break'
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import { UndoRedo } from '@tiptap/extensions'
import CodeBlock from "@tiptap/extension-code-block";
import { CustomParagraphKeybinds } from "../pages/CustomKeybinds";

export const extensions = [
        Document, 
        CustomParagraphKeybinds, 
        Text, Bold, Italic, Strike, 
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
    ];