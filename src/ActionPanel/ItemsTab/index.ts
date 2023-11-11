import { ItemsList } from './ItemsList';
import { ItemDetails } from './ItemDetails';
import { ActionPanel } from '../index';
import { WrappedItem } from '../../ItemManager/WrappedItem';

export class ItemsTab {
    public readonly div: HTMLDivElement = document.createElement('div');
    private readonly listDiv: HTMLDivElement = document.createElement('div');
    private readonly detailsDiv: HTMLDivElement = document.createElement('div');
    private readonly itemList: ItemsList = new ItemsList(this);
    private readonly itemDetails: ItemDetails = new ItemDetails(this);

    constructor (public readonly actionPanel: ActionPanel) {
        this.listDiv.append(this.itemList.div);
        this.detailsDiv.append(this.itemDetails.div);
        this.div.append(this.listDiv, this.detailsDiv);

        this.showList();
    }

    public showList (): void {
        this.listDiv.style.display = 'block';
        this.detailsDiv.style.display = 'none';
    }

    public showDetails (item?: WrappedItem): void {
        this.itemDetails.wrappedItem = item;
        this.listDiv.style.display = 'none';
        this.detailsDiv.style.display = 'block';
    }
}
