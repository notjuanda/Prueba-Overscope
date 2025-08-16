import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductCreate, ProductUpdate, ProductResponse, ProductsListResponse } from '../domain/models/product.model';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class ProductRepositoryImpl implements ProductRepository {
    private baseApiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    create(input: ProductCreate): Observable<ProductResponse> {
        const formData = new FormData();
        formData.append('nombre', input.nombre);
        formData.append('precio', input.precio.toString());
        formData.append('categoria_id', input.categoria_id.toString());
        if (input.descripcion) {
            formData.append('descripcion', input.descripcion);
        }
        if (input.imagenFile) {
            formData.append('imagen', input.imagenFile);
        }

        return this.http.post<ProductResponse>(`${this.baseApiUrl}/products`, formData);
    }

    update(id: number, input: ProductUpdate): Observable<ProductResponse> {
        const formData = new FormData();
        if (input.nombre) formData.append('nombre', input.nombre);
        if (input.precio !== undefined) formData.append('precio', input.precio.toString());
        if (input.categoria_id !== undefined) formData.append('categoria_id', input.categoria_id.toString());
        if (input.descripcion !== undefined) formData.append('descripcion', input.descripcion || '');
        if (input.imagenFile) {
            formData.append('imagen', input.imagenFile);
        }

        return this.http.put<ProductResponse>(`${this.baseApiUrl}/products/${id}`, formData);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseApiUrl}/products/${id}`);
    }

    getById(id: number): Observable<ProductResponse> {
        return this.http.get<{product: ProductResponse}>(`${this.baseApiUrl}/products/${id}`).pipe(
            map(response => response.product)
        );
    }

    getAll(): Observable<ProductResponse[]> {
        return this.http.get<ProductsListResponse>(`${this.baseApiUrl}/products`).pipe(
            map(response => response.products)
        );
    }

    getByCategory(categoryId: number): Observable<ProductResponse[]> {
        return this.http.get<ProductsListResponse>(`${this.baseApiUrl}/products/category/${categoryId}`).pipe(
            map(response => response.products)
        );
    }
}
