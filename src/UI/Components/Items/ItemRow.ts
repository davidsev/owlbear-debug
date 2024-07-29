import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseElement } from '../../BaseElement';
import style from './ItemRow.css';
import { baseCSS } from '../../baseCSS';
import { WrappedItem } from '../../../ItemManager/WrappedItem';
import { ItemDetails } from './ItemDetails';

@customElement('item-row')
export class ItemRow extends BaseElement {

    static styles = baseCSS(style);

    @property({ type: Number, reflect: true })
    public accessor indent = 0;
    @query('item-details')
    private accessor itemDetails!: ItemDetails;

    constructor (public readonly wrappedItem: WrappedItem) {
        super();
    }

    connectedCallback () {
        super.connectedCallback();
        this.wrappedItem.addEventListener('update', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
        this.wrappedItem.addEventListener('selected', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
        this.wrappedItem.addEventListener('deselected', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
    }

    public get item () {
        return this.wrappedItem.item;
    }

    // Render the UI as a function of component state
    render () {
        return html`
            <main @click="${this.clickHandler}" class="${this.wrappedItem.selected ? 'selected' : ''}"
                  style="padding-left: ${this.indent * 0.75}em">
                <div class="icon icon-${this.item.layer.toLowerCase()}"></div>
                <div class="name">${this.item.name}</div>
                ${this.wrappedItem.icons.map(i => html`
                    <div class="icon icon-${i}"></div>
                `)}
            </main>
            <item-details .wrappedItem="${this.wrappedItem}"></item-details>
        `;
    }

    private clickHandler () {
        this.itemDetails.show();
    }
}
