import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFilterComponent } from '../../../core/components/product-filter/product-filter.component';
import { ProductModalComponent } from '../../../core/components/product-modal/product-modal.component';
import { ConfirmationDialogComponent } from '../../../core/components/confirmation-dialog/confirmation-dialog.component';
import { LayoutComponent } from '../../../core/components/layout/layout.component';
import { ProductRepositoryImpl } from '../../data/product.repository.impl';
import { CategoryRepositoryImpl } from '../../../category/data/category.repository.impl';
import { ListProductsUseCase } from '../../domain/usecases/list-products.usecase';
import { ListProductsByCategoryUseCase } from '../../domain/usecases/list-products-by-category.usecase';
import { CreateProductUseCase } from '../../domain/usecases/create-product.usecase';
import { UpdateProductUseCase } from '../../domain/usecases/update-product.usecase';
import { DeleteProductUseCase } from '../../domain/usecases/delete-product.usecase';
import { ListCategoriesUseCase } from '../../../category/domain/usecases/list-categories.usecase';
import { ProductResponse } from '../../domain/models/product.model';
import { CategoryResponse } from '../../../category/domain/models/category.model';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductFilterComponent, ProductModalComponent, ConfirmationDialogComponent, LayoutComponent],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
    private listProductsUseCase: ListProductsUseCase;
    private listProductsByCategoryUseCase: ListProductsByCategoryUseCase;
    private createProductUseCase: CreateProductUseCase;
    private updateProductUseCase: UpdateProductUseCase;
    private deleteProductUseCase: DeleteProductUseCase;
    private listCategoriesUseCase: ListCategoriesUseCase;
    
    products = signal<ProductResponse[]>([]);
    filteredProducts = signal<ProductResponse[]>([]);
    categories = signal<CategoryResponse[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);
    
    showProductModal = signal(false);
    showConfirmDialog = signal(false);
    productToDelete = signal<ProductResponse | null>(null);
    productToEdit = signal<ProductResponse | null>(null);
    
    currentCategoryFilter = signal<number | null>(null);
    
    private readonly IMAGE_BASE_URL = 'http://localhost:5000/uploads/';

    constructor(
        private productRepository: ProductRepositoryImpl,
        private categoryRepository: CategoryRepositoryImpl
    ) {
        this.listProductsUseCase = new ListProductsUseCase(this.productRepository);
        this.listProductsByCategoryUseCase = new ListProductsByCategoryUseCase(this.productRepository);
        this.createProductUseCase = new CreateProductUseCase(this.productRepository);
        this.updateProductUseCase = new UpdateProductUseCase(this.productRepository);
        this.deleteProductUseCase = new DeleteProductUseCase(this.productRepository);
        this.listCategoriesUseCase = new ListCategoriesUseCase(this.categoryRepository);
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();
    }

    private loadProducts(): void {
        this.loading.set(true);
        this.error.set(null);

        this.listProductsUseCase.execute().subscribe({
            next: (products) => {
                this.products.set(products);
                this.applyFilters();
                this.loading.set(false);
            },
            error: (error) => {
                this.error.set('Error al cargar los productos');
                this.loading.set(false);
            }
        });
    }

    private loadCategories(): void {
        this.listCategoriesUseCase.execute().subscribe({
            next: (categories) => {
                this.categories.set(categories);
            },
            error: (error) => {
                this.error.set('Error al cargar las categorías');
            }
        });
    }

    onCategoryFilter(categoryId: number | null): void {
        this.currentCategoryFilter.set(categoryId);
        
        if (categoryId) {
            this.loading.set(true);
            this.listProductsByCategoryUseCase.execute(categoryId).subscribe({
                next: (products) => {
                    this.products.set(products);
                    this.applyFilters();
                    this.loading.set(false);
                },
                error: (error) => {
                    this.error.set('Error al filtrar productos por categoría');
                    this.loading.set(false);
                }
            });
        } else {
            this.loadProducts();
        }
    }

    private applyFilters(): void {
        const currentProducts = this.products();
        if (!currentProducts || !Array.isArray(currentProducts)) {
            this.filteredProducts.set([]);
            return;
        }
        
        this.filteredProducts.set([...currentProducts]);
    }

    getImageUrl(imageName: string | null): string {
        if (!imageName) {
            return '/images/placeholder-product.png';
        }
        return this.IMAGE_BASE_URL + imageName;
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories().find(cat => cat.id === categoryId);
        return category ? category.nombre : `Categoría ${categoryId}`;
    }

    onAddProduct(): void {
        this.productToEdit.set(null);
        this.showProductModal.set(true);
    }

    onEditProduct(product: ProductResponse): void {
        this.productToEdit.set(product);
        this.showProductModal.set(true);
    }

    onDeleteProduct(product: ProductResponse): void {
        this.productToDelete.set(product);
        this.showConfirmDialog.set(true);
    }

    onProductModalClose(): void {
        this.showProductModal.set(false);
        this.productToEdit.set(null);
    }

    onProductCreated(): void {
        this.showProductModal.set(false);
        this.productToEdit.set(null);
        this.loadProducts();
    }

    onProductUpdated(): void {
        this.showProductModal.set(false);
        this.productToEdit.set(null);
        this.loadProducts();
    }

    onConfirmDelete(): void {
        const product = this.productToDelete();
        if (product) {
            this.deleteProductUseCase.execute(product.id).subscribe({
                next: () => {
                    this.showConfirmDialog.set(false);
                    this.productToDelete.set(null);
                    this.loadProducts();
                },
                error: (error) => {
                    this.error.set('Error al eliminar el producto');
                }
            });
        }
    }

    onCancelDelete(): void {
        this.showConfirmDialog.set(false);
        this.productToDelete.set(null);
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    }

    get hasProducts(): boolean {
        return this.filteredProducts().length > 0;
    }

    get isFiltering(): boolean {
        return this.currentCategoryFilter() !== null;
    }
}
