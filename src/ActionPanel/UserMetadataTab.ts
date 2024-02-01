import { JsonEditor } from './JsonEditor';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { ActionPanel } from './index';

export class UserMetadataTab {
    public readonly div: HTMLDivElement = document.createElement('div');
    private readonly jsonEditor: JsonEditor;

    constructor (public readonly actionPanel: ActionPanel) {
        this.jsonEditor = new JsonEditor(this.saveJson.bind(this));
        this.div.append(this.jsonEditor.div);

        OBR.room.onMetadataChange(this.update.bind(this));
        this.update();
    }

    private async update (): Promise<void> {
        this.jsonEditor.setJson(await OBR.player.getMetadata());
    }

    private async saveJson (newJson: Metadata): Promise<void> {
        OBR.player.setMetadata(newJson);
    }
}
