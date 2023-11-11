import { WrappedItem } from './index';
import { Item } from '@owlbear-rodeo/sdk';

export class WrappedItemEvent extends Event {
    constructor (type: string, public readonly wrappedItem: WrappedItem) {
        super(type);
    }

    public get item (): Item {
        return this.wrappedItem.item;
    }
}
