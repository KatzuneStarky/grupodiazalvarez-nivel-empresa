import { ProductoSAT, UnidadSAT } from "@/types/catalogos-sat";

export interface ProductoInventario {
  id: string;                
  productoSAT: ProductoSAT;  
  unidad: UnidadSAT;         
  cantidad: number;          
  minimo?: number;           
  maximo?: number;     
  inventarioId: string;      
  fechaUltimaEntrada?: Date; 
  fechaUltimaSalida?: Date;  
  notas?: string;            
}