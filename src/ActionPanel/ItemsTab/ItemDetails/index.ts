import { WrappedItem } from '../../../ItemManager/WrappedItem';
import { Item } from '@owlbear-rodeo/sdk';
import './style.scss';
import { loadTemplate } from '../../../Util/UI/loadTemplate';
import template from './layout.handlebars';
import { ItemRow } from '../ItemsList/ItemRow';
import { findNode } from '../../../Util/UI/findNode';
import { ItemsTab } from '../index';
import detailsTemplate from './details.handlebars';

export class ItemDetails {
    public readonly div: HTMLDivElement;
    private _wrappedItem?: WrappedItem;
    private readonly backButton: HTMLButtonElement;
    private readonly itemRowDiv: HTMLDivElement;
    private itemRow?: ItemRow;
    private readonly itemDetailsDiv: HTMLDivElement;
    private abortController?: AbortController;

    constructor (public readonly itemsTab: ItemsTab) {
        this.div = loadTemplate(template());

        this.backButton = findNode(this.div, 'button.ItemDetails-BackButton', HTMLButtonElement);
        this.itemRowDiv = findNode(this.div, 'div.ItemDetails-ItemRow', HTMLDivElement);
        this.itemDetailsDiv = findNode(this.div, 'div.ItemDetails-Details', HTMLDivElement);

        this.hookDomEvents();
    }

    hookDomEvents (): void {
        this.backButton.addEventListener('click', this.itemsTab.showList.bind(this.itemsTab));
    }

    public get wrappedItem (): WrappedItem | undefined {
        return this._wrappedItem;
    };

    public set wrappedItem (wrappedItem: WrappedItem | undefined) {
        if (this.abortController)
            this.abortController.abort();
        this._wrappedItem = wrappedItem;
        if (wrappedItem) {
            this.itemRow = new ItemRow(null, wrappedItem);
            this.itemRowDiv.replaceChildren(this.itemRow.div);
            this.abortController = new AbortController();
            this.wrappedItem?.addEventListener('update', this.update.bind(this), { signal: this.abortController.signal });
        }
        this.update();
    }

    public get item (): Item | undefined {
        return this.wrappedItem?.item;
    }

    private update (): void {
        console.log(this.wrappedItem?.displayName);
        if (this.item)
            this.itemDetailsDiv.innerHTML = detailsTemplate({
                name: this.item.name,
                id: this.item.id,
                zIndex: this.item.zIndex.toFixed(0),
                position: `(${this.item.position.x.toFixed(0)}, ${this.item.position.y.toFixed(0)})`,
                rotation: this.item.rotation.toFixed(0),
                json: JSON.stringify(this.item, null, 2),
            });
        else
            this.itemDetailsDiv.innerHTML = '';
    }
}
