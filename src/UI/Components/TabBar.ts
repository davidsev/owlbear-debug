import { html, PropertyValueMap } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { BaseElement } from '../BaseElement';
import style from './TabBar.css';
import { TabButton } from './TabButton';
import { baseCSS } from '../baseCSS';

@customElement('tab-bar')
export class TabBar extends BaseElement {

    static styles = baseCSS(style);

    @queryAssignedElements({ selector: 'tab-button' })
    accessor buttons!: Array<TabButton>;

    constructor () {
        super();

    }

    // Render the UI as a function of component state
    render () {
        return html`
            <nav>
                <slot @click="${this.tabClicked}"></slot>
            </nav>
        `;
    }

    protected firstUpdated (_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        super.firstUpdated(_changedProperties);
        this.shadowRoot?.querySelector('slot')?.addEventListener('slotchange', (e) => this.requestUpdate());
        if (this.buttons.length)
            this.selectTab(this.buttons.filter((pane) => pane.active)[0] || this.buttons[0]);
    }

    selectTab (tab?: TabButton | string | null) {
        if (typeof tab === 'string')
            tab = this.buttons.find((pane) => pane.target === tab);

        this.buttons.forEach((pane) => {
            pane.active = pane === tab;
        });
    }

    private tabClicked (e: Event) {
        const target = e.target as HTMLElement;
        if (!(target instanceof TabButton))
            return;
        this.selectTab(target);
    }
}
