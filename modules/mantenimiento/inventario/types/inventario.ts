import { ProductoInventario } from "./producto-inventario";

export interface Inventario {
  id: string;                    
  nombre: string;                
  ubicacion?: string;             
  productos: ProductoInventario[];
  fechaActualizacion: Date;   
}