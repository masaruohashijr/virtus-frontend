import { BaseDTO } from "../common/base.dto";
import { CycleId, PlanId } from "../types/ids";
import { CycleEntityDTO } from "./cycle-entity.dto";
import { CycleDTO } from "./cycle.dto";
import { PlanDTO } from "./plan.dto";

export class EntityVirtusDTO extends BaseDTO {

    name!: string | undefined;
    acronym!: string | undefined;
    code!: string | undefined;
    description!: string | undefined;
    situation!: string | undefined;
    esi: boolean = false;
    city!: string | undefined;
    uf!: string | undefined;
    cycleIds?: CycleId[] = [];
    planIds?: PlanId[] = [];
    cycleSelected: CycleDTO | undefined | null;
}