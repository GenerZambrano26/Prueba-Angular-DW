import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EventoFactura, FacturaDetalleDTO, FacturaDTO, ProductoDTO, TerceroDTO } from '../../models/facturacion-pages.models';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ActualizarFacturaRequest, CrearFacturaRequest } from '../../request/ModelRequest';
import { FacturacionPagesService } from '../../services/facturacion-pages.service';
import { DxFormComponent } from 'devextreme-angular';
import { EventoTipoEnum } from '../../models/enum/evento.enum';

@Component({
    selector: "app-factura-detalle",
    templateUrl: "./factura-detalle.component.html",
    styleUrls: ["./factura-detalle.component.css"],
})
export class FacturaDetalleComponent implements OnInit, OnChanges {

    @ViewChild(DxFormComponent, { static: false }) formFacturaValidate: DxFormComponent; 
    @Input() facturaData?: FacturaDTO;
    @Output() eventoFactura = new EventEmitter<EventoFactura>();

    dataTerceros: TerceroDTO[] = [];
    dataProductos: ProductoDTO[] = [];
    dataProductoSeleccionado: ProductoDTO = new ProductoDTO();

    formFactura: FacturaDTO = new FacturaDTO();
    formDetalleFactura: FacturaDetalleDTO = new FacturaDetalleDTO();

    enEdicion: boolean = false;
    ListaDetalleProductos: FacturaDetalleDTO[] = [];

    constructor(private _facturacionService: FacturacionPagesService) { }

    ngOnInit(): void {
        this.CargarClientes();
        this.CargarProductos();
        this.formFactura.fecha = new Date();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.cargarFacturaEditar(this.facturaData)
    }

    cargarFacturaEditar(dataFactura?: FacturaDTO) {
        if (!dataFactura || dataFactura.detalle.length == 0) return;

        this.formFactura = {
            ...dataFactura
        };

        this.ListaDetalleProductos = [];
        this.ListaDetalleProductos.push(...dataFactura.detalle);
        this.enEdicion = true;
        this.CalcularSubtotalFactura();
    }

    CargarProductos(): void {
        this._facturacionService.ListarProductos().subscribe({
            next: (response: ProductoDTO[]) => {
                this.dataProductos = response;
            },
            error: (error: HttpErrorResponse) => {
                this.showToast(error.error, 'error');
            }
        });
    }

    CargarClientes(): void {
        this._facturacionService.ListarTerceros().subscribe({
            next: (response: TerceroDTO[]) => {
                this.dataTerceros = response;
                this.showToast("Lista cargada correctamente",'success')
            },
            error: (error: HttpErrorResponse) => {
                this.showToast(error.error, 'error');
            }
        });
    }

    SelectProductoChange = (event: any) => {
        if (event.selectedItem) {
            this.dataProductoSeleccionado = event.selectedItem;
            this.formDetalleFactura.cantidad = 1;
            this.CalcularSubtotalDetalle();
        }else {
            this.formDetalleFactura.subtotal = 0;
            this.formDetalleFactura.cantidad = 0;
        }
    }

    CalcularSubtotalDetalle(): void{
        if(this.formDetalleFactura.cantidad != null && this.formDetalleFactura.cantidad > 0) {
            this.formDetalleFactura.subtotal = this.dataProductoSeleccionado.precio * this.formDetalleFactura.cantidad;
        }
    }

    CantidadChange(cantidad: number): void {
        if (this.dataProductoSeleccionado != null) {
            this.CalcularSubtotalDetalle();
        }
    }

    CalcularSubtotalFactura(): void {
        if (this.ListaDetalleProductos.length > 0) {
            let subtotal = 0;
            this.ListaDetalleProductos.forEach(d => {
                subtotal += d.subtotal;
            });
            this.formFactura.total = subtotal;
        } else {
            this.formFactura.total = 0;
        }
    }

    AgregarProductoDetalle(): void {        
        if(!this.formDetalleFactura.codproducto || this.formDetalleFactura.codproducto == null || this.formDetalleFactura.codproducto == '') {
            this.showToast("Debe seleccionar un producto", 'error');
        }

        if(!this.formDetalleFactura.cantidad || this.formDetalleFactura.cantidad == null || this.formDetalleFactura.cantidad == 0) {
            this.showToast("Debe ingresar un valor en la cantidad del producto", 'error');
        }

        if (this.ListaDetalleProductos.length > 0) {

            let hayDetalle = this.ListaDetalleProductos.find(d => d.codproducto == this.formDetalleFactura.codproducto);            
            if (hayDetalle) {                

                let posicion = this.ListaDetalleProductos.indexOf(hayDetalle);
                let totalCantidad = hayDetalle.cantidad + this.formDetalleFactura.cantidad;

                if (this.dataProductoSeleccionado.stock >= totalCantidad) {
                    let subtotal = hayDetalle.precio * totalCantidad;
                    this.ListaDetalleProductos[posicion].cantidad = totalCantidad;
                    this.ListaDetalleProductos[posicion].subtotal = subtotal;
                } else {
                    this.showToast("Supera la cantidad del Stock", 'error');
                }
            } else {
                this.LlenarListaDetalle();
            }
        } else {
            this.LlenarListaDetalle();
        }
        this.CalcularSubtotalFactura();
    }

