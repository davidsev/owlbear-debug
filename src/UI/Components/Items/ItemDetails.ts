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
                        <div>
                            <div class="row">
                                <span id="name">${this.item.name}</span>
                                ${this.wrappedItem.icons.map(i => html`
                                    <div class="icon icon-${i}"></div>
                                `)}
                            </div>
                            <div id="id">${this.item.id}</div>
                        </div>
                        <div id="close" @click="${this.hide}">&times;</div>
                    </div>
                    <dl>
                        <dt>Type:</dt>
                        <dd>${this.item.type.toLowerCase()}</dd>
                        <dt>Layer:</dt>
                        <dd>${this.item.layer.toLowerCase()}</dd>
                        <dt>Position:</dt>
                        <dd>${this.item.position.x.toFixed()}, ${this.item.position.y.toFixed()}</dd>
                        <dt>Scale:</dt>
                        <dd>${this.item.scale.x.toFixed()} &times; ${this.item.scale.y.toFixed()}</dd>
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
        // If the target is the dalog itself, then the click was on the backdrop.
        if (e.target == this.dialog)
            this.dialog.close();
    }
}
