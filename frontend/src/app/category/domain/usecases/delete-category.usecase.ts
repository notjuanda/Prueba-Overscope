import { Observable } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';

export class DeleteCategoryUseCase {
    constructor(private readonly repo: CategoryRepository) {}
    execute(id: number): Observable<void> {
        return this.repo.delete(id);
    }
}
