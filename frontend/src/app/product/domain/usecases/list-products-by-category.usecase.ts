import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { ProductResponse } from '../models/product.model';

export class ListProductsByCategoryUseCase {
    constructor(private readonly repo: ProductRepository) {}
    execute(categoryId: number): Observable<ProductResponse[]> {
        return this.repo.getByCategory(categoryId);
    }
}
