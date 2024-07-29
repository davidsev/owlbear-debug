import { customElement, query } from 'lit/decorators.js';
import { html, PropertyValueMap } from 'lit';
import { BaseElement } from '../../BaseElement';
import { JsonEditor } from '../JsonEditor';
import OBR, { Player } from '@owlbear-rodeo/sdk';
import { baseCSS } from '../../baseCSS';
import style from './PlayerMetadataTab.css';

@customElement('player-metadata-tab')
export class PlayerMetadataTab extends BaseElement {

    static styles = baseCSS(style);

    /** Map of connectionId to the elements for that player. */
    private otherPlayers: Map<string, [HTMLHeadingElement, JsonEditor]> = new Map();

    /** The div that contains the other players. */
    @query('#other-players')
    private accessor otherPlayersDiv: HTMLDivElement | null = null;

    protected firstUpdated (_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);

        // Once we're loaded, watch for player changes.
        OBR.party.onChange(this.partyUpdated.bind(this));
        OBR.party.getPlayers().then(party => this.partyUpdated(party));
    }

    render () {
        return html`
            <main>
                <h3>My Metadata</h3>
                <player-metadata-editor></player-metadata-editor>
                <div id="other-players">
                </div>
            </main>
        `;
    }

    private partyUpdated (party: Player[]) {

        // Add or update the other players.
        for (const player of party) {
            // Create a row if it doesn't exist.
            if (!this.otherPlayers.has(player.connectionId)) {
                const editor = new JsonEditor();
                editor.readonly = true;
                const h3 = document.createElement('h3');
                this.otherPlayers.set(player.connectionId, [h3, editor]);
                this.otherPlayersDiv?.append(h3);
                this.otherPlayersDiv?.append(editor);
            }

            // Update the row.
            const row = this.otherPlayers.get(player.connectionId);
            if (row) {
                row[0].textContent = player.name;
                row[1].json = player.metadata;
            }
        }

        // Remove any players that are no longer in the party.
        for (const [id, row] of this.otherPlayers) {
            if (!party.find(p => p.connectionId === id)) {
                row[0].remove();
                row[1].remove();
                this.otherPlayers.delete(id);
            }
        }
    }
}

