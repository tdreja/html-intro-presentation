import { blockId, createBlockElement, createBlockNode, nodeType, Plugin, PluginContext } from '@notectl/core';
import flexStyles from './flex-plugin.css?inline';

export enum FlexWidth {
    WIDTH_1_3 = 'WIDTH_1_3',
    WIDTH_1_2 = 'WIDTH_1_2',
    WIDTH_2_3 = 'WIDTH_2_3',
}

export class FlexPlugin implements Plugin {
    readonly id: string = 'flex';
    readonly name: string = 'Flex Plugin';
    readonly priority: number = 50;

    init(context: PluginContext): void {
        this.registerStylesheet(context);
        this.registerFlexItemNodeSpec(context);
        this.registerCommands(context);
        this.registerToolbarItem(context);
    }

    private registerStylesheet(context: PluginContext): void {
        context.registerStyleSheet(flexStyles);
    }

    private registerFlexItemNodeSpec(context: PluginContext): void {
        context.registerNodeSpec({
            type: 'flex_item',
            group: 'block',
            content: {
                allow: ['paragraph', 'list_item', 'heading', 'blockquote', 'image', 'horizontal_rule'],
                min: 1,
            },
            attrs: {
                width: { default: FlexWidth.WIDTH_1_2 },
            },
            isolating: true,
            toDOM: (node) => {
                const div = createBlockElement('div', node.id);
                const width = node.attrs?.width;
                let widthClass = 'flex-item-50';
                if (width === FlexWidth.WIDTH_1_3) {
                    widthClass = 'flex-item-30';
                } else if (width === FlexWidth.WIDTH_2_3) {
                    widthClass = 'flex-item-70';
                }
                div.classList.add('flex-item', widthClass);
                return div;
            },
            wrapper: () => {
                return {
                    tag: 'div',
                    key: 'flex-layout',
                    className: 'flex-layout',
                };
            },
            toHTML: (node, content) => {
                const width = node.attrs?.width;
                let widthClass = 'flex-item-50';
                if (width === FlexWidth.WIDTH_1_3) {
                    widthClass = 'flex-item-30';
                } else if (width === FlexWidth.WIDTH_2_3) {
                    widthClass = 'flex-item-70';
                }
                return `<div class="flex-item ${widthClass}">${content}</div>`;
            },
            parseHTML: [
                {
                    tag: 'div',
                    getAttrs: (el) => ({ width: this.classToWidth(el) }),
                },
            ],
            sanitize: {
                tags: ['div'],
                attrs: ['class'],
            },
        });
    }

    private classToWidth(el: HTMLElement): string {
        if (el.classList.contains('flex-item-70')) return FlexWidth.WIDTH_2_3;
        if (el.classList.contains('flex-item-30')) return FlexWidth.WIDTH_1_3;
        return FlexWidth.WIDTH_1_2;
    }

    private insertFlex(context: PluginContext, leftWidth: FlexWidth, rightWidth: FlexWidth): boolean {
        const state = context.getState();
        const leftItem = createBlockNode(
            nodeType('flex_item'),
            [createBlockNode(nodeType('paragraph'), [], blockId(crypto.randomUUID()))],
            blockId(crypto.randomUUID()),
            { width: leftWidth },
        );
        const rightItem = createBlockNode(
            nodeType('flex_item'),
            [createBlockNode(nodeType('paragraph'), [], blockId(crypto.randomUUID()))],
            blockId(crypto.randomUUID()),
            { width: rightWidth },
        );
        const tr = state
            .transaction('command')
            .insertNode([], state.doc.children.length, leftItem)
            .insertNode([], state.doc.children.length, rightItem)
            .build();
        context.dispatch(tr);
        return true;
    }

    private registerCommands(context: PluginContext): void {
        // 1/3 | 2/3
        context.registerCommand('flex-left', () => this.insertFlex(context, FlexWidth.WIDTH_1_3, FlexWidth.WIDTH_2_3));
        // 1/2 | 1/2
        context.registerCommand('flex-middle', () => this.insertFlex(context, FlexWidth.WIDTH_1_2, FlexWidth.WIDTH_1_2));
        // 2/3 | 1/3
        context.registerCommand('flex-right', () => this.insertFlex(context, FlexWidth.WIDTH_2_3, FlexWidth.WIDTH_1_3));
    }

    private registerToolbarItem(context: PluginContext): void {
        context.registerToolbarItem({
            command: 'flex',
            icon: '▥',
            label: 'Flex Layout',
            popupType: 'dropdown',
            id: 'flex',
            group: 'insert',
            popupConfig: {
                items: [
                    { label: 'Left (1/3 | 2/3)', command: 'flex-left', icon: '◧' },
                    { label: 'Middle (1/2 | 1/2)', command: 'flex-middle', icon: '◫' },
                    { label: 'Right (2/3 | 1/3)', command: 'flex-right', icon: '◨' },
                ],
            },
        });
    }
}
