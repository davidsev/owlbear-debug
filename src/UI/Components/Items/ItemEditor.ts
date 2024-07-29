import { customElement } from 'lit/decorators.js';
import OBR, { Item, Metadata } from '@owlbear-rodeo/sdk';
import { WrappedItem } from '../../../ItemManager/WrappedItem';
import { BaseMetadataEditor } from '../Metadata/BaseMetadataEditor';

@customElement('item-editor')
export class ItemEditor extends BaseMetadataEditor {

    constructor (public readonly wrappedItem: WrappedItem) {
        super();
    }

    hookMetadataChanged (callback: () => void): void {
        this.wrappedItem.addEventListener('update', callback, { signal: this.eventCleanupSignal });
    }

    getMetadata (): Promise<Metadata> {
        return Promise.resolve(this.wrappedItem.item as unknown as Metadata);
    }

    async setMetadata (json: object): Promise<void> {
        return OBR.scene.items.updateItems([this.wrappedItem.item.id], (items: Item[]) => {
            for (const key in json) {
                // @ts-ignore
                items[0][key] = json[key];
            }
        });
    }
}
