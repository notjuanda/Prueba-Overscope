import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryRepository } from '../domain/repositories/category.repository';
import { CategoryCreate, CategoryUpdate, CategoryResponse, CategoriesListResponse } from '../domain/models/category.model';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class CategoryRepositoryImpl implements CategoryRepository {
    private baseApiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    create(input: CategoryCreate): Observable<CategoryResponse> {
        return this.http.post<CategoryResponse>(`${this.baseApiUrl}/categories`, input);
    }

    update(id: number, input: CategoryUpdate): Observable<CategoryResponse> {
        return this.http.put<CategoryResponse>(`${this.baseApiUrl}/categories/${id}`, input);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseApiUrl}/categories/${id}`);
    }

    getById(id: number): Observable<CategoryResponse> {
        return this.http.get<{category: CategoryResponse}>(`${this.baseApiUrl}/categories/${id}`).pipe(
            map(response => response.category)
        );
    }

    getAll(): Observable<CategoryResponse[]> {
        return this.http.get<CategoriesListResponse>(`${this.baseApiUrl}/categories`).pipe(
            map(response => response.categories)
        );
    }
}
