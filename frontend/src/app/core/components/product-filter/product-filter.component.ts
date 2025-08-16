import { Component, EventEmitter, Output, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryRepositoryImpl } from '../../../category/data/category.repository.impl';
import { ListCategoriesUseCase } from '../../../category/domain/usecases/list-categories.usecase';
import { CategoryResponse } from '../../../category/domain/models/category.model';

@Component({
    selector: 'app-product-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-filter.component.html'
})
export class ProductFilterComponent implements OnInit {
    @Output() categoryChanged = new EventEmitter<number | null>();

    private listCategoriesUseCase: ListCategoriesUseCase;

    categories = signal<CategoryResponse[]>([]);
    validCategories = computed(() => {
        const cats = this.categories();
        return Array.isArray(cats) ? cats : [];
    });
    selectedCategoryId = signal<number | null>(null);
    isDropdownOpen = signal(false);
    loading = signal(false);
    error = signal<string | null>(null);

    constructor(private categoryRepository: CategoryRepositoryImpl) {
        this.listCategoriesUseCase = new ListCategoriesUseCase(this.categoryRepository);
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
                this.categories.set([]);
            }
        });
    }

    onCategoryChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const categoryId = select.value ? parseInt(select.value) : null;
        this.selectedCategoryId.set(categoryId);
        this.categoryChanged.emit(categoryId);
    }

    toggleDropdown(): void {
        this.isDropdownOpen.set(!this.isDropdownOpen());
    }

    selectCategory(categoryId: number | null): void {
        this.selectedCategoryId.set(categoryId);
        this.categoryChanged.emit(categoryId);
        this.isDropdownOpen.set(false);
    }

    clearFilters(): void {
        this.selectedCategoryId.set(null);
        this.categoryChanged.emit(null);
        this.isDropdownOpen.set(false);
    }

    getSelectedCategoryName(): string {
        const selectedId = this.selectedCategoryId();
        if (!selectedId) return 'Todas las categorías';
        
        const category = this.validCategories().find(cat => cat.id === selectedId);
        return category ? category.nombre : 'Todas las categorías';
    }

    get hasActiveFilters(): boolean {
        return this.selectedCategoryId() !== null;
    }
}
