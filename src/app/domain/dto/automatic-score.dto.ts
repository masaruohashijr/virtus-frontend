import { BaseDTO } from "../common/base.dto";

export class AutomaticScoreDTO extends BaseDTO {
  cnpb: string | null = null;
  referenceDate: string | null = null;
  componentId: number | null = null;
  score: number | null = null;
}
