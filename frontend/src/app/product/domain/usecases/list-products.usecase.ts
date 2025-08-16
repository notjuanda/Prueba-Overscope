import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { ProductResponse } from '../models/product.model';

export class ListProductsUseCase {
    constructor(private readonly repo: ProductRepository) {}
    execute(): Observable<ProductResponse[]> {
        return this.repo.getAll();
    }
}
