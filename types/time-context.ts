export interface TimeContextType {
    time: Date;
    is24Hour: boolean;
    setIs24Hour: (is24Hour: boolean) => void;
    formattedTime: string;
}