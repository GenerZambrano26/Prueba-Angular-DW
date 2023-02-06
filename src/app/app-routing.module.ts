import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'facturacion',
        loadChildren: () => import('./facturacion-pages/facturacion-pages.module').then(m => m.FacturacionModule)
    },
    { path: '**', redirectTo: 'facturacion' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
