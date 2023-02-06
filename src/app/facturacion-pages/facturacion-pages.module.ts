import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturacionPagesComponent } from './facturacion-pages.component';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule, DxTextBoxModule } from 'devextreme-angular';
import { FacturacionRoutingModule } from './facturacion-pages-routing.module';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { FacturaComponent } from './components/factura/factura.component';
import { FacturaDetalleComponent } from './components/factura-detalle/factura-detalle.component';


@NgModule({
  declarations: [
    FacturacionPagesComponent,
    FacturaComponent,
    FacturaDetalleComponent
  ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,
    DxFormModule,
    DxDataGridModule,
    DxTemplateModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxPopupModule,
    DxButtonModule,
    DxiItemModule
  ]
})
export class FacturacionModule { }
