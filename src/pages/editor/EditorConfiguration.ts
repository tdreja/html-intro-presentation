import { NotectlEditorConfig, PluginContext, ThemePreset } from '@notectl/core';
import {
    AlignmentPlugin,
    CodeBlockPlugin,
    HardBreakPlugin,
    HeadingPlugin,
    IMAGE_UPLOAD_SERVICE,
    ImagePlugin,
    ImagePluginConfig,
    ImageUploadResult,
    ImageUploadService,
    SmartPastePlugin,
    TablePlugin,
    TextFormattingPlugin,
} from '@notectl/core/full';

export const keepLocalUploadService: ImageUploadService = {
    upload: async (file: File) => {
        // use a FileReader to generate a base64 data URI:
        const base64url = new Promise<string>((r) => {
            const reader = new FileReader();
            reader.onload = () => r(reader.result as string);
            reader.readAsDataURL(file);
        });
        const url = await base64url;
        const result: ImageUploadResult = {
            url,
        };
        return result;
    },

};

class CustomImagePlugin extends ImagePlugin {
    constructor(config?: Partial<ImagePluginConfig>) {
        super(config);
    }

    init(context: PluginContext): Promise<void> {
        context.registerService(IMAGE_UPLOAD_SERVICE, keepLocalUploadService);
        return super.init(context);
    }
}

export const editorConfiguration: NotectlEditorConfig = {
    theme: ThemePreset.Dark,
    autofocus: true,
    toolbar: [
        [new TextFormattingPlugin(), new AlignmentPlugin()],
        [new HeadingPlugin({
            levels: [3, 4],
        })],
        [new CustomImagePlugin({ resizable: false }), new TablePlugin()],
    ],
    plugins: [
        new CodeBlockPlugin(),
        new HardBreakPlugin(),
        new SmartPastePlugin(),
    ],
};
