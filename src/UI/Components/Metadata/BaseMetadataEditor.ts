import { query } from 'lit/decorators.js';
import { html, PropertyValueMap } from 'lit';
import { BaseElement } from '../../BaseElement';
import { JsonEditor } from '../JsonEditor';
import { Metadata } from '@owlbear-rodeo/sdk';
import { baseCSS } from '../../baseCSS';
import style from './BaseMetadataEditor.css';

export abstract class BaseMetadataEditor extends BaseElement {

    static styles = baseCSS(style);

    // Keep track of the original metadata so we can detect if anything is removed.
    private originalMetadata: Metadata = {};

    @query('json-editor')
    accessor jsonEditor!: JsonEditor;
    @query('dialog')
    accessor errorDialog!: HTMLDialogElement;
    @query('dialog main')
    accessor errorMessage!: HTMLElement;

    abstract hookMetadataChanged (callback: () => void): void;

    abstract getMetadata (): Promise<Metadata>;

    abstract setMetadata (metadata: Metadata): Promise<void>;

    protected firstUpdated (_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);

        // Once the editor has been created, load the metadata
        this.hookMetadataChanged(this.metadataChanged.bind(this));
        this.metadataChanged();
    }

    render () {
        return html`
            <json-editor json="&quot;Loading...&quot;" @change="${this.editorChanged}"></json-editor>
            <dialog @click=${this.hideDialog}>
                <div class="row">
                    <div id="close" @click="${this.hide}">&times;</div>
                </div>
                <main>
                    Error!
                </main>
            </dialog>
        `;
    }

    private async metadataChanged () {
        const metadata = await this.getMetadata();
        this.jsonEditor.json = metadata;
        this.originalMetadata = metadata;
    }

    private async editorChanged () {
        let newMetadata = this.jsonEditor.json as Metadata;

        // If any keys were removed, set them to undefined so OBR knows to remove them.
        for (const key in this.originalMetadata) {
            if (!newMetadata.hasOwnProperty(key)) {
                newMetadata[key] = undefined;
            }
        }

        try {
            await this.setMetadata(newMetadata);
        } catch (e: any) {
            console.error(e);
            this.errorMessage.textContent = JSON.stringify(e, undefined, 2);
            this.errorDialog.showModal();
        }
    }

    public show () {
        this.errorDialog.showModal();
    }

    public hide () {
        this.errorDialog?.close();
    }

    private hideDialog (e: PointerEvent) {
        // Clicks within the dialog should have target set to the div or one of its children.
        // If the target is the dialog itself, then the click was on the backdrop.
        if (e.target == this.errorDialog)
            this.errorDialog.close();
    }
}
