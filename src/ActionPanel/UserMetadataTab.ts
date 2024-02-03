import { JsonEditor } from './JsonEditor';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { ActionPanel } from './index';

export class UserMetadataTab {
    public readonly div: HTMLDivElement = document.createElement('div');
    private readonly jsonEditor: JsonEditor;

    constructor (public readonly actionPanel: ActionPanel) {
        this.jsonEditor = new JsonEditor(this.saveJson.bind(this));
        this.div.append(this.jsonEditor.div);

        OBR.player.onChange(player => this.update(player.metadata));
        OBR.player.getMetadata().then(this.update.bind(this));
    }

    private update (metadata: Metadata) {
        this.jsonEditor.setJson(metadata);
    }

    private async saveJson (newJson: Metadata): Promise<void> {
        return OBR.player.setMetadata(newJson);
    }
}
