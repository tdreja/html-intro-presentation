/**
 * Wrapper to ensure that we cannot accidentally assign wrong values to a given type!
 */
export interface TypeContainer<VALUE> {
    value: VALUE,
    typeId: string,
}

/**
 * Retrieves the actual value
 */
export function get<VALUE>(container: TypeContainer<VALUE>): VALUE {
    return container.value;
}

/**
 * Sets the value of the container, returning a new container with the updated value
 */
export function set<VALUE>(container: TypeContainer<VALUE>, value: VALUE): TypeContainer<VALUE> {
    return {
        ...container,
        value,
    };
}

/**
 * Checks if both containers are equal in the content or not
 */
export function isEqual<VALUE>(a?: TypeContainer<VALUE> | null, b?: TypeContainer<VALUE> | null): boolean {
    if (a) {
        if (b) {
            return a.typeId === b.typeId && a.value === b.value;
        }
        return false;
    }
    return !b;
}

interface LimitedType<VALUE, TYPEID extends string> extends TypeContainer<VALUE> {
    typeId: TYPEID,
}

/**
 * Generates a new unique identifier for the given type ID
 */
export function uniqueIdentifier<TYPEID extends string, CONTAINER extends LimitedType<string, TYPEID>>(
    typeId: TYPEID,
): CONTAINER {
    return {
        value: crypto.randomUUID(),
        typeId,
    } as CONTAINER;
}
