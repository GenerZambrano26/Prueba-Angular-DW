import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturacionPagesComponent } from './facturacion-pages.component';
import { FacturaDetalleComponent } from './components/factura-detalle/factura-detalle.component';

const routes: Routes = [
  {
    path: '',
    component: FacturacionPagesComponent
  },

  {
    path: 'tercero',
    component: FacturaDetalleComponent
   


  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionRoutingModule { }