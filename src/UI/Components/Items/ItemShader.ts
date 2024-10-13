import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { BaseElement } from '../../BaseElement';
import style from './ItemShader.css';
import { baseCSS } from '../../baseCSS';
import { WrappedItem } from '../../../ItemManager/WrappedItem';
import OBR, { isEffect, Item } from '@owlbear-rodeo/sdk';

@customElement('item-shader')
export class ItemShader extends BaseElement {

    static styles = baseCSS(style);

    @query('textarea')
    accessor textarea!: HTMLTextAreaElement;

    constructor (public readonly wrappedItem: WrappedItem) {
        super();
    }

    connectedCallback () {
        super.connectedCallback();
        this.wrappedItem.addEventListener('update', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
    }

    public get item () {
        return this.wrappedItem.item;
    }

    // Render the UI as a function of component state
    render () {
        if (!isEffect(this.item))
            throw new Error('ItemShader can only be used with effects');
        return html`
            <main>
                <div class="row">
                    <button type="submit" @click="${this.save}">Save</button>
                </div>
                <textarea>${this.item.sksl}</textarea>
            </main>
        `;
    }

    private save () {
        if (!isEffect(this.item))
            throw new Error('ItemShader can only be used with effects');
        return OBR.scene.local.updateItems([this.wrappedItem.item.id], (items: Item[]) => {
            if (isEffect(items[0]))
                items[0].sksl = this.textarea.value;
        });
    }
}
