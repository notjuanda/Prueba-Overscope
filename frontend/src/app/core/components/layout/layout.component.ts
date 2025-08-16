import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [HeaderComponent],
    template: `
        <div class="min-h-screen" style="background-color: var(--color-bg)">
            <app-header></app-header>
            <main>
                <ng-content></ng-content>
            </main>
        </div>
    `
})
export class LayoutComponent {}
