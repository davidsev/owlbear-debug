import OBR, { Item as BaseItem } from '@owlbear-rodeo/sdk';
import { WrappedItemEvent } from './WrappedItemEvent';
import { TypedEventTarget } from 'typescript-event-target';
import { ItemManager } from '../index';

interface EventMap {
    update: WrappedItemEvent;
    delete: WrappedItemEvent;
    selected: WrappedItemEvent;
    deselected: WrappedItemEvent;
    childrenChanged: WrappedItemEvent;
}

export class WrappedItem extends TypedEventTarget<EventMap> {

    private _selected: boolean = false;
    private _parent?: WrappedItem = undefined;
    private readonly _children: Map<string, WrappedItem> = new Map();
    private readonly abortController: AbortController = new AbortController();

    constructor (private itemManager: ItemManager, private wrappedItem: BaseItem) {
        super();
        // We need to force an update to make sure we have the correct parent.
        this._updateItem(wrappedItem, true);
    }

    private hash (item: BaseItem): string {
        const newItem = { ...item } as any;
        delete newItem.lastModifiedUserId;
        delete newItem.lastModified;

        return JSON.stringify(newItem);
    }

    public _updateSelected (selected: boolean): boolean {
        if (this._selected !== selected) {
            this._selected = selected;
            if (selected)
                this.dispatchTypedEvent('selected', new WrappedItemEvent('selected', this));
            else
                this.dispatchTypedEvent('deselected', new WrappedItemEvent('deselected', this));
            return true;
        }

        return false;
    }

    public _updateItem (item: BaseItem, forceUpdate: boolean = false): boolean {
        if (forceUpdate || this.hash(this.wrappedItem) !== this.hash(item)) {
            // Check for a removed (or changed) attachment.
            if (this.parent && this.parent.item.id !== item.attachedTo) {
                this.parent?._updateChild(this, false);
                this._parent = undefined;
            }
            // Check for a new (or changed) attachment.
            if (item.attachedTo && this.parent?.item.id !== item.attachedTo) {
                this.itemManager.get(item.attachedTo)?._updateChild(this, true);
                this._parent = this.itemManager.get(item.attachedTo);
            }

            // Update our item and tell everyone.
            this.wrappedItem = item;
            this.dispatchTypedEvent('update', new WrappedItemEvent('update', this));
            return true;
        }
        return false;
    }

    /** Add or remove a child */
    public _updateChild (child: WrappedItem, present: boolean): void {
        if (present)
            this._children.set(child.item.id, child);
        else
            this._children.delete(child.item.id);
        this.dispatchTypedEvent('childrenChanged', new WrappedItemEvent('childrenChanged', this));
    }

    public _delete (): void {
        this.abortController.abort();
        this.parent?._updateChild(this, false);
        this.dispatchTypedEvent('delete', new WrappedItemEvent('delete', this));
    }

    public get item (): BaseItem {
        return this.wrappedItem;
    }

    public get selected (): boolean {
        return this._selected;
    }

    public get abortSignal (): AbortSignal {
        return this.abortController.signal;
    }

    public get displayName (): string {
        if ((this.item as any).text?.plainText?.trim())
            return (this.item as any).text.plainText?.trim();
        return this.item.name.trim() || this.item.type || this.item.id;
    }

    public get children (): ReadonlyMap<string, WrappedItem> {
        return this._children;
    }

    public get parent (): WrappedItem | undefined {
        return this._parent;
    }

    public get icons (): string[] {
        const icons: string[] = [];
        if (!this.item.visible)
            icons.push('hidden');
        if (this.item.locked)
            icons.push('locked');
        if (this.item.disableHit)
            icons.push('disabled-hit');
        if (Object.keys(this.item.metadata).length)
            icons.push('metadata');

        return icons;
    }

    public select (): void {
        OBR.player.select([this.item.id]);
    }

    public async zoomTo (): Promise<void> {
        const bounds = await this.itemManager.api.getItemBounds([this.item.id]);
        const newBounds = {
            min: {
                x: bounds.min.x - bounds.width / 2,
                y: bounds.min.y - bounds.height / 2,
            },
            max: {
                x: bounds.max.x + bounds.width / 2,
                y: bounds.max.y + bounds.height / 2,
            },
            width: bounds.width * 2,
            height: bounds.height * 2,
            center: bounds.center,
        };
        await OBR.viewport.animateToBounds(newBounds);
    }

    public delete (): void {
        console.info('Deleting item ' + this.item.name, this.item);
        this.itemManager.api.deleteItems([this.item.id]);
    }
}
