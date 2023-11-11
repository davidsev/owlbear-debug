import OBR from '@owlbear-rodeo/sdk';
import './ItemsTab/ItemsList/style.scss';
import { ItemsTab } from './ItemsTab';

export class ActionPanel {

    public readonly div: HTMLDivElement = document.createElement('div');
    private readonly itemsWrapper: HTMLDivElement = document.createElement('div');
    public readonly itemsTab: ItemsTab;

    private constructor () {
        document.body.replaceChildren(this.div);
        this.div.append(this.itemsWrapper);

        this.itemsTab = new ItemsTab(this);
        this.itemsWrapper.append(this.itemsTab.div);
    }

    public static init () {
        OBR.onReady(() => new ActionPanel());
    }
}
