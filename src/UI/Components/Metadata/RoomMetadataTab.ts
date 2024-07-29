import { customElement } from 'lit/decorators.js';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { BaseMetadataEditor } from './BaseMetadataEditor';

@customElement('room-metadata-tab')
export class RoomMetadataTab extends BaseMetadataEditor {

    hookMetadataChanged (callback: () => void): void {
        OBR.room.onMetadataChange(callback);
    }

    getMetadata (): Promise<Metadata> {
        return OBR.room.getMetadata();
    }

    async setMetadata (metadata: Metadata): Promise<void> {
        return OBR.room.setMetadata(metadata);
    }
}
