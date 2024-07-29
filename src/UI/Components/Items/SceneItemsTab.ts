import { BaseItemTab } from './BaseItemTab';
import { customElement } from 'lit/decorators.js';
import { ItemManager } from '../../../ItemManager';

@customElement('scene-items-tab')
export class SceneItemsTab extends BaseItemTab {

    constructor () {
        super(ItemManager.getSceneInstance());
    }
}
