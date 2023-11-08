export const mirror = (source, destination, overrides = {}) => {
    return source.subscribe(mirrorObserver(destination, overrides));
};
export const mirrorObserver = (destination, overrides = {}) => {
    return {
        ...{
            next: (value) => { destination.next(value); },
            error: (error) => {
                destination.error(error);
                destination.complete();
            },
            complete: () => { destination.complete(); },
        },
        ...overrides
    };
};
//# sourceMappingURL=mirror.js.map