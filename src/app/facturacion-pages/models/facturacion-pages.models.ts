import { EventoTipoEnum } from "./enum/evento.enum";

export class FacturaDTO {
    cod?: string;
    fecha: Date | string;
    total: number;
    codTercero: string;
    tercero: TerceroDTO;
    detalle: FacturaDetalleDTO[];
    constructor() {
        this.cod = '';
        this.fecha = new Date();
        this.total = 0;
        this.codTercero = '';
        this.tercero = new TerceroDTO();
        this.detalle = [];
    }
}

export class FacturaDetalleDTO {
    cod?: string;
    codfactura?: string;
    codproducto: string;
    producto: string;
    subtotal: number;
    cantidad: number;
    precio: number;

    constructor() {
        this.cod = '';
        this.codproducto = '';
        this.subtotal = 0;
        this.cantidad = 0;
        this.precio = 0;
        this.producto = '';
        this.codfactura = '';
    }
}

export class TerceroDTO {
    cod: string;
    nombreCompleto: string;
    edad: number;
    identificacion: string;
    direccion: string;
    constructor() {
        this.cod = '';
        this.nombreCompleto = '';
        this.edad = 0;
        this.identificacion = '';
        this.direccion = ''; 
    }
}

export class ProductoDTO {
    cod: number;
    descripcion: string;
    precio: number;
    stock: number;
    constructor() {
        this.cod = 0;
        this.descripcion = '';
        this.precio = 0;
        this.stock = 0;
    }
}

export class EventoFactura {
    evento: EventoTipoEnum;
    data?: FacturaDTO;
    constructor() {
        this.evento = EventoTipoEnum.AGREGAR;
        this.data = new FacturaDTO();
    }
}