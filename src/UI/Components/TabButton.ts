import { html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../BaseElement';
import style from './TabButton.css';
import { baseCSS } from '../baseCSS';

@customElement('tab-button')
export class TabButton extends BaseElement {

    static styles = baseCSS(style);

    // Declare reactive properties
    @property({ type: Boolean, reflect: true })
    accessor active: boolean = false;
    @property({ type: HTMLElement })
    accessor target: HTMLElement | string = '';

    // Render the UI as a function of component state
    render () {
        return html`
            <div class="${this.active ? 'active' : ''}">
                <slot></slot>
            </div>
        `;
    }

    private getTarget (): HTMLElement | null {
        if (typeof this.target === 'string') {
            const parent = this.getRootNode();
            if (parent instanceof ShadowRoot)
                return parent.querySelector(this.target) || null;
            else
                return document.querySelector(this.target);
        }
        return this.target;
    }

    protected update (changedProperties: PropertyValues) {
        super.update(changedProperties);

        const target = this.getTarget();
        if (!target)
            return;

        target.style.display = this.active ? '' : 'none';
    }
}
