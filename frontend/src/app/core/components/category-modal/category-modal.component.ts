import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryRepositoryImpl } from '../../../category/data/category.repository.impl';
import { CreateCategoryUseCase } from '../../../category/domain/usecases/create-category.usecase';
import { UpdateCategoryUseCase } from '../../../category/domain/usecases/update-category.usecase';
import { GetCategoryUseCase } from '../../../category/domain/usecases/get-category.usecase';
import { CategoryCreate, CategoryUpdate, CategoryResponse } from '../../../category/domain/models/category.model';

@Component({
    selector: 'app-category-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent implements OnInit, OnChanges {
    @Input() isOpen: boolean = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() category: CategoryResponse | null = null;
    
    @Output() close = new EventEmitter<void>();
    @Output() categoryCreated = new EventEmitter<CategoryResponse>();
    @Output() categoryUpdated = new EventEmitter<CategoryResponse>();

    form: FormGroup;
    
    private createCategoryUseCase: CreateCategoryUseCase;
    private updateCategoryUseCase: UpdateCategoryUseCase;
    private getCategoryUseCase: GetCategoryUseCase;

    submitting = signal(false);
    loadingCategory = signal(false);
    error = signal<string | null>(null);

    constructor(
        private fb: FormBuilder,
        private categoryRepository: CategoryRepositoryImpl
    ) {
        this.createCategoryUseCase = new CreateCategoryUseCase(this.categoryRepository);
        this.updateCategoryUseCase = new UpdateCategoryUseCase(this.categoryRepository);
        this.getCategoryUseCase = new GetCategoryUseCase(this.categoryRepository);

        this.form = this.fb.group({
            nombre: ['', [Validators.required, Validators.maxLength(100)]]
        });
    }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            if (this.mode === 'create') {
                this.resetForm();
            }
            
            if (this.mode === 'edit' && this.category) {
                this.loadCategoryDetails(this.category.id);
            }
        }
        
        if (changes['category'] && this.category && this.mode === 'edit' && this.isOpen) {
            this.loadCategoryDetails(this.category.id);
        }
    }

    private resetForm(): void {
        this.form.reset({
            nombre: ''
        });
        this.error.set(null);
    }

    private loadCategoryDetails(categoryId: number): void {
        this.loadingCategory.set(true);
        this.error.set(null);
        
        this.getCategoryUseCase.execute(categoryId).subscribe({
            next: (category) => {
                this.populateForm(category);
                this.loadingCategory.set(false);
            },
            error: (err) => {
                this.error.set('Error al cargar los datos de la categoría');
                this.loadingCategory.set(false);
            }
        });
    }

    private populateForm(category?: CategoryResponse): void {
        const categoryData = category || this.category;
        
        if (categoryData) {
            this.form.patchValue({
                nombre: categoryData.nombre
            });
        }
    }

    submit(): void {
        if (this.form.invalid || this.submitting()) {
            return;
        }

        this.submitting.set(true);
        this.error.set(null);

        const formValue = this.form.value;

        if (this.mode === 'create') {
            const categoryData: CategoryCreate = {
                nombre: formValue.nombre
            };

            this.createCategoryUseCase.execute(categoryData).subscribe({
                next: (response) => {
                    this.categoryCreated.emit(response);
                    this.onClose();
                    this.submitting.set(false);
                },
                error: (error) => {
                    this.error.set('Error al crear la categoría');
                    this.submitting.set(false);
                }
            });
        } else {
            const categoryData: CategoryUpdate = {
                nombre: formValue.nombre
            };

            this.updateCategoryUseCase.execute(this.category!.id, categoryData).subscribe({
                next: (response) => {
                    this.categoryUpdated.emit(response);
                    this.onClose();
                    this.submitting.set(false);
                },
                error: (error) => {
                    this.error.set('Error al actualizar la categoría');
                    this.submitting.set(false);
                }
            });
        }
    }

    onClose(): void {
        this.close.emit();
    }

    get title(): string {
        return this.mode === 'create' ? 'Crear Nueva Categoría' : 'Editar Categoría';
    }

    get submitButtonText(): string {
        return this.mode === 'create' ? 'Crear Categoría' : 'Actualizar Categoría';
    }
}
