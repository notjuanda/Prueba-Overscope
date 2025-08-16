import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { ProductResponse } from '../models/product.model';

export class GetProductUseCase {
    constructor(private readonly repo: ProductRepository) {}
    execute(id: number): Observable<ProductResponse> {
        return this.repo.getById(id);
    }
}