    LlenarListaDetalle(): void {
        if (this.dataProductoSeleccionado.stock >= this.formDetalleFactura.cantidad) {
            this.ListaDetalleProductos.push(
                {
                    codproducto: this.formDetalleFactura.codproducto,
                    producto: this.dataProductoSeleccionado.descripcion,
                    subtotal: this.formDetalleFactura.subtotal,
                    precio: this.dataProductoSeleccionado.precio,
                    cantidad: this.formDetalleFactura.cantidad,
                });
        }
    }

    EliminarProductoFacturaDetalle(event: any): void {
        this.ListaDetalleProductos = this.ListaDetalleProductos.filter(x => x.codproducto != event.key.codproducto);
        this.CalcularSubtotalFactura();
        if (this.enEdicion && event.key.cod) {
            this._facturacionService.EliminarDetalle(event.key.cod).subscribe({
                next: (response) => {
                    this.showToast('El producto ha sido eliminado', 'success');
                    this.eventoFactura.emit({evento: EventoTipoEnum.CARGAR})
                },
                error: (error) => {
                    this.showToast(error.error, 'error');
                }
            });
        }
    }

    AgregarFactura(): void {
        let formValidate = this.formFacturaValidate.instance.validate();

        if (!formValidate.isValid) {
            this.showToast('Campos Obligatorios', 'error');
            return;
        }
        if (this.ListaDetalleProductos.length == 0) {
            this.showToast('Debe agregar el detalle', 'error');
            return;
        }

        let dataFactura: CrearFacturaRequest = {
            fecha: this.formFactura.fecha,
            subtotal: this.formFactura.total,
            total: this.formFactura.total,
            codtercero: this.formFactura.codTercero,
            detalle: this.ListaDetalleProductos.map((detalle: FacturaDetalleDTO) => {
                return {
                    codproducto: detalle.codproducto,
                    subtotal: detalle.subtotal,
                    cantidad: detalle.cantidad,
                    precio: detalle.precio
                };
            })
        }
        this._facturacionService.CrearFactura(dataFactura).subscribe({
            next: (response: any) => {
                
                this.ListaDetalleProductos = [];
                this.formFactura = new FacturaDTO();
                this.formDetalleFactura = new FacturaDetalleDTO();
                this.showToast('Agregado correctamente', 'success');
                this.eventoFactura.emit({evento: EventoTipoEnum.CARGAR});
                this.enEdicion = false;
            },
            error: (error: HttpErrorResponse) => {
                this.showToast(error.error, 'error');
            }
        });
    }

    ActualizarFactura(): void {

        let formValidate = this.formFacturaValidate.instance.validate();

        if (!formValidate.isValid) {
            this.showToast('Campos Obligatorios', 'error');
            return;
        }
        if (this.ListaDetalleProductos.length == 0) {
            this.showToast('Debe agregar el detalle', 'error');
            return;
        }

        let dataFactura: ActualizarFacturaRequest = {
            cod: this.formFactura.cod,
            fecha: this.formFactura.fecha,
            subtotal: this.formFactura.total,
            total: this.formFactura.total,
            codtercero: this.formFactura.codTercero,
            detalle: this.ListaDetalleProductos.map((detalle: FacturaDetalleDTO) => {
                return {
                    cod: detalle.cod,
                    codproducto: detalle.codproducto,
                    codfactura: this.formFactura.cod,
                    subtotal: detalle.subtotal,
                    cantidad: detalle.cantidad
                };
            })
        }
        this._facturacionService.ActualizarFactura(dataFactura).subscribe({
            next: (response: any) => {

                this.ListaDetalleProductos = [];
                this.showToast('Actualizado correctamente', 'success');
                this.enEdicion = false;
                this.eventoFactura.emit({evento: EventoTipoEnum.CERRAR});
                this.eventoFactura.emit({evento: EventoTipoEnum.CARGAR});
            },
            error: (error: HttpErrorResponse) => {
                this.showToast(error.error, 'error');
            }
        });

    }

    private showToast(_texto: string, _icon: SweetAlertIcon) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: _icon,
            title: _texto,
        });
    }

}
