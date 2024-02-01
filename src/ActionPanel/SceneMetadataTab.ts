import { JsonEditor } from './JsonEditor';
import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { ActionPanel } from './index';

export class SceneMetadataTab {
    public readonly div: HTMLDivElement = document.createElement('div');
    private readonly jsonEditor: JsonEditor;

    constructor (public readonly actionPanel: ActionPanel) {
        this.jsonEditor = new JsonEditor(this.saveJson.bind(this));
        this.div.append(this.jsonEditor.div);

        OBR.scene.onMetadataChange(this.update.bind(this));
        OBR.scene.onReadyChange(this.update.bind(this));
        this.update();
    }

    private async update (): Promise<void> {
        if (await OBR.scene.isReady())
            this.jsonEditor.setJson(await OBR.scene.getMetadata());
        else
            this.jsonEditor.setJson({});
    }

    private async saveJson (newJson: Metadata): Promise<void> {
        if (!await OBR.scene.isReady())
            return;

        OBR.scene.setMetadata(newJson);
    }
}
