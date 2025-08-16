import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryModalComponent } from '../../../core/components/category-modal/category-modal.component';
import { ConfirmationDialogComponent } from '../../../core/components/confirmation-dialog/confirmation-dialog.component';
import { LayoutComponent } from '../../../core/components/layout/layout.component';
import { CategoryRepositoryImpl } from '../../data/category.repository.impl';
import { ListCategoriesUseCase } from '../../domain/usecases/list-categories.usecase';
import { CreateCategoryUseCase } from '../../domain/usecases/create-category.usecase';
import { UpdateCategoryUseCase } from '../../domain/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '../../domain/usecases/delete-category.usecase';
import { CategoryResponse } from '../../domain/models/category.model';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, CategoryModalComponent, ConfirmationDialogComponent, LayoutComponent],
    templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
    private listCategoriesUseCase: ListCategoriesUseCase;
    private createCategoryUseCase: CreateCategoryUseCase;
    private updateCategoryUseCase: UpdateCategoryUseCase;
    private deleteCategoryUseCase: DeleteCategoryUseCase;
    
    categories = signal<CategoryResponse[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);
    
    showCategoryModal = signal(false);
    showConfirmDialog = signal(false);
    categoryToDelete = signal<CategoryResponse | null>(null);
    categoryToEdit = signal<CategoryResponse | null>(null);

    constructor(private categoryRepository: CategoryRepositoryImpl) {
        this.listCategoriesUseCase = new ListCategoriesUseCase(this.categoryRepository);
        this.createCategoryUseCase = new CreateCategoryUseCase(this.categoryRepository);
        this.updateCategoryUseCase = new UpdateCategoryUseCase(this.categoryRepository);
        this.deleteCategoryUseCase = new DeleteCategoryUseCase(this.categoryRepository);
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    private loadCategories(): void {
        this.loading.set(true);
        this.error.set(null);

        this.listCategoriesUseCase.execute().subscribe({
            next: (categories) => {
                this.categories.set(categories);
                this.loading.set(false);
            },
            error: (error) => {
                this.error.set('Error al cargar las categorías');
                this.loading.set(false);
            }
        });
    }

    onCreateCategory(): void {
        this.categoryToEdit.set(null);
        this.showCategoryModal.set(true);
    }

    onEditCategory(category: CategoryResponse): void {
        this.categoryToEdit.set(category);
        this.showCategoryModal.set(true);
    }

    onDeleteCategory(category: CategoryResponse): void {
        this.categoryToDelete.set(category);
        this.showConfirmDialog.set(true);
    }

    onCategoryModalClose(): void {
        this.showCategoryModal.set(false);
        this.categoryToEdit.set(null);
    }

    onCategoryCreated(): void {
        this.loadCategories();
    }

    onCategoryUpdated(): void {
        this.loadCategories();
    }

    onConfirmDialogClose(): void {
        this.showConfirmDialog.set(false);
        this.categoryToDelete.set(null);
    }

    onConfirmDelete(): void {
        const category = this.categoryToDelete();
        if (category) {
            this.deleteCategoryUseCase.execute(category.id).subscribe({
                next: () => {
                    this.showConfirmDialog.set(false);
                    this.categoryToDelete.set(null);
                    this.loadCategories();
                },
                error: (error) => {
                    this.error.set('Error al eliminar la categoría');
                }
            });
        }
    }

    getDeleteMessage(): string {
        const categoryName = this.categoryToDelete()?.nombre || '';
        return `¿Estás seguro de que deseas eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`;
    }
}
