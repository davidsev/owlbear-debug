import { customElement, query } from 'lit/decorators.js';
import { html } from 'lit';
import { BaseElement } from '../../BaseElement';
import style from './BroadcastReceiver.css';
import { baseCSS } from '../../baseCSS';
import OBR from '@owlbear-rodeo/sdk';
import { BroadcastMessage } from './BroadcastMessage';
import { format } from 'date-fns';

@customElement('broadcast-receiver')
export class BroadcastReceiver extends BaseElement {

    static styles = baseCSS(style);

    @query('input#channel')
    accessor channel!: HTMLInputElement;
    @query('div#messages')
    accessor messages!: HTMLDivElement;

    private watchedChannels: string[] = [];

    render () {
        return html`
            <main>
                <div class="row">
                    <label for="channel">Channel:</label>
                    <input type="text" id="channel"/>
                    <button type="submit" @click="${this.watch}">Watch</button>
                </div>
                <div id="messages"></div>
            </main>
        `;
    }

    async watch () {
        const channel = this.channel.value;
        if (this.watchedChannels.includes(channel))
            return;

        if (channel) {
            OBR.broadcast.onMessage(channel, this.receiveMessage.bind(this, channel));
            this.watchedChannels.push(channel);
            this.channel.value = '';
        }
    }

    async receiveMessage (channel: string, message: any) {
        const e = new BroadcastMessage();
        e.channel = channel;
        e.message = message.data;
        e.time = format(new Date(), 'HH:mm:ss');
        this.messages.appendChild(e);
        console.log(channel, message);
    }
}
