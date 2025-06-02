import { ProductComponentHistoryDTO } from "./product-component-history.dto";
import { ProductComponentDTO } from "./product-component.dto";

export class ProductComponentHistoryWithDetailsDTO {
    productComponent!: ProductComponentDTO;
    details!: ProductComponentHistoryDTO[];
}