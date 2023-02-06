export interface CrearFacturaRequest {
    fecha: Date | string;
    subtotal: number;
    total: number;
    codtercero: string;
    detalle: CrearDetalleRequest[];
}

export interface CrearDetalleRequest {
    subtotal: number;
    cantidad: number;
    precio: number;
    codproducto: string;
}

export interface ActualizarFacturaRequest {
    cod?: string;
    fecha: Date | string;
    subtotal: number;
    total: number;
    codtercero: string;
    detalle: ActualizarDetalleRequest[];
}

export interface ActualizarDetalleRequest {
    cod?: string;
    subtotal: number;
    cantidad: number;
    codfactura?: string;
    codproducto: string;
}

export class Resultado<T> {
    status: boolean;
    data: T;
}