export const useOrigin = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return origin
}

export const useRedirectionUrl = (companyAddress?: string, area?: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    let url = origin;

    if (companyAddress) {
        url += `/${companyAddress}`;
    }
    if (area) {
        url += `/${area}`;
    }
    return url;
}

export const usePathnameRedirect = (targetPath: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;
}