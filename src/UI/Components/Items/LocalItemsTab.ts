import { BaseItemTab } from './BaseItemTab';
import { customElement } from 'lit/decorators.js';
import { ItemManager } from '../../../ItemManager';

@customElement('local-items-tab')
export class LocalItemsTab extends BaseItemTab {

    constructor () {
        super(ItemManager.getLocalInstance());
    }
}

