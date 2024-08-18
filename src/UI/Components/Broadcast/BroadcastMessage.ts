import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit';
import { BaseElement } from '../../BaseElement';
import style from './BroadcastMessage.css';
import { baseCSS } from '../../baseCSS';

@customElement('broadcast-message')
export class BroadcastMessage extends BaseElement {

    static styles = baseCSS(style);

    @property({ type: String })
    public accessor channel: string = '';
    @property({ type: String })
    public accessor time: string = '';
    @property({ type: Object })
    public accessor message: string = '';

    render () {
        return html`
            <main>
                <header>
                    <span class="time">[${this.time}]:</span>
                    ${this.channel}
                </header>
                <output>${JSON.stringify(this.message, null, 4)}</output>
            </main>
        `;
    }
}
