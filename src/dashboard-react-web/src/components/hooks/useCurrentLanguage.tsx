import { enUS } from '../../localization/en-US';
import { Language } from '../../models/system';

export const useCurrentLanguage = (): Language => {
    // TODO: implement language change
    return enUS;
};

export const useCurrentLanguageResources = () => {
    const currentLanguage = useCurrentLanguage();

    return currentLanguage.resources;
};
