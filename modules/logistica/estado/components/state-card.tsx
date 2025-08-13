import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";
import { getStateDetails } from "../constants/status";

export const StateCard = ({ state, count }: { state: EstadoEquipos, count: number }) => {
    const { bgColor, icon: IconComponent, textColor } = getStateDetails(state);

    return (
        <div className={bgColor + " rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105"}>
            <div className="flex items-center justify-between">
                <div className={textColor + " text-xl font-bold"}>
                    {state.replaceAll("_", " ")}
                </div>
                <IconComponent className={textColor + " text-2xl"} />
            </div>
            <div className={textColor + " text-4xl font-bold mt-4"}>
                {count}
            </div>
            <div className={textColor + " text-sm mt-2 opacity-75"}>
                Equipos totales
            </div>
        </div>
    );
};