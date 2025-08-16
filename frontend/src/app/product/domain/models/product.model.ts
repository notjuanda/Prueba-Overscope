export interface Product {
    id: number;
    nombre: string;
    descripcion?: string | null;
    precio: number;
    imagen?: string | null;
    categoria_id: number;
}

export interface ProductCreate {
    nombre: string;
    precio: number;
    categoria_id: number;
    descripcion?: string | null;
    imagenFile?: File | null;
}

export interface ProductUpdate {
    nombre?: string;
    precio?: number;
    categoria_id?: number;
    descripcion?: string | null;
    imagenFile?: File | null;
}

export type ProductResponse = Product;

export interface ProductsListResponse {
    products: ProductResponse[];
}