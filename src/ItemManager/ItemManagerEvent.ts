import { WrappedItem } from './WrappedItem';
import { Item } from '@owlbear-rodeo/sdk';

export class ItemManagerEvent extends Event {
    constructor (type: string, public readonly wrappedItems: Map<string, WrappedItem>) {
        super(type);
    }

    public get items (): Map<string, Item> {
        const items = new Map<string, Item>();
        for (const [id, item] of this.wrappedItems) {
            items.set(id, item.item);
        }
        return items;
    }
}
