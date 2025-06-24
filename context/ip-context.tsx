"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getIpAddress } from "@/functions/get-ip-address";
import { IpAddressContextType } from "@/types/ip-context";

const initialState: IpAddressContextType = {
    ipAddress: null,
    isLoading: true,
    error: null,
};

const IpAddressContext = createContext<IpAddressContextType>(initialState);

export const IpAddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<IpAddressContextType>(initialState);

    useEffect(() => {
        let isMounted = true;

        if (process.env.NODE_ENV === "development") {
            console.log("🟢 IpAddressProvider montado");
        }

        const fetchIpAddress = async () => {
            try {
                const ip = await getIpAddress();
                if (isMounted) {
                    if (process.env.NODE_ENV === "development") {
                        console.log("🌐 IP seteada en contexto:", ip);
                    }

                    setState({
                        ipAddress: ip || "No se pudo obtener",
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error al obtener IP:", err);
                    setState({
                        ipAddress: null,
                        isLoading: false,
                        error: "Error al obtener la dirección IP",
                    });
                }
            }
        };

        fetchIpAddress();

        return () => {
            isMounted = false;
        };
    }, []);

    return <IpAddressContext.Provider value={state}>{children}</IpAddressContext.Provider>;
};

export const useIpAddress = () => useContext(IpAddressContext);