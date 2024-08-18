import { customElement, query } from 'lit/decorators.js';
import { html } from 'lit';
import { BaseElement } from '../../BaseElement';
import style from './BroadcastSender.css';
import { baseCSS } from '../../baseCSS';
import OBR from '@owlbear-rodeo/sdk';

@customElement('broadcast-sender')
export class BroadcastSender extends BaseElement {

    static styles = baseCSS(style);

    @query('input#channel')
    accessor channel!: HTMLInputElement;
    @query('select#target')
    accessor target!: HTMLSelectElement;
    @query('textarea#message')
    accessor message!: HTMLTextAreaElement;

    render () {
        return html`
            <main>
                <div class="row">
                    <label for="channel">Channel:</label>
                    <input type="text" id="channel"/>
                    <select id="target">
                        <option value="REMOTE">Remote</option>
                        <option value="LOCAL">Local</option>
                        <option value="ALL" selected>All</option>
                    </select>
                    <button type="submit" @click="${this.send}">Send</button>
                </div>
                <textarea id="message">{}</textarea>
            </main>
        `;
    }

    async send () {
        try {
            const channel = this.channel.value;
            const target = this.target.value;
            const message = JSON.parse(this.message.value);
            if (channel && message) {
                await OBR.broadcast.sendMessage(channel, message, { destination: target as any });
            }
        } catch (e) {
            if (e instanceof Object && 'message' in e && typeof e.message === 'string') {
                console.error(e);
                const notificationID = await OBR.notification.show(e.message, 'ERROR');
                setTimeout(() => OBR.notification.close(notificationID), 5000);
            }
        }
    }
}
