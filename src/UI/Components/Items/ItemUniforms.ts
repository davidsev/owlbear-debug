import { customElement } from 'lit/decorators.js';
import { WrappedItem } from '../../../ItemManager/WrappedItem';
import OBR, { isEffect, Item, Metadata } from '@owlbear-rodeo/sdk';
import { BaseMetadataEditor } from '../Metadata/BaseMetadataEditor';
import style from './ItemUniforms.css';
import { baseCSS } from '../../baseCSS';

@customElement('item-uniforms')
export class ItemUniforms extends BaseMetadataEditor {

    static styles = baseCSS(style);

    constructor (public readonly wrappedItem: WrappedItem) {
        super();
    }

    public get item () {
        return this.wrappedItem.item;
    }

    hookMetadataChanged (callback: () => void): void {
        this.wrappedItem.addEventListener('update', callback, { signal: this.eventCleanupSignal });
    }

    getMetadata (): Promise<Metadata> {
        if (!isEffect(this.item))
            throw new Error('ItemUniforms can only be used with effects');
        return Promise.resolve(this.item.uniforms as unknown as Metadata);
    }

    async setMetadata (json: object): Promise<void> {
        if (!isEffect(this.item))
            throw new Error('ItemUniforms can only be used with effects');
        return OBR.scene.local.updateItems([this.wrappedItem.item.id], (items: Item[]) => {
            // @ts-ignore
            items[0].uniforms = json;
        });
    }
}
