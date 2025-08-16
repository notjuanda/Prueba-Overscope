import { Observable } from 'rxjs';
import { ProductCreate, ProductUpdate, ProductResponse } from '../models/product.model';

export interface ProductRepository {
    create(input: ProductCreate): Observable<ProductResponse>;
    update(id: number, input: ProductUpdate): Observable<ProductResponse>;
    delete(id: number): Observable<void>;
    getById(id: number): Observable<ProductResponse>;
    getAll(): Observable<ProductResponse[]>;
    getByCategory(categoryId: number): Observable<ProductResponse[]>;
}