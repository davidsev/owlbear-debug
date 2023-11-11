import { ItemRow } from './ItemRow';
import { ItemManager } from '../../../ItemManager';
import { ItemsTab } from '../index';

export class ItemsList {
    private readonly items: Map<string, ItemRow> = new Map();
    public readonly div: HTMLDivElement = document.createElement('div');

    constructor (public readonly itemsTab: ItemsTab) {
        const itemManager = ItemManager.getInstance();

        itemManager.addEventListener('add', (e) => {
            for (const [id, wrappedItem] of e.wrappedItems) {
                const itemRow = new ItemRow(this, wrappedItem);
                this.div.appendChild(itemRow.div);
                this.items.set(id, itemRow);
                wrappedItem.addEventListener('childrenChanged', this.sortRows.bind(this));
            }
            this.sortRows();
        });
        itemManager.addEventListener('delete', (e) => {
            for (const [id, wrappedItem] of e.wrappedItems) {
                const itemRow = this.items.get(id);
                if (itemRow)
                    itemRow.remove();
                this.items.delete(id);
            }
            this.sortRows();
        });
        itemManager.addEventListener('update', (e) => {
            this.sortRows();
        });
    }

    private sortRows (): void {
        this.addChildRows(undefined, 0);
    }

    private addChildRows (parentId: string | undefined, depth: number): void {
        for (const [id, row] of this.items) {
            if (row.wrappedItem.parent?.item.id === parentId) {
                row.indent = depth;
                this.div.appendChild(row.div);
                this.addChildRows(id, depth + 1);
            }
        }
    }
}
