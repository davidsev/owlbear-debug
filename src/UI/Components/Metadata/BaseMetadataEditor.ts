import { query } from 'lit/decorators.js';
import { html, PropertyValueMap } from 'lit';
import { BaseElement } from '../../BaseElement';
import { JsonEditor } from '../JsonEditor';
import { Metadata } from '@owlbear-rodeo/sdk';

export abstract class BaseMetadataEditor extends BaseElement {

    // Keep track of the original metadata so we can detect if anything is removed.
    private originalMetadata: Metadata = {};

    @query('json-editor')
    accessor jsonEditor!: JsonEditor;

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

        return this.setMetadata(newMetadata);
    }
}
