import { Observable } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryUpdate, CategoryResponse } from '../models/category.model';

export class UpdateCategoryUseCase {
    constructor(private readonly repo: CategoryRepository) {}
    execute(id: number, input: CategoryUpdate): Observable<CategoryResponse> {
        return this.repo.update(id, input);
    }
}
