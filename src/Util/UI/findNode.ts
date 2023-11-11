/** Find a node of a specific type in a parent node, or throw an error if it doesn't exist. */
export function findNode<T> (parent: HTMLElement, selector: string, type: new (...args: any[]) => T): T {
    const tmp = parent.querySelector(selector);
    if (tmp instanceof type)
        return tmp;
    throw new Error('Unable to load ' + selector);
}
