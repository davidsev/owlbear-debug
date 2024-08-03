import { customElement, property } from 'lit/decorators.js';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { BaseMetadataEditor } from './BaseMetadataEditor';
import { PropertyValues } from 'lit';

@customElement('tool-metadata-editor')
export class ToolMetadataEditor extends BaseMetadataEditor {

    @property({ type: String })
    public accessor toolId: string = '';

    private changeCallback: (() => void) | null = null;

    protected update (changedProperties: PropertyValues) {
        super.update(changedProperties);

        console.log('getMetadata', this.toolId, changedProperties);
        if (this.toolId !== changedProperties.get('toolId')) {
            this.changeCallback?.();
        }
    }

    hookMetadataChanged (callback: () => void): void {
        // Store the callback, there's no event for the metadata changing, but we still need to trigger it when the toolId changes
        this.changeCallback = callback;
    }

    async getMetadata (): Promise<Metadata> {
        if (!this.toolId)
            return {};

        const metadata = await OBR.tool.getMetadata(this.toolId);
        return metadata || {};
    }

    async setMetadata (metadata: Metadata): Promise<void> {
        return OBR.tool.setMetadata(this.toolId, metadata);
    }
}
