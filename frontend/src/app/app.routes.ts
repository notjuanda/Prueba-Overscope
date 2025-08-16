import { Routes } from '@angular/router';
import { LoginComponent } from './auth/presentation/login/login.component';
import { RegisterComponent } from './auth/presentation/register/register.component';
import { ProductListComponent } from './product/presentation/product-list/product-list.component';
import { CategoryListComponent } from './category/presentation/category-list/category-list.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/productos',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [PublicGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [PublicGuard]
    },
    {
        path: 'productos',
        component: ProductListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'categorias',
        component: CategoryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        redirectTo: '/productos',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/productos'
    }
];
