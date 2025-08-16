import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { ProductUpdate, ProductResponse } from '../models/product.model';

export class UpdateProductUseCase {
    constructor(private readonly repo: ProductRepository) {}
    execute(id: number, input: ProductUpdate): Observable<ProductResponse> {
        return this.repo.update(id, input);
    }
}
