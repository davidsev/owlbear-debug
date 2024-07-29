import { html, PropertyDeclaration, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseElement } from '../BaseElement';
import { baseCSS } from '../baseCSS';
import { isMenuButton, JSONEditor, MenuButton, MenuItem, Mode } from 'vanilla-jsoneditor';

@customElement('json-editor')
export class JsonEditor extends BaseElement {

    static styles = baseCSS();
    private jsonEditor?: JSONEditor;

    @property({ type: Object })
    accessor json: object = {};
    @property({ type: Boolean })
    accessor readonly: boolean = false;

    @query('main > div')
    accessor div!: HTMLElement;

    render () {
        return html`
            <main>
                <div class="${this.darkMode ? 'jse-theme-dark' : ''}"></div>
            </main>
        `;
    }

    // Once our div is in the DOM, create the editor
    protected firstUpdated (_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);

        this.jsonEditor = new JSONEditor({
            target: this.div,
            props: {
                content: { json: this.json },
                mode: Mode.text,
                onRenderMenu: this.buildMenu.bind(this),
                readOnly: this.readonly,
            },
        });
    }

    // When the attributes change, update the editor
    requestUpdate (name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration) {
        super.requestUpdate(name, oldValue, options);

        if (name === 'json' && this.jsonEditor)
            this.jsonEditor.set({ json: this.json });

        if (name === 'readonly' && this.jsonEditor) {
            this.jsonEditor.updateProps({ readOnly: this.readonly });
            this.jsonEditor.refresh(); // Redraw the menu
        }
    }

    // Build the menu
    private buildMenu (menuItems: MenuItem[]): MenuItem[] {
        // Key the items by name
        const itemsByName: Map<string, MenuButton> = new Map();
        for (const item of menuItems) {
            if (isMenuButton(item)) {
                if (item.text)
                    itemsByName.set(item.text, item);
                else if (item.icon)
                    itemsByName.set(item.icon.iconName, item);
            }
        }

        // Make a save button
        const saveButton = {
            type: 'button',
            onClick: this.saveButtonClicked.bind(this),
            text: 'Save',
            className: 'jse-group-button jse-first jse-last',
        };

        // Fix the "tree" button
        const treeButton = itemsByName.get('tree');
        if (treeButton)
            treeButton.className = 'jse-group-button jse-last';

        // Take just the ones we want
        return [
            itemsByName.get('text'),
            itemsByName.get('tree'),
            { type: 'separator' },
            itemsByName.get('jsoneditor-format'),
            itemsByName.get('arrow-rotate-left'),
            itemsByName.get('arrow-rotate-right'),
            { type: 'space' },
            this.readonly ? undefined : saveButton,
        ].filter((i) => i) as MenuItem[];

    }

    // When the editor is saved, update the attribute and dispatch an event
    private saveButtonClicked (e: Event) {
        const content = this.jsonEditor?.get();
        if (!content || !('text' in content))
            return;

        const json = JSON.parse(content.text);
        if (!(json instanceof Object))
            return;

        this.json = json;
        this.dispatchEvent(new Event('change'));
    }
}
