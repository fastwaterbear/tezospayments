export interface PublicEventEmitter<T extends readonly unknown[]> {
    addListener(listener: (...args: T) => void): this;
    removeListener(listener: (...args: T) => void): this;
    removeAllListeners(): this;
}
export declare class EventEmitter<T extends readonly unknown[]> implements PublicEventEmitter<T> {
    private listeners;
    addListener(listener: (...args: T) => void): this;
    removeListener(listener: (...args: T) => void): this;
    removeAllListeners(): this;
    emit(...args: T): void;
}
