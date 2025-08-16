export interface Category {
    id: number;
    nombre: string;
    
}

export interface CategoryCreate {
    nombre: string;
}

export interface CategoryUpdate {
    nombre: string;
}

export type CategoryResponse = Category;

export interface CategoriesListResponse {
    categories: CategoryResponse[];
}