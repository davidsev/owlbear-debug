import OBR, { Item, Player } from '@owlbear-rodeo/sdk';
import { ItemManagerEvent } from './ItemManagerEvent';
import { WrappedItem } from './WrappedItem';
import { TypedEventTarget } from 'typescript-event-target';
import { ItemFilter } from '@owlbear-rodeo/sdk/lib/types/ItemFilter';

interface EventMap {
    add: ItemManagerEvent;
    update: ItemManagerEvent;
    delete: ItemManagerEvent;
    selected: ItemManagerEvent;
    deselected: ItemManagerEvent;
}

interface ItemApi {
    getItems<ItemType extends Item> (filter?: ItemFilter<ItemType>): Promise<ItemType[]>;

    onChange (callback: (items: Item[]) => void): () => void;
}

export class ItemManager extends TypedEventTarget<EventMap> {

    private static sceneInstance: ItemManager;
    private static localInstance: ItemManager;
    private items: Map<string, WrappedItem> = new Map();

    private constructor (private api: ItemApi) {
        super();
        OBR.onReady(() => {
            this.api.onChange(this.update.bind(this));
            OBR.player.onChange(this.selectionChanged.bind(this));
            OBR.scene.onReadyChange(this.readyChanged.bind(this));
            this.api.getItems().then(items => {
                // We have to do the initial load twice, as otherwise a child item may come before its parent and not be linked correctly.
                this.update(items);
                this.update(items, true);
            });
        });
    }

    public static getSceneInstance (): ItemManager {
        if (!ItemManager.sceneInstance) {
            ItemManager.sceneInstance = new ItemManager(OBR.scene.items);
        }

        return ItemManager.sceneInstance;
    }

    public static getLocalInstance (): ItemManager {
        if (!ItemManager.localInstance) {
            ItemManager.localInstance = new ItemManager(OBR.scene.local);
        }

        return ItemManager.localInstance;
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
            const items = await this.api.getItems();
            this.update(items);
            // Do the update a second time, to make sure the parent/child relationships are correct as they may have been added out of order.
            this.update(items, true);
        }
    }

    public get (id: string): WrappedItem | undefined {
        return this.items.get(id);
    }

    public get all (): Map<string, WrappedItem> {
        return this.items;
    }
}
