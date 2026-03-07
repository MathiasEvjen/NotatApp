import { Extension } from '@tiptap/core';

export const CustomAttributes = Extension.create({
    addGlobalAttributes() {
        return [
            {
                types: "*",
                attributes: {
                    collapsed: {
                        default: "false",
                        renderHTML: (attributes) => {
                            if (attributes.collapsed === "true") return {}
                            return {
                                "data-collapsed": attributes.collapsed,
                            }
                        },
                        parseHTML: element => element.getAttribute("data-collapsed"),
                    },
                    visible: {
                        default: "true",
                        renderHTML: (attributes) => {
                            return {
                                "data-visible": attributes.visible,
                            }
                        },
                        parseHTML: element => element.getAttribute("data-visible"),
                    }
                }
            }
        ]
    }
})