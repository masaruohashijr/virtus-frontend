import { BaseDTO } from "../common/base.dto";
import type { CycleId, EntityVirtusId } from "../types/ids";

export class CycleEntityDTO extends BaseDTO {
  cycleId!: CycleId;
  entityId!: EntityVirtusId;
}
export class CycleEntityDTOWithDetails extends CycleEntityDTO {
  cycleName?: string;
  entityName?: string;
  entityAcronym?: string;
  entityCode?: string;
}