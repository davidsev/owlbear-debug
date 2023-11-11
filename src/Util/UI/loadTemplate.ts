/** Gets a template and makes it into a div, or throws */
export function loadTemplate (template: string): HTMLDivElement {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    if (!(tempDiv.firstChild instanceof HTMLDivElement))
        throw new Error('Unable to load template div');
    return tempDiv.firstChild;
}
