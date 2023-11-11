import OBR, { Item, Player } from '@owlbear-rodeo/sdk';
import { ItemManagerEvent } from './ItemManagerEvent';
import { WrappedItem } from './WrappedItem';
import { TypedEventTarget } from 'typescript-event-target';

interface EventMap {
    add: ItemManagerEvent;
    update: ItemManagerEvent;
    delete: ItemManagerEvent;
    selected: ItemManagerEvent;
    deselected: ItemManagerEvent;
}

export class ItemManager extends TypedEventTarget<EventMap> {

    private static instance: ItemManager;
    private items: Map<string, WrappedItem> = new Map();

    private constructor () {
        super();
        OBR.onReady(() => {
            OBR.scene.items.onChange(this.update.bind(this));
            OBR.player.onChange(this.selectionChanged.bind(this));
            OBR.scene.onReadyChange(this.readyChanged.bind(this));
        });
    }

    public static getInstance (): ItemManager {
        if (!ItemManager.instance) {
            ItemManager.instance = new ItemManager();
        }

        return ItemManager.instance;
    }

    private update (items: Item[], forceUpdate: boolean = false) {
        const newItems = new Map<string, WrappedItem>();
        const updatedItems = new Map<string, WrappedItem>();
        const deletedItems = new Map<string, WrappedItem>();
        const seenIds: string[] = [];

        // Add or update items
        for (const item of items) {
            const existingWrappedItem = this.items.get(item.id);
            seenIds.push(item.id);
            if (existingWrappedItem) {
                if (existingWrappedItem._updateItem(item, forceUpdate))
                    updatedItems.set(item.id, existingWrappedItem);
            } else {
                const newWrappedItem = new WrappedItem(this, item);
                this.items.set(item.id, newWrappedItem);
                newItems.set(item.id, newWrappedItem);
            }
        }

        // Find any deleted items
        for (const [id, wrappedItem] of this.items) {
            if (!seenIds.includes(id)) {
                deletedItems.set(id, wrappedItem);
                wrappedItem._delete();
                this.items.delete(id);
            }
        }

        // Send our events
        if (newItems.size > 0)
            this.dispatchTypedEvent('add', new ItemManagerEvent('add', newItems));
        if (updatedItems.size > 0)
            this.dispatchTypedEvent('update', new ItemManagerEvent('update', updatedItems));
        if (deletedItems.size > 0)
            this.dispatchTypedEvent('delete', new ItemManagerEvent('delete', deletedItems));
    }

    private selectionChanged (player: Player): void {

        const selection = player.selection ?? [];

        const selectedItems = new Map<string, WrappedItem>();
        const deselectedItems = new Map<string, WrappedItem>();
        for (const [id, wrappedItem] of this.items) {
            if (selection.includes(id)) {
                if (wrappedItem._updateSelected(true))
                    selectedItems.set(id, wrappedItem);
            } else {
                if (wrappedItem._updateSelected(false))
                    deselectedItems.set(id, wrappedItem);
            }
        }

        if (selectedItems.size > 0)
            this.dispatchTypedEvent('selected', new ItemManagerEvent('selected', selectedItems));
        if (deselectedItems.size > 0)
            this.dispatchTypedEvent('deselected', new ItemManagerEvent('deselected', deselectedItems));
    }

    private async readyChanged (ready: boolean): Promise<void> {
        if (ready) {
            const items = await OBR.scene.items.getItems();
            this.update(items);
            // Do the update a second time, to make sure the parent/child relationships are correct as they may have been added out of order.
            this.update(items, true);
        }
    }

    public get (id: string): WrappedItem | undefined {
        return this.items.get(id);
    }
}
