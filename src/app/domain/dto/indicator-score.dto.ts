import { BaseDTO } from "../common/base.dto";

export class IndicatorScoreDTO extends BaseDTO {
  cnpb: string | null = null;
  referenceDate: string | null = null;
  indicatorId: number | null = null;
  indicatorSigla: string | null = null;
  score: number | null = null;
}

