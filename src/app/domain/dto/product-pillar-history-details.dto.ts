import { ProductPillarHistoryDTO } from "./product-pillar-history.dto";
import { ProductPillarDTO } from "./product-pillar.dto";

export class ProductPillarHistoryWithDetailsDTO {
    productComponent!: ProductPillarDTO;
    details!: ProductPillarHistoryDTO[];
}