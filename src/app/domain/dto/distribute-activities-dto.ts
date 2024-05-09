import { BaseDTO } from "../common/base.dto";
import { CycleDTO } from "./cycle.dto";

export class DistributeActivitiesDTO extends BaseDTO {
    code!: string;
    entityId!: number;
    name!: string;
    acronym!: string;
    cycle!: CycleDTO;
}