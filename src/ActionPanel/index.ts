import OBR from '@owlbear-rodeo/sdk';
import './ItemsTab/ItemsList/style.scss';
import { ItemsTab } from './ItemsTab';
import { SceneMetadataTab } from './SceneMetadataTab';
import { PlayerMetadataTab } from './PlayerMetadataTab';
import { RoomMetadataTab } from './RoomMetadataTab';
import { loadTemplate } from '../Util/UI/loadTemplate';
import template from './index.handlebars';
import { findNode } from '../Util/UI/findNode';
import { ItemManager } from '../ItemManager';

export class ActionPanel {

    public readonly div: HTMLDivElement;
    private readonly sceneItemsButton: HTMLButtonElement;
    private readonly sceneItemsWrapper: HTMLDivElement = document.createElement('div');
    public readonly sceneItemsTab: ItemsTab;
    private readonly localItemsButton: HTMLButtonElement;
    private readonly localItemsWrapper: HTMLDivElement = document.createElement('div');
    public readonly localItemsTab: ItemsTab;
    private readonly sceneMetadataButton: HTMLButtonElement;
    private readonly sceneMetadataWrapper: HTMLDivElement = document.createElement('div');
    public readonly sceneMetadataTab: SceneMetadataTab;
    private readonly userMetadataButton: HTMLButtonElement;
    private readonly userMetadataWrapper: HTMLDivElement = document.createElement('div');
    private readonly userMetadataTab: PlayerMetadataTab;
    private readonly roomMetadataButton: HTMLButtonElement;
    private readonly roomMetadataWrapper: HTMLDivElement = document.createElement('div');
    private readonly roomMetadataTab: RoomMetadataTab;

    private constructor () {
        this.div = loadTemplate(template());

        document.body.replaceChildren(this.div);
        this.div.append(this.sceneItemsWrapper);
        this.div.append(this.localItemsWrapper);
        this.div.append(this.sceneMetadataWrapper);
        this.div.append(this.userMetadataWrapper);
        this.div.append(this.roomMetadataWrapper);

        this.sceneItemsButton = findNode(this.div, 'button#SceneItemsButton', HTMLButtonElement);
        this.sceneItemsTab = new ItemsTab(this, ItemManager.getSceneInstance());
        this.sceneItemsWrapper.append(this.sceneItemsTab.div);

        this.localItemsButton = findNode(this.div, 'button#LocalItemsButton', HTMLButtonElement);
        this.localItemsTab = new ItemsTab(this, ItemManager.getLocalInstance());
        this.localItemsWrapper.append(this.localItemsTab.div);

        this.sceneMetadataButton = findNode(this.div, 'button#SceneMetadataButton', HTMLButtonElement);
        this.sceneMetadataTab = new SceneMetadataTab(this);
        this.sceneMetadataWrapper.append(this.sceneMetadataTab.div);
        this.sceneMetadataWrapper.style.display = 'none';

        this.userMetadataButton = findNode(this.div, 'button#UserMetadataButton', HTMLButtonElement);
        this.userMetadataTab = new PlayerMetadataTab(this);
        this.userMetadataWrapper.append(this.userMetadataTab.div);
        this.userMetadataWrapper.style.display = 'none';

        this.roomMetadataButton = findNode(this.div, 'button#RoomMetadataButton', HTMLButtonElement);
        this.roomMetadataTab = new RoomMetadataTab(this);
        this.roomMetadataWrapper.append(this.roomMetadataTab.div);
        this.roomMetadataWrapper.style.display = 'none';

        this.hookDomEvents();
    }

    public static init () {
        OBR.onReady(() => new ActionPanel());
    }

    private hookDomEvents () {
        this.userMetadataButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'block';
            this.sceneMetadataWrapper.style.display = 'none';
            this.sceneItemsWrapper.style.display = 'none';
            this.localItemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.sceneMetadataButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'block';
            this.sceneItemsWrapper.style.display = 'none';
            this.localItemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.sceneItemsButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'none';
            this.sceneItemsWrapper.style.display = 'block';
            this.localItemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.localItemsButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'none';
            this.sceneItemsWrapper.style.display = 'none';
            this.localItemsWrapper.style.display = 'block';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.roomMetadataButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'none';
            this.sceneItemsWrapper.style.display = 'none';
            this.localItemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'block';
        });
    }
}
