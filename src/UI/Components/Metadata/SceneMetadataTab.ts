import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { BaseMetadataEditor } from './BaseMetadataEditor';
import { customElement } from 'lit/decorators.js';

@customElement('scene-metadata-tab')
export class SceneMetadataTab extends BaseMetadataEditor {

    hookMetadataChanged (callback: () => void): void {
        OBR.scene.onMetadataChange(callback);
        OBR.scene.onReadyChange(callback);
    }

    getMetadata (): Promise<Metadata> {
        return OBR.scene.getMetadata();
    }

    async setMetadata (metadata: Metadata): Promise<void> {
        if (!await OBR.scene.isReady())
            return;
        return OBR.scene.setMetadata(metadata);
    }

}
