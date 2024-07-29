import { LitElement, unsafeCSS } from 'lit';
import style from './baseCSS.css';

export class BaseElement extends LitElement {

    protected darkMode: boolean = false;

    private eventCleanup: AbortController = new AbortController();

    // Define scoped styles right with your component, in plain CSS
    static styles = [
        unsafeCSS(style),
    ];

    // When removed, clean up our events
    disconnectedCallback () {
        super.disconnectedCallback();
        this.eventCleanup?.abort();
        this.eventCleanup = new AbortController();
    }

    protected get eventCleanupSignal (): AbortSignal {
        return this.eventCleanup.signal;
    }
}
