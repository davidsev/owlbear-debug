import { customElement } from 'lit/decorators.js';
import { html } from 'lit';
import { BaseElement } from '../BaseElement';
import style from './ActionPanel.css';
import { baseCSS } from '../baseCSS';

@customElement('action-panel')
export class ActionPanel extends BaseElement {

    static styles = baseCSS(style);

    render () {
        return html`
            <main>
                <tab-bar>
                    <tab-button target="#itemsTab">Items</tab-button>
                    <tab-button target="#metadataTab">Metadata</tab-button>
                    <tab-button target="broadcast-tab">Broadcast</tab-button>
                </tab-bar>
                <div id="itemsTab">
                    <tab-bar>
                        <tab-button target="scene-items-tab">Scene Items</tab-button>
                        <tab-button target="local-items-tab">Local Items</tab-button>
                    </tab-bar>
                    <scene-items-tab></scene-items-tab>
                    <local-items-tab></local-items-tab>
                </div>
                <div id="metadataTab">
                    <tab-bar>
                        <tab-button target="room-metadata-tab">Room</tab-button>
                        <tab-button target="scene-metadata-tab">Scene</tab-button>
                        <tab-button target="player-metadata-tab">Player</tab-button>
                        <tab-button target="tool-metadata-tab">Tool</tab-button>
                    </tab-bar>
                    <room-metadata-tab></room-metadata-tab>
                    <scene-metadata-tab></scene-metadata-tab>
                    <player-metadata-tab></player-metadata-tab>
                    <tool-metadata-tab></tool-metadata-tab>
                </div>
                <broadcast-tab></broadcast-tab>
            </main>
        `;
    }
}

