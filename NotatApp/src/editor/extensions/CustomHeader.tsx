import { Heading } from "@tiptap/extension-heading"
import { ReactNodeViewRenderer } from '@tiptap/react'
import CollapsibleHeader from '../CollapsibleHeader'

export const CustomHeader = Heading.extend({

    addAttributes() {
        return {
            ...this.parent?.(), // Beholder standard ting som textAlign
            isCollapsed: {
                default: "false",
                renderHTML: attributes => ({
                    'data-collapsed': attributes.isCollapsed,
                }),
                parseHTML: element => element.getAttribute('data-collapsed'),
            },
            id: {
                default: null,
                parseHTML: element => element.getAttribute("id") || crypto.randomUUID(),
                renderHTML: attributes => ({ id: attributes.id }),
            }
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(CollapsibleHeader);
    }
})