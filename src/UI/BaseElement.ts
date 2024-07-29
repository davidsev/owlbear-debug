import { LitElement } from 'lit';
import { baseCSS } from './baseCSS';

export class BaseElement extends LitElement {

    protected darkMode: boolean = false;

    private eventCleanup: AbortController = new AbortController();

    // Define scoped styles right with your component, in plain CSS
    static styles = baseCSS();

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
