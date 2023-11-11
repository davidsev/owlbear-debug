/** Find all nodes of a given type in a parent node. */
export function findNodes<T> (parent: HTMLElement, selector: string, type: new (...args: any[]) => T): T[] {
    const tmp = parent.querySelectorAll(selector);
    const ret: T[] = [];
    for (const e of tmp)
        if (e instanceof type)
            ret.push(e);
    return ret;
}
