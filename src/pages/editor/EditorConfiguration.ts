import { NotectlEditorConfig, ThemePreset } from '@notectl/core';
import {
    AlignmentPlugin,
    CodeBlockPlugin,
    HardBreakPlugin,
    HeadingPlugin,
    SmartPastePlugin,
    TablePlugin,
    TextFormattingPlugin,
} from '@notectl/core/full';
import { Base64ImagePlugin } from './Base64ImagePlugin.ts';
import { FlexPlugin } from './FlexPlugin.ts';

export const editorConfiguration: NotectlEditorConfig = {
    theme: ThemePreset.Dark,
    autofocus: true,
    toolbar: [
        [new TextFormattingPlugin(), new AlignmentPlugin()],
        [new HeadingPlugin({
            levels: [3, 4],
        })],
        [new Base64ImagePlugin({ resizable: false }), new TablePlugin()],
        [new FlexPlugin()],
    ],
    plugins: [
        new CodeBlockPlugin(),
        new HardBreakPlugin(),
        new SmartPastePlugin(),
    ],
};
