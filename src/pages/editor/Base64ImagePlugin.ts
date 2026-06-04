import {
    IMAGE_UPLOAD_SERVICE,
    ImagePlugin,
    ImagePluginConfig,
    ImageUploadResult,
    ImageUploadService,
} from '@notectl/core/full';
import { PluginContext } from '@notectl/core';

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

export class Base64ImagePlugin extends ImagePlugin {
    public constructor(config?: Partial<ImagePluginConfig>) {
        super(config);
    }

    init(context: PluginContext): Promise<void> {
        context.registerService(IMAGE_UPLOAD_SERVICE, keepLocalUploadService);
        return super.init(context);
    }
}
