import { html } from 'lit';
import { BaseElement } from '../../BaseElement';
import { ItemManager } from '../../../ItemManager';
import { query } from 'lit/decorators.js';
import { ItemRow } from './ItemRow';
import { WrappedItem } from '../../../ItemManager/WrappedItem';
import { baseCSS } from '../../baseCSS';
import style from './BaseItemTab.css';
import { ItemDetails } from './ItemDetails';

export class BaseItemTab extends BaseElement {

    static styles = baseCSS(style);

    @query('main')
    private accessor main!: HTMLElement;
    private rows: Map<string, [ItemRow, ItemDetails]> = new Map<string, [ItemRow, ItemDetails]>();

    constructor (public readonly items: ItemManager) {
        super();
    }

    render () {
        return html`
            <main></main>
        `;
    }

    // When added, hook all our events.
    connectedCallback () {
        super.connectedCallback();

        this.items.addEventListener('add', e => this.addItems(e.wrappedItems), { signal: this.eventCleanupSignal });
        this.items.addEventListener('delete', e => this.removeItems(e.wrappedItems), { signal: this.eventCleanupSignal });
        this.items.addEventListener('update', e => this.sortRows(), { signal: this.eventCleanupSignal });

        this.addItems(this.items.all);
    }

    // When a new item is added, create a new row for it.
    private addItems (items: Map<string, WrappedItem>) {
        for (const [id, wrappedItem] of items) {
            if (!this.rows.has(id)) {
                const row = new ItemRow(wrappedItem);
                const details = new ItemDetails(wrappedItem);
                row.addEventListener('show-details', () => details.show());
                this.rows.set(id, [row, details]);
                this.main.appendChild(row);
                this.main.appendChild(details);
            }
        }
        this.sortRows();
    }

    private removeItems (items: Map<string, WrappedItem>) {
        for (const [id, wrappedItem] of items) {
            const elements = this.rows.get(id);
            if (elements) {
                this.main.removeChild(elements[0]);
                this.main.removeChild(elements[1]);
                this.rows.delete(id);
            }
        }
    }

    private sortRows () {
        // Sort the rows into z-index order
        [...this.rows.values()].sort((a, b): number => {
            return b[0].item.zIndex - a[0].item.zIndex;
        }).forEach(row => this.main.appendChild(row[0]));

        // Then move the child items to be under their parent.
        for (const [id, [row, details]] of this.rows) {
            if (!row.wrappedItem.parent)
                this.moveChildRows(row, 1);
        }
    }

    private moveChildRows (parent: ItemRow, depth: number) {
        for (const [id, [row, details]] of this.rows) {
            if (row.wrappedItem.parent?.item.id == parent.item.id) {
                row.indent = depth;
                parent.after(row);
                this.moveChildRows(row, depth + 1);
            }
        }
    }
}

