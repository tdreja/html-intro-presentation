import { blockId, createBlockElement, createBlockNode, nodeType, Plugin, PluginContext } from '@notectl/core';

export class FlexPlugin implements Plugin {
    readonly id: string = 'flex';
    readonly name: string = 'Flex Plugin';
    readonly priority: number = 50;

    init(context: PluginContext): void {
        this.registerNodeSpec(context);
        this.registerCommand(context);
        this.registerToolbarItem(context);
    }

    private registerNodeSpec(context: PluginContext): void {
        context.registerNodeSpec({
            type: 'flex',
            group: 'block',
            content: { allow: ['block'] },
            toDOM: (node) => {
                const el = createBlockElement('div', node.id);
                el.style.display = 'flex';
                el.style.flexWrap = 'wrap';
                return el;
            },
            toHTML: (_node, content) =>
                `<div style="display:flex;flex-wrap:wrap">${content}</div>`,
            parseHTML: [
                {
                    tag: 'div',
                    getAttrs: (el) =>
                        el.style.display === 'flex' ? {} : false,
                },
            ],
        });
    }

    private registerCommand(context: PluginContext): void {
        context.registerCommand('insertFlex', () => {
            const state = context.getState();

            // Create an empty paragraph inside the flex container
            const paraNode = createBlockNode(
                nodeType('paragraph'),
                [],
                blockId(crypto.randomUUID()),
            );

            // Create the flex block node
            const flexNode = createBlockNode(
                nodeType('flex'),
                [paraNode],
                blockId(crypto.randomUUID()),
            );

            // Insert at the end of the document
            const tr = state
                .transaction('command')
                .insertNode([], state.doc.children.length, flexNode)
                .build();

            context.dispatch(tr);
            return true;
        });
    }

    private registerToolbarItem(context: PluginContext): void {
        context.registerToolbarItem({
            command: 'insertFlex',
            icon: 'flex',
            label: 'Flex',
            popupType: undefined,
            id: 'insertFlex',
            group: 'insert',
        });
    }
}
