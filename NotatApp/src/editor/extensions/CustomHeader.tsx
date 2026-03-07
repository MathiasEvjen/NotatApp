import { Heading } from "@tiptap/extension-heading"
import { ReactNodeViewRenderer } from '@tiptap/react'
import CollapsibleHeader from '../CollapsibleHeader'

export const CustomHeader = Heading.extend({

    addAttributes() {
        return {
        ...this.parent?.(), // Beholder standard ting som textAlign
        collapsed: {
            default: "false",
            renderHTML: attributes => ({
            'data-collapsed': attributes.collapsed,
            }),
            parseHTML: element => element.getAttribute('data-collapsed'),
        },
        visible: {
            default: "true",
            renderHTML: attributes => ({
            'data-visible': attributes.visible,
            }),
            parseHTML: element => element.getAttribute('data-visible'),
        },
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(CollapsibleHeader);
    }
})