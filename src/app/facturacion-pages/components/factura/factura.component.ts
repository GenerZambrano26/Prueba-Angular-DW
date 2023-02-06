import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { FacturacionPagesService } from '../../services/facturacion-pages.service';
import { EventoFactura, FacturaDTO } from '../../models/facturacion-pages.models';
import { EventoTipoEnum } from '../../models/enum/evento.enum';

@Component({
    selector: "app-factura",
    templateUrl: "./factura.component.html",
    styleUrls: ["./factura.component.css"],
})
export class FacturaComponent implements OnInit, OnChanges {

    constructor(private _facturacionService: FacturacionPagesService) { }

    @Input() dataFacturasInput: FacturaDTO[] = [];
    dataFacturas: FacturaDTO[] = [];
    @Output() eventoFactura = new EventEmitter<EventoFactura>();

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        this.dataFacturas = this.dataFacturasInput;
    }

    ModalAgregarFactura(): void {
        this.eventoFactura.emit({ evento: EventoTipoEnum.AGREGAR });
    }

    ModalEditarFactura(factura: FacturaDTO): void {
        this.eventoFactura.emit({ evento: EventoTipoEnum.EDITAR, data: factura });
    }

    EliminarFactura(codFactura: string): void {
        Swal.fire({
            title: "¿Seguro desea eliminar la factura?",
            text: "",
            icon: "warning",
            cancelButtonText: "Cancelar",
            customClass: { popup: "swal-height27" },
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
        }).then((result) => {
            if (result.value == true) {
                this._facturacionService.EliminarFactura(codFactura).subscribe({
                    next: (response) => {
                        this.dataFacturas = this.dataFacturas.filter((f) => f.cod != codFactura);
                        Swal.fire(
                            "Eliminada!",
                            "La Factura ha sido eliminada",
                            "success"
                        );
                    },
                    error: (error) => {
                        Swal.fire("Error al eliminar!", `${error.error}`, "error");
                    }
                });
            } else {
                return;
            }
        });
    }
}
