import OBR, { Metadata, Player } from '@owlbear-rodeo/sdk';
import { ActionPanel } from '../index';
import { PlayerRow } from './PlayerRow';

export class PlayerMetadataTab {
    public readonly div: HTMLDivElement = document.createElement('div');
    private readonly playerRow: PlayerRow;
    private readonly partyRows: Map<string, PlayerRow> = new Map();

    constructor (public readonly actionPanel: ActionPanel) {
        this.playerRow = new PlayerRow(this.saveUser.bind(this));
        this.div.append(this.playerRow.div);

        OBR.player.onChange(this.updateUser.bind(this));
        OBR.player.getMetadata().then(metadata => this.playerRow.setPlayer({ name: 'My Metadata', metadata }));

        OBR.party.onChange(this.partyUpdated.bind(this));
        OBR.party.getPlayers().then(players => this.partyUpdated(players));
    }

    private updateUser (player: Player) {
        this.playerRow.setPlayer(player);
    }

    private async saveUser (newJson: Metadata): Promise<void> {
        return OBR.player.setMetadata(newJson);
    }

    private partyUpdated (party: Player[]) {
        for (const player of party) {
            if (!this.partyRows.has(player.id)) {
                const row = new PlayerRow(null);
                this.partyRows.set(player.id, row);
                this.div.append(row.div);
            }
            this.partyRows.get(player.id)?.setPlayer(player);
        }
        for (const [id, row] of this.partyRows) {
            if (!party.find(p => p.id === id)) {
                row.div.remove();
                this.partyRows.delete(id);
            }
        }
    }
}
