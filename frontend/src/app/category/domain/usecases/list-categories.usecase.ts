import { Observable } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryResponse } from '../models/category.model';

export class ListCategoriesUseCase {
    constructor(private readonly repo: CategoryRepository) {}
    execute(): Observable<CategoryResponse[]> {
        return this.repo.getAll();
    }
}
