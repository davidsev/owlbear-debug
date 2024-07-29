import { customElement } from 'lit/decorators.js';
import OBR, { Item, Metadata } from '@owlbear-rodeo/sdk';
import { BaseMetadataEditor } from './BaseMetadataEditor';
import { WrappedItem } from '../../../ItemManager/WrappedItem';

@customElement('item-metadata-editor')
export class ItemMetadataEditor extends BaseMetadataEditor {

    constructor (public readonly wrappedItem: WrappedItem) {
        super();
    }

    hookMetadataChanged (callback: () => void): void {
        this.wrappedItem.addEventListener('update', callback, { signal: this.eventCleanupSignal });
    }

    getMetadata (): Promise<Metadata> {
        return Promise.resolve(this.wrappedItem.item.metadata);
    }

    async setMetadata (metadata: Metadata): Promise<void> {
        return OBR.scene.items.updateItems([this.wrappedItem.item.id], (items: Item[]) => {
            items[0].metadata = metadata;
        });
    }
}
