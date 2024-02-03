import { JsonEditor } from '../JsonEditor';
import { Metadata } from '@owlbear-rodeo/sdk';

export interface PlayerInterface {
    name: string;
    metadata: Metadata;
}

export class PlayerRow {
    public div: HTMLDivElement = document.createElement('div');
    private readonly saveCallback: ((newJson: Metadata) => void) | null;
    private jsonEditor: JsonEditor;
    private name: HTMLHeadingElement = document.createElement('h3');

    constructor (saveCallback: ((newJson: Metadata) => void) | null, player?: PlayerInterface) {
        this.saveCallback = saveCallback;

        this.name.textContent = '?';
        this.div.appendChild(this.name);
        this.jsonEditor = new JsonEditor(this.saveCallback);
        this.div.append(this.jsonEditor.div);

        if (player)
            this.setPlayer(player);
    }

    setPlayer (player: PlayerInterface): void {
        this.name.textContent = player.name;
        this.jsonEditor.setJson(player.metadata);
    }
}
