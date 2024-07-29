import { customElement } from 'lit/decorators.js';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { BaseMetadataEditor } from './BaseMetadataEditor';

@customElement('player-metadata-editor')
export class PlayerMetadataEditor extends BaseMetadataEditor {

    hookMetadataChanged (callback: () => void): void {
        OBR.player.onChange(callback);
    }

    getMetadata (): Promise<Metadata> {
        return OBR.player.getMetadata();
    }

    async setMetadata (metadata: Metadata): Promise<void> {
        return OBR.player.setMetadata(metadata);
    }
}
