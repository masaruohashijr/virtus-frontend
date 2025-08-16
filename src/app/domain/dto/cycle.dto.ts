import { BaseDTO } from "../common/base.dto";
import type { EntityVirtusId } from "../types/ids";

export class CycleDTO extends BaseDTO {
  label!: string;
  entityId!: EntityVirtusId;
}
export class CycleDTOWithDetails extends CycleDTO {
  entityName?: string;
  entityAcronym?: string;
  entityCode?: string;
  startsAt?: Date | null;
  endsAt?: Date | null;
}