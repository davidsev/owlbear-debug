import { Metadata } from '@owlbear-rodeo/sdk';
import { isMenuButton, JSONEditor, MenuButton, MenuItem, Mode, TextContent } from 'vanilla-jsoneditor';

export class JsonEditor {
    private readonly saveCallback: (newJson: Metadata) => void;
    public div: HTMLDivElement = document.createElement('div');
    private editor: JSONEditor;

    constructor (saveCallback: (newJson: Metadata) => void, json: Metadata = {}) {
        this.saveCallback = saveCallback;

        this.editor = new JSONEditor({
            target: this.div,
            props: {
                content: { json: json },
                mode: Mode.text,
                onRenderMenu: this.buildMenu.bind(this),
            },
        });
    }

    private buildMenu (menuItems: MenuItem[]): MenuItem[] {

        // Sort the items by name
        const itemsByName: Map<string, MenuButton> = new Map();
        for (const item of menuItems) {
            if (isMenuButton(item)) {
                if (item.text)
                    itemsByName.set(item.text, item);
                else if (item.icon)
                    itemsByName.set(item.icon.iconName, item);
            }
        }

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
            saveButton,
        ].filter((i) => i) as MenuItem[]; // Filter out undefined items.
    }

    private saveButtonClicked (): void {
        const content = this.editor.get();
        if (!content.hasOwnProperty('text'))
            return;

        const json = JSON.parse((content as TextContent).text);
        if (json === null || typeof json !== 'object')
            return;

        this.saveCallback(json);
    }

    public setJson (json: Metadata): void {
        this.editor.set({ json: json });
    }
}
