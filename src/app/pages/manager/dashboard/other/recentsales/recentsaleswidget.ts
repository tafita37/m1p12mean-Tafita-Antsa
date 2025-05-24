import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../../service/product.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, InputNumberModule, FormsModule],
    templateUrl : "./recentsaleswidget.html",
    providers: [ProductService]
})
export class RecentSalesWidget {
    @Input() topClients: any;
    products!: Product[];

    _anneeClient: number = 0;

    @Output() anneeClientChange = new EventEmitter<number>();

    get anneeClient(): number {
        return this._anneeClient;
    }

    set anneeClient(value: number) {
        this._anneeClient = value;
        this.anneeClientChange.emit(value);
    }

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data));
        this.anneeClient=new Date().getFullYear();
        // console.log(this.topClients);
        
    }
}
