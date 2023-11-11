let functions: Map<string, Function> = new Map<string, Function>();

export function registerInitFunction (name: string, callback: Function) {
    functions.set(name, callback);
}

export function init () {
    const id = window.location.hash.slice(1);
    const callback = functions.get(id);
    if (callback) callback();
}
