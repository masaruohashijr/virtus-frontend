import { CycleEntityDTO } from "./cycle-entity.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { PillarDTO } from "./pillar.dto";

export class ProductPillarDTO {
    id!: number;
    pillar!: PillarDTO;
    cycle!: CycleEntityDTO;
    entity!: EntityVirtusDTO;
}