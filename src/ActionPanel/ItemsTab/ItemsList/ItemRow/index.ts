import { WrappedItem } from '../../../../ItemManager/WrappedItem';
import OBR, { Item } from '@owlbear-rodeo/sdk';
import { loadTemplate } from '../../../../Util/UI/loadTemplate';
import template from './template.handlebars';
import { findNode } from '../../../../Util/UI/findNode';
import { ItemsList } from '../index';

const LayerIconsMap: { [key: string]: string } = {
    'MAP': 'Map',
    'DRAWING': 'Drawing',
    'PROP': 'Prop',
    'MOUNT': 'Mount',
    'CHARACTER': 'Character',
    'ATTACHMENT': 'Attachment',
    'NOTE': 'Note',
    'TEXT': 'Text',
};

export class ItemRow {
    public readonly div: HTMLDivElement;
    private readonly layerIconDiv: HTMLDivElement;
    private readonly nameDiv: HTMLDivElement;
    private readonly iconsDiv: HTMLDivElement;
    private readonly selectButton: HTMLDivElement;
    private readonly deleteButton: HTMLDivElement;

    constructor (public readonly itemsList: ItemsList | null, public readonly wrappedItem: WrappedItem) {
        this.div = loadTemplate(template());
        this.layerIconDiv = findNode(this.div, '.ItemRow-LayerIcon', HTMLDivElement);
        this.nameDiv = findNode(this.div, '.ItemRow-Name', HTMLDivElement);
        this.iconsDiv = findNode(this.div, '.ItemRow-Icons', HTMLDivElement);
        this.selectButton = findNode(this.div, '.ItemRow-SelectButton', HTMLDivElement);
        this.deleteButton = findNode(this.div, '.ItemRow-DeleteButton', HTMLDivElement);

        this.hookEvents();
        this.update();
    }

    private get item (): Item {
        return this.wrappedItem.item;
    }

    private hookEvents (): void {
        // Update when our item changes.
        this.wrappedItem.addEventListener('update', this.update.bind(this), { 'signal': this.wrappedItem.abortSignal });
        this.wrappedItem.addEventListener('selected', this.update.bind(this), { 'signal': this.wrappedItem.abortSignal });
        this.wrappedItem.addEventListener('deselected', this.update.bind(this), { 'signal': this.wrappedItem.abortSignal });
        this.wrappedItem.addEventListener('childrenChanged', this.update.bind(this), { 'signal': this.wrappedItem.abortSignal });

        // Make the buttons work.
        this.selectButton.addEventListener('click', () => {OBR.player.select([this.item.id]);});
        this.deleteButton.addEventListener('click', () => {OBR.scene.items.deleteItems([this.item.id]);});

        // Show the details
        this.nameDiv.addEventListener('click', this.openDetails.bind(this));
        this.iconsDiv.addEventListener('click', this.openDetails.bind(this));
    }

    public remove (): void {
        this.div.remove();
    }

    private icon (name: string): string {
        return '<i class="ItemIcon ItemIcon-' + name + '"></i>';
    }

    private update (): void {
        this.nameDiv.innerText = this.wrappedItem.displayName;
        this.div.style.background = this.wrappedItem.selected ? '#FF000033' : '';

        this.layerIconDiv.innerHTML = '';
        if (this.item.layer in LayerIconsMap)
            this.layerIconDiv.innerHTML = this.icon(LayerIconsMap[this.item.layer]);

        this.iconsDiv.innerHTML = '';
        if (!this.item.visible)
            this.iconsDiv.innerHTML += this.icon('Hidden');
        if (this.item.locked)
            this.iconsDiv.innerHTML += this.icon('Locked');
        if (this.item.disableHit)
            this.iconsDiv.innerHTML += this.icon('DisabledHit');
        if (Object.keys(this.item.metadata).length)
            this.iconsDiv.innerHTML += this.icon('Metadata');
    }

    private openDetails (): void {
        if (this.itemsList) {
            this.itemsList.itemsTab.showDetails(this.wrappedItem);
        }
    }

    public set indent (indent: number) {
        this.div.style.paddingLeft = `${indent * 15}px`;
    }
}
