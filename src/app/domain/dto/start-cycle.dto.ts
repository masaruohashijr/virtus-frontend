import { BaseDTO } from "../common/base.dto";
import { CycleDTO } from "./cycle.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";

export class StartCycleDTO extends BaseDTO {

    cycle!: CycleDTO;
    startsAt: Date | undefined | null;
    endsAt: Date | undefined | null;
    entities: EntityVirtusDTO[] = [];
}