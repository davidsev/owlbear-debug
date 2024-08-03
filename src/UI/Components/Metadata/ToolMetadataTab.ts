import { customElement, query } from 'lit/decorators.js';
import { html, PropertyValueMap } from 'lit';
import { BaseElement } from '../../BaseElement';
import { baseCSS } from '../../baseCSS';
import style from './ToolMetadataTab.css';
import { ToolMetadataEditor } from './ToolMetadataEditor';

@customElement('tool-metadata-tab')
export class ToolMetadataTab extends BaseElement {

    static styles = baseCSS(style);

    @query('tool-metadata-editor')
    private accessor metadataEditor: ToolMetadataEditor | null = null;
    @query('input#toolId')
    private accessor input: HTMLInputElement | null = null;

    protected firstUpdated (_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
    }

    render () {
        return html`
            <main>
                <div class="row">
                    <label for="toolId">Tool&nbsp;ID:</label>
                    <input type="text" id="toolId"/>
                    <button type="submit" @click="${this.loadMetadata}">Load</button>
                </div>
                <tool-metadata-editor></tool-metadata-editor>
            </main>
        `;
    }

    private loadMetadata () {
        if (this.metadataEditor && this.input)
            this.metadataEditor.toolId = this.input.value;
    }

}

