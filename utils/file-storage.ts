export const MAX_STORAGE = 1 * 1024 * 1024 * 1024;

export const formatStorage = (bytes: number) => {
    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
};

export const parseStorage = (bytes: number) => {
    if (bytes < 1024 * 1024) {
        return { value: bytes / 1024, unit: 'KB' };
    } else if (bytes < 1024 * 1024 * 1024) {
        return { value: bytes / (1024 * 1024), unit: 'MB' };
    } else {
        return { value: bytes / (1024 * 1024 * 1024), unit: 'GB' };
    }
};