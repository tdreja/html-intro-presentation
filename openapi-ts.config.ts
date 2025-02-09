// @ts-ignore
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    input:
        'http://localhost:8080/v3/api-docs',
    output: {
        format: 'prettier',
        path: './src/main/typescript/api',
    },
    schemas: {
        export: false
    },
    services: {
        export: false
    },
    types: {
        dates: 'types+transform',
        enums: 'typescript',
    },
});