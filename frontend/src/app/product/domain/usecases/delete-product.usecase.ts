import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';

export class DeleteProductUseCase {
    constructor(private readonly repo: ProductRepository) {}
    execute(id: number): Observable<void> {
        return this.repo.delete(id);
    }
}
