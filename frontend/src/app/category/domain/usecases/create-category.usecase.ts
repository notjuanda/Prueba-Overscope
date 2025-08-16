import { Observable } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryCreate, CategoryResponse } from '../models/category.model';

export class CreateCategoryUseCase {
    constructor(private readonly repo: CategoryRepository) {}
    execute(input: CategoryCreate): Observable<CategoryResponse> {
        return this.repo.create(input);
    }
}
