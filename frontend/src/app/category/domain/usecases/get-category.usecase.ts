import { Observable } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryResponse } from '../models/category.model';

export class GetCategoryUseCase {
    constructor(private readonly repo: CategoryRepository) {}
    execute(id: number): Observable<CategoryResponse> {
        return this.repo.getById(id);
    }
}
