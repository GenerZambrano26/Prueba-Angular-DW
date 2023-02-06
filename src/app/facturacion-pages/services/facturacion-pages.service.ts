import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroments';
//import { FacturaModel } from '../models/facturacion-pages.models';
import { FacturaDTO } from '../models/facturacion-pages.models';
import { ProductoDTO } from '../models/facturacion-pages.models';
import { TerceroDTO } from '../models/facturacion-pages.models';
import { ActualizarFacturaRequest, CrearFacturaRequest, Resultado } from '../request/ModelRequest';
import { map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class FacturacionPagesService {

    constructor(private http: HttpClient) { }

    ListarTerceros() {
        const url = environment.API_URL + '/api/Tercero/Listar';
        return this.http.get<Resultado<TerceroDTO[]>>(url).pipe(map((response: Resultado<TerceroDTO[]>) => { return response.data }));
    }

    ListarProductos() {
        const url = environment.API_URL + '/api/Producto/Listar';
        return this.http.get<Resultado<ProductoDTO[]>>(url).pipe(map((response: Resultado<ProductoDTO[]>) => { return response.data }));
    }

    ListarFacturas() {
        const url = environment.API_URL + '/api/Factura/Listar';
        return this.http.get<Resultado<FacturaDTO[]>>(url).pipe(map((response: Resultado<FacturaDTO[]>) => { return response.data }));
    }

    CrearFactura(factura: CrearFacturaRequest) {
        const url = environment.API_URL + '/api/Factura/Crear';

        let headers: HttpHeaders = new HttpHeaders({ Accept: "application/x-www-form-urlencoded" });

        return this.http.post<Resultado<string>>(url, factura, { headers }).pipe(map((response: Resultado<string>) => { return response.data }));
    }

    ActualizarFactura(factura: ActualizarFacturaRequest) {
        const url = environment.API_URL + '/api/Factura/Actualizar';

        let headers: HttpHeaders = new HttpHeaders({ Accept: "application/x-www-form-urlencoded" });

        return this.http.put<Resultado<string>>(url, factura, { headers }).pipe(map((response: Resultado<string>) => { return response.data }));
    }

    EliminarFactura(codfactura: string) {

        const headers: HttpHeaders = new HttpHeaders({ Accept: "application/x-www-form-urlencoded" });

        const url = environment.API_URL + '/api/Factura/Eliminar/' + codfactura;
        return this.http.delete<Resultado<string>>(url, { headers }).pipe(map((response: Resultado<string>) => { return response.data }));
    }

    EliminarDetalle(iddetalle: string) {

        const headers: HttpHeaders = new HttpHeaders({ Accept: "application/x-www-form-urlencoded" });

        const url = environment.API_URL + '/api/Factura/Eliminardetalle/' + iddetalle;
        return this.http.delete<Resultado<string>>(url, { headers }).pipe(map((response: Resultado<string>) => { return response.data }));
    }

}
