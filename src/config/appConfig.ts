import type { DeepReadonly } from '../models/core';

export type AppConfig = DeepReadonly<{
    app: {
        publicUrl: string;
        name: string;
        title: string;
    },
    routers: {
        main: string;
    }
}>;
