import { BaseDTO } from "../common/base.dto";
import { AuditorDTO } from "./auditor.dto";
import { CycleEntityDTO } from "./cycle-entity.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { ProductComponentDTO } from "./product-component.dto";
import { TeamMemberDTO } from "./team-member.dto";

export class DistributeActivitiesTreeDTO extends BaseDTO {
    products!: ProductComponentDTO[]
    auditors!: AuditorDTO[];
}