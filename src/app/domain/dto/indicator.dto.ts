import { BaseDTO } from "../common/base.dto";

export class IndicatorDTO extends BaseDTO {
  indicatorAcronym!: string | undefined;
  indicatorName!: string | undefined;
  indicatorDescription!: string | undefined;
}
