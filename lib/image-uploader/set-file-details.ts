export const setFileDetailsFromFile = (
    file: File,
    setFileDetails: React.Dispatch<React.SetStateAction<{
        name: string;
        size: number;
        type: string;
        lastModified: Date;
    } | null>>
) => {
    setFileDetails({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
    });
};