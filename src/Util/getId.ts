export const baseId = 'uk.co.davidsev.owlbear-debug';

export function getId (id ?: string): string {
    if (id)
        return `${baseId}/${id}`;
    else
        return baseId;
}
