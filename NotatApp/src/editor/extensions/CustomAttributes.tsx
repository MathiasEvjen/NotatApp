import { Extension } from '@tiptap/core';

export const CustomAttributes = Extension.create({
    addGlobalAttributes() {
        return [
            {
                types: "*",
                attributes: {
                    visible: {
                        default: "true",
                        renderHTML: (attributes) => {
                            return {
                                "data-visible": attributes.visible,
                            }
                        },
                        parseHTML: element => element.getAttribute("data-visible"),
                    },
                    hiddenBy: {
                        default: null,
                        renderHTML: (attributes) => {
                            return {
                                "data-hidden-by": attributes.hiddenBy,
                            }
                        },
                        parseHTML: element => element.getAttribute("data-hidden-by"),
                    },
                }
            }
        ]
    }
})