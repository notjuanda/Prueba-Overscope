import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductRepositoryImpl } from '../../../product/data/product.repository.impl';
import { CategoryRepositoryImpl } from '../../../category/data/category.repository.impl';
import { CreateProductUseCase } from '../../../product/domain/usecases/create-product.usecase';
import { UpdateProductUseCase } from '../../../product/domain/usecases/update-product.usecase';
import { GetProductUseCase } from '../../../product/domain/usecases/get-product.usecase';
import { ListCategoriesUseCase } from '../../../category/domain/usecases/list-categories.usecase';
import { ProductCreate, ProductUpdate, ProductResponse } from '../../../product/domain/models/product.model';
import { CategoryResponse } from '../../../category/domain/models/category.model';

@Component({
    selector: 'app-product-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-modal.component.html'
})
export class ProductModalComponent implements OnInit, OnChanges {
    @Input() isOpen: boolean = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() product: ProductResponse | null = null;
    
    @Output() close = new EventEmitter<void>();
    @Output() productCreated = new EventEmitter<ProductResponse>();
    @Output() productUpdated = new EventEmitter<ProductResponse>();

    form: FormGroup;
    
    private createProductUseCase: CreateProductUseCase;
    private updateProductUseCase: UpdateProductUseCase;
    private getProductUseCase: GetProductUseCase;
    private listCategoriesUseCase: ListCategoriesUseCase;

    submitting = signal(false);
    loadingProduct = signal(false);
    error = signal<string | null>(null);
    categories = signal<CategoryResponse[]>([]);
    selectedImage = signal<File | null>(null);
    imagePreview = signal<string | null>(null);

    private readonly IMAGE_BASE_URL = 'http://localhost:5000/uploads/';

    constructor(
        private fb: FormBuilder,
        private productRepository: ProductRepositoryImpl,
        private categoryRepository: CategoryRepositoryImpl
    ) {
        this.createProductUseCase = new CreateProductUseCase(this.productRepository);
        this.updateProductUseCase = new UpdateProductUseCase(this.productRepository);
        this.getProductUseCase = new GetProductUseCase(this.productRepository);
        this.listCategoriesUseCase = new ListCategoriesUseCase(this.categoryRepository);

        this.form = this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(100)]],
        descripcion: ['', [Validators.maxLength(500)]],
        precio: [0, [Validators.required, Validators.min(0.01)]],
        categoria_id: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            if (this.mode === 'create') {
                this.resetForm();
            }
            
            if (this.mode === 'edit' && this.product) {
                this.loadProductDetails(this.product.id);
            }
        }
        
        if (changes['product'] && this.product && this.mode === 'edit' && this.isOpen) {
            this.loadProductDetails(this.product.id);
        }
    }

    private resetForm(): void {
        this.form.reset({
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria_id: null
        });
        this.selectedImage.set(null);
        this.imagePreview.set(null);
        this.error.set(null);
    }

    private loadCategories(): void {
        this.listCategoriesUseCase.execute().subscribe({
        next: (categories) => {
            this.categories.set(categories);
        },
        error: (err) => {
            this.error.set('Error al cargar las categorías');
        }
        });
    }

    private loadProductDetails(productId: number): void {
        this.loadingProduct.set(true);
        this.error.set(null);
        
        this.getProductUseCase.execute(productId).subscribe({
            next: (product) => {
                this.populateForm(product);
                this.loadingProduct.set(false);
            },
            error: (err) => {
                this.error.set('Error al cargar los datos del producto');
                this.loadingProduct.set(false);
            }
        });
    }

    private populateForm(product?: ProductResponse): void {
        const productData = product || this.product;
        
        if (productData) {
            this.form.patchValue({
                nombre: productData.nombre,
                descripcion: productData.descripcion,
                precio: productData.precio,
                categoria_id: productData.categoria_id
            });

            if (productData.imagen) {
                this.imagePreview.set(this.IMAGE_BASE_URL + productData.imagen);
            }
        }
    }

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (file) {
        this.selectedImage.set(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        }
    }

    removeImage(): void {
        this.selectedImage.set(null);
        this.imagePreview.set(null);
        const fileInput = document.getElementById('image-input') as HTMLInputElement;
        if (fileInput) {
        fileInput.value = '';
        }
    }

    submit(): void {
        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.submitting.set(true);
        this.error.set(null);

        if (this.mode === 'create') {
        this.createProduct();
        } else {
        this.updateProduct();
        }
    }

    private createProduct(): void {
        const productData: ProductCreate = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion || null,
        precio: this.form.value.precio,
        categoria_id: this.form.value.categoria_id,
        imagenFile: this.selectedImage() || null
        };

        this.createProductUseCase.execute(productData).subscribe({
        next: (product) => {
            this.submitting.set(false);
            this.productCreated.emit(product);
            this.onClose();
        },
        error: (err) => {
            this.submitting.set(false);
            this.handleError(err);
        }
        });
    }

    private updateProduct(): void {
        if (!this.product) return;

        const productData: ProductUpdate = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion || null,
        precio: this.form.value.precio,
        categoria_id: this.form.value.categoria_id,
        imagenFile: this.selectedImage() || null
        };

        this.updateProductUseCase.execute(this.product.id, productData).subscribe({
        next: (product) => {
            this.submitting.set(false);
            this.productUpdated.emit(product);
            this.onClose();
        },
        error: (err) => {
            this.submitting.set(false);
            this.handleError(err);
        }
        });
    }

    private handleError(err: any): void {
        if (err.status === 422) {
        this.error.set('Datos inválidos. Verifica la información ingresada.');
        } else if (err.status === 413) {
        this.error.set('La imagen es demasiado grande. Máximo 5MB.');
        } else if (err.error?.message) {
        this.error.set(err.error.message);
        } else {
        this.error.set(`Error al ${this.mode === 'create' ? 'crear' : 'actualizar'} el producto.`);
        }
    }

    onClose(): void {
        this.form.reset();
        this.selectedImage.set(null);
        this.imagePreview.set(null);
        this.error.set(null);
        this.close.emit();
    }

    get title(): string {
        return this.mode === 'create' ? 'Crear Producto' : 'Editar Producto';
    }

    get submitButtonText(): string {
        return this.mode === 'create' ? 'Crear' : 'Actualizar';
    }
}
