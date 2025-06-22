import { BaseDTO } from "../common/base.dto";

export class IndicatorScoreDTO extends BaseDTO {
  cnpb!: string | undefined;
  referenceDate!: string | undefined;
  indicatorSigla!: string | undefined;
  score!: number | undefined;
  componentText!: string | undefined;
}
