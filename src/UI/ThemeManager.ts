import { awaitScene } from '@davidsev/owlbear-utils/js/awaitScene';
import OBR, { Theme } from '@owlbear-rodeo/sdk';
import { TypedEventTarget } from 'typescript-event-target';

interface EventMap {
    change: Event;
}

export class ThemeManager extends TypedEventTarget<EventMap> {
    private static instance: ThemeManager = new ThemeManager();
    public darkMode: boolean = false;

    private constructor () {
        super();
        awaitScene().then(() => {
            OBR.theme.onChange(this.updateTheme.bind(this));
            OBR.theme.getTheme().then(this.updateTheme.bind(this));
        });
    }

    public static getInstance (): ThemeManager {
        return ThemeManager.instance;
    }

    private updateTheme (theme: Theme): void {
        this.darkMode = theme.mode === 'DARK';

        document.body.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
        document.body.classList.toggle('jse-theme-dark', this.darkMode);

        this.dispatchTypedEvent('change', new Event('change'));
    }
}
