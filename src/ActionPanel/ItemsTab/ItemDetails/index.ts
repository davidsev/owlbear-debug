import { WrappedItem } from '../../../ItemManager/WrappedItem';
import OBR, { Item, Metadata } from '@owlbear-rodeo/sdk';
import './style.scss';
import { loadTemplate } from '../../../Util/UI/loadTemplate';
import template from './layout.handlebars';
import { ItemRow } from '../ItemsList/ItemRow';
import { findNode } from '../../../Util/UI/findNode';
import { ItemsTab } from '../index';
import detailsTemplate from './details.handlebars';
import { JsonEditor } from '../../JsonEditor';

export class ItemDetails {
    public readonly div: HTMLDivElement;
    private _wrappedItem?: WrappedItem;
    private readonly backButton: HTMLButtonElement;
    private readonly itemRowDiv: HTMLDivElement;
    private itemRow?: ItemRow;
    private readonly itemDetailsDiv: HTMLDivElement;
    private itemAbortController?: AbortController;
    private readonly metadataDiv: HTMLDivElement;
    private readonly jsonEditor: JsonEditor;

    constructor (public readonly itemsTab: ItemsTab) {
        this.div = loadTemplate(template());

        this.backButton = findNode(this.div, 'button.ItemDetails-BackButton', HTMLButtonElement);
        this.itemRowDiv = findNode(this.div, 'div.ItemDetails-ItemRow', HTMLDivElement);
        this.itemDetailsDiv = findNode(this.div, 'div.ItemDetails-Details', HTMLDivElement);
        this.metadataDiv = findNode(this.div, 'div.ItemDetails-Metadata', HTMLDivElement);
        this.jsonEditor = new JsonEditor(this.saveJson.bind(this));
        this.metadataDiv.append(this.jsonEditor.div);

        this.hookDomEvents();
    }

    hookDomEvents (): void {
        this.backButton.addEventListener('click', this.itemsTab.showList.bind(this.itemsTab));
    }

    public get wrappedItem (): WrappedItem | undefined {
        return this._wrappedItem;
    };

    public set wrappedItem (wrappedItem: WrappedItem | undefined) {
        if (this.itemAbortController)
            this.itemAbortController.abort();
        this._wrappedItem = wrappedItem;
        if (wrappedItem) {
            this.itemRow = new ItemRow(null, wrappedItem);
            this.itemRowDiv.replaceChildren(this.itemRow.div);
            this.itemAbortController = new AbortController();
            this.wrappedItem?.addEventListener('update', this.update.bind(this), { signal: this.itemAbortController.signal });
        }
        this.update();
    }

    public get item (): Item | undefined {
        return this.wrappedItem?.item;
    }

    private update (): void {

        if (this.item) {
            this.itemDetailsDiv.innerHTML = detailsTemplate({
                name: this.item.name,
                id: this.item.id,
                zIndex: this.item.zIndex.toFixed(0),
                position: `(${this.item.position.x.toFixed(0)}, ${this.item.position.y.toFixed(0)})`,
                rotation: this.item.rotation.toFixed(0),
            });

            this.jsonEditor.setJson(this.item.metadata);
            this.jsonEditor.div.style.display = 'block';

        } else {
            this.itemDetailsDiv.innerHTML = '';
            this.jsonEditor.div.style.display = 'none';
        }
    }

    private saveJson (newJson: Metadata): void {
        if (!this.item)
            return;

        OBR.scene.items.updateItems([this.item], (items: Item[]) => {
            items[0].metadata = newJson;
        });
    }
}
