import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { ProductCreate, ProductResponse } from '../models/product.model';

export class CreateProductUseCase {
    constructor(private readonly repo: ProductRepository) {}
    execute(input: ProductCreate): Observable<ProductResponse> {
        return this.repo.create(input);
    }
}
