import { Observable } from 'rxjs';
import { CategoryCreate, CategoryUpdate, CategoryResponse } from '../models/category.model';

export interface CategoryRepository {
    create(input: CategoryCreate): Observable<CategoryResponse>;
    update(id: number, input: CategoryUpdate): Observable<CategoryResponse>;
    delete(id: number): Observable<void>;
    getById(id: number): Observable<CategoryResponse>;
    getAll(): Observable<CategoryResponse[]>;
}