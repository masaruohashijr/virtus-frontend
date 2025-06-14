import { ProductElementHistoryDTO } from "./product-element-history.dto";
import { ProductElementDTO } from "./product-element.dto";

export class ProductComponentHistoryWithDetailsDTO {
    productComponent!: ProductElementDTO;
    details!: ProductElementHistoryDTO[];
}