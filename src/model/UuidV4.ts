export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export type UuidV4 = `${string}-${string}-${string}-${string}-${string}`;

export function generateUuidV4(): UuidV4 {
    return crypto.randomUUID();
}

export function toUuidV4(value?: string | null): UuidV4 | null {
    if (!value) {
        return null;
    }
    if (UUID_V4_REGEX.test(value)) {
        return value as UuidV4;
    }
    return null;
}

export function toUuidV4OrRandom(value?: string | null): UuidV4 {
    const uuid = toUuidV4(value);
    if (uuid) {
        return uuid;
    }
    return generateUuidV4();
}
