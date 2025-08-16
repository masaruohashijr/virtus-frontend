import { BaseDTO } from "../common/base.dto";
import type { EntityVirtusId } from "../types/ids";

export class PlanDTO extends BaseDTO {
  reference?: string | null;
  name?: string | null;
  description?: string | null;
  cnpb?: string | null;
  legislation?: string | null;
  situation?: string | null;
  guaranteeResource?: number | null;
  modality?: string | null;

  // Evita back-reference: relacione por ID
  entityId?: EntityVirtusId | null;
}
