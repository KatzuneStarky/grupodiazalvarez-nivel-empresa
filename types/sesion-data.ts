export interface DeviceInfo {
    userAgent: string;
    platform: string;
    screenResolution?: string;
    browser?: string;
    os?: string;
    deviceType?: 'Movil' | 'Tablet' | 'Computadora';
}

export interface SessionData {
    userId: string;
    refreshToken: string;
    deviceId: string;
    lastActive: string;
    deviceInfo: DeviceInfo;
    ipAddress?: string;
    location?: {
        city?: string;
        country?: string;
    };
    currentSession?: boolean;
    status?: 'active' | 'expired';
}