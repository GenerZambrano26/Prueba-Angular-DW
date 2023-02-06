import { Component, OnInit } from '@angular/core';
import { EventoFactura, FacturaDTO } from './models/facturacion-pages.models';
import { FacturacionPagesService } from './services/facturacion-pages.service';
import { EventoTipoEnum } from './models/enum/evento.enum';

@Component({
    selector: 'app-facturacion-pages',
    templateUrl: './facturacion-pages.component.html',
    styleUrls: ['./facturacion-pages.component.css']
})
export class FacturacionPagesComponent implements OnInit {

    showPopup: boolean = false;
    EsEditar: boolean = false;
    TituloPopup: string = 'is simply dummy text of the printing and typesetting industry.';

    dataFactura?: FacturaDTO = new FacturaDTO();
    dataFacturas: FacturaDTO[] = [];

    constructor(private _facturacionService: FacturacionPagesService) { }

    ngOnInit(): void {
        this.CargarFacturas();
    }

    private CargarFacturas(): void {
        this._facturacionService.ListarFacturas().subscribe({
            next: (response: FacturaDTO[]) => {
                this.dataFacturas = response;
            },
            error: (error: any) => {
                console.log(error);
            }
        });        
    }

    EventoFacturaRecibe(event: EventoFactura) {
        switch (event.evento) {
            case EventoTipoEnum.AGREGAR:
                this.showPopup = true;
                this.dataFactura = undefined;
                this.TituloPopup = 'Agregar Factura';
                break;
            case EventoTipoEnum.EDITAR:
                this.showPopup = true;
                this.dataFactura = event.data;
                this.TituloPopup = 'Factura ' + this.dataFactura?.tercero.nombreCompleto;
                break;
            case EventoTipoEnum.CARGAR:
                this.CargarFacturas();
                break;
            case EventoTipoEnum.CERRAR:
                this.showPopup = false;
            break;
        }  
    }
}
