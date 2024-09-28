import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { BaseElement } from '../../BaseElement';
import style from './ItemDetails.css';
import { baseCSS } from '../../baseCSS';
import { WrappedItem } from '../../../ItemManager/WrappedItem';

@customElement('item-details')
export class ItemDetails extends BaseElement {

    static styles = baseCSS(style);

    @query('dialog')
    private accessor dialog!: HTMLDialogElement;

    constructor (public readonly wrappedItem: WrappedItem) {
        super();
    }

    connectedCallback () {
        super.connectedCallback();
        this.wrappedItem.addEventListener('update', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
        this.wrappedItem.addEventListener('selected', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
        this.wrappedItem.addEventListener('deselected', e => this.requestUpdate(), { signal: this.eventCleanupSignal });
    }

    disconnectedCallback () {
        this.dialog?.close();
        super.disconnectedCallback();
    }

    public get item () {
        return this.wrappedItem.item;
    }

    // Render the UI as a function of component state
    render () {
        return html`
            <dialog @click=${this.hideDialog}>
                <main>
                    <div class="row">
                        <div id="layer" class="icon icon-${this.item.layer.toLowerCase()}"></div>
                        <div class="grow">
                            <div class="row">
                                <span id="name">${this.item.name}</span>
                                ${this.wrappedItem.icons.map(i => html`
                                    <div class="icon icon-${i}"></div>
                                `)}
                                <div id="close" @click="${this.hide}">&times;</div>
                            </div>
                            <div class="row">
                                <div id="id">${this.item.id}</div>
                                <div class="icon icon-select" @click="${this.select}"></div>
                                <div class="icon icon-zoomto" @click="${this.zoomTo}"></div>
                                <div class="icon icon-delete" @click="${this.delete}"></div>
                            </div>
                        </div>
                    </div>
                    <dl>
                        <dt>Type:</dt>
                        <dd>${this.item.type.toLowerCase()}</dd>
                        <dt>Layer:</dt>
                        <dd>${this.item.layer.toLowerCase()}</dd>
                        <dt>Position:</dt>
                        <dd>${this.item.position.x.toFixed()}, ${this.item.position.y.toFixed()}</dd>
                        <dt>Scale:</dt>
                        <dd>
                            ${Math.round(this.item.scale.x * 100) / 100} &times;
                            ${Math.round(this.item.scale.y * 100) / 100}
                        </dd>
                        <dt>Rotation:</dt>
                        <dd>${this.item.rotation}&deg;</dd>
                    </dl>
                    <tab-bar>
                        <tab-button target="item-metadata-editor">Metadata</tab-button>
                        <tab-button target="item-editor">Edit Item</tab-button>
                    </tab-bar>
                    <item-metadata-editor .wrappedItem="${this.wrappedItem}"></item-metadata-editor>
                    <item-editor .wrappedItem="${this.wrappedItem}"></item-editor>
                </main>
            </dialog>
        `;
    }

    public show () {
        this.dialog.showModal();
    }

    public hide () {
        this.dialog?.close();
    }

    private hideDialog (e: PointerEvent) {
        // Clicks within the dialog should have target set to the div or one of its children.
        // If the target is the dialog itself, then the click was on the backdrop.
        if (e.target == this.dialog)
            this.dialog.close();
    }

    private select () {
        this.wrappedItem.select();
    }

    private zoomTo () {
        this.wrappedItem.zoomTo();
    }

    private delete () {
        this.wrappedItem.delete();
    }
}
