import { html } from 'lit';
import { BaseElement } from '../../BaseElement';
import { ItemManager } from '../../../ItemManager';
import { query } from 'lit/decorators.js';
import { ItemRow } from './ItemRow';
import { WrappedItem } from '../../../ItemManager/WrappedItem';
import { baseCSS } from '../../baseCSS';
import style from './BaseItemTab.css';

export class BaseItemTab extends BaseElement {

    static styles = baseCSS(style);

    @query('main')
    private accessor main!: HTMLElement;
    private rows: Map<string, ItemRow> = new Map<string, ItemRow>();

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
                this.rows.set(id, row);
                this.main.appendChild(row);
            }
        }
        this.sortRows();
    }

    private removeItems (items: Map<string, WrappedItem>) {
        for (const [id, wrappedItem] of items) {
            const row = this.rows.get(id);
            if (row) {
                this.main.removeChild(row);
                this.rows.delete(id);
            }
        }
    }

    private sortRows () {
        // Sort the rows into z-index order
        [...this.rows.values()].sort((a, b): number => {
            return b.item.zIndex - a.item.zIndex;
        }).forEach(row => this.main.appendChild(row));

        // Then move the child items to be under their parent.
        for (const [id, row] of this.rows) {
            if (!row.wrappedItem.parent)
                this.moveChildRows(row, 1);
        }
    }

    private moveChildRows (parent: ItemRow, depth: number) {
        for (const [id, row] of this.rows) {
            if (row.wrappedItem.parent?.item.id == parent.item.id) {
                row.indent = depth;
                parent.after(row);
                this.moveChildRows(row, depth + 1);
            }
        }
    }
}

