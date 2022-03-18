import type { DeepReadonly } from '@tezospayments/common';

import type { enUS } from '../../../localization/en-US';

type LanguageIds = typeof enUS['id'];

export type Language = DeepReadonly<{
    readonly id: LanguageIds;
    readonly resources: typeof enUS['resources'];
}>;

type CheckLanguage<TLanguage extends Language> = TLanguage & never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LanguageChecking = CheckLanguage<typeof enUS>;
