import OBR from '@owlbear-rodeo/sdk';
import './ItemsTab/ItemsList/style.scss';
import { ItemsTab } from './ItemsTab';
import { SceneMetadataTab } from './SceneMetadataTab';
import { UserMetadataTab } from './UserMetadataTab';
import { RoomMetadataTab } from './RoomMetadataTab';
import { loadTemplate } from '../Util/UI/loadTemplate';
import template from './index.handlebars';
import { findNode } from '../Util/UI/findNode';

export class ActionPanel {

    public readonly div: HTMLDivElement;
    private readonly itemsButton: HTMLButtonElement;
    private readonly itemsWrapper: HTMLDivElement = document.createElement('div');
    public readonly itemsTab: ItemsTab;
    private readonly sceneMetadataButton: HTMLButtonElement;
    private readonly sceneMetadataWrapper: HTMLDivElement = document.createElement('div');
    public readonly sceneMetadataTab: SceneMetadataTab;
    private readonly userMetadataButton: HTMLButtonElement;
    private readonly userMetadataWrapper: HTMLDivElement = document.createElement('div');
    private readonly userMetadataTab: UserMetadataTab;
    private readonly roomMetadataButton: HTMLButtonElement;
    private readonly roomMetadataWrapper: HTMLDivElement = document.createElement('div');
    private readonly roomMetadataTab: RoomMetadataTab;

    private constructor () {
        this.div = loadTemplate(template());

        document.body.replaceChildren(this.div);
        this.div.append(this.itemsWrapper);
        this.div.append(this.sceneMetadataWrapper);
        this.div.append(this.userMetadataWrapper);
        this.div.append(this.roomMetadataWrapper);

        this.itemsButton = findNode(this.div, 'button#ItemsButton', HTMLButtonElement);
        this.itemsTab = new ItemsTab(this);
        this.itemsWrapper.append(this.itemsTab.div);

        this.sceneMetadataButton = findNode(this.div, 'button#SceneMetadataButton', HTMLButtonElement);
        this.sceneMetadataTab = new SceneMetadataTab(this);
        this.sceneMetadataWrapper.append(this.sceneMetadataTab.div);
        this.sceneMetadataWrapper.style.display = 'none';

        this.userMetadataButton = findNode(this.div, 'button#UserMetadataButton', HTMLButtonElement);
        this.userMetadataTab = new UserMetadataTab(this);
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
            this.itemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.sceneMetadataButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'block';
            this.itemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.itemsButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'none';
            this.itemsWrapper.style.display = 'block';
            this.roomMetadataWrapper.style.display = 'none';
        });
        this.roomMetadataButton.addEventListener('click', () => {
            this.userMetadataWrapper.style.display = 'none';
            this.sceneMetadataWrapper.style.display = 'none';
            this.itemsWrapper.style.display = 'none';
            this.roomMetadataWrapper.style.display = 'block';
        });
    }
}
