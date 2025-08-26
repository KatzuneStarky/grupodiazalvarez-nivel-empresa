export const fetchData = async <T>(fetchFunction: (id: string) => Promise<T>, id: string): Promise<T | null> => {
    try {
        return await fetchFunction(id);
    } catch (error) {
        console.error(`Error fetching data:`, error);
        return null;
    }
};