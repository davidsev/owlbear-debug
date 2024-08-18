import { customElement } from 'lit/decorators.js';
import { html } from 'lit';
import { BaseElement } from '../../BaseElement';
import { baseCSS } from '../../baseCSS';

@customElement('broadcast-tab')
export class BroadcastTab extends BaseElement {

    static styles = baseCSS();

    render () {
        return html`
            <main>
                <broadcast-sender></broadcast-sender>
                <hr/>
                <broadcast-receiver></broadcast-receiver>
            </main>
        `;
    }
}

