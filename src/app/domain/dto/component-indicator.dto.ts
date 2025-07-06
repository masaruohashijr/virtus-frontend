import { BaseDTO } from "../common/base.dto";
import { IndicatorDTO } from "./indicator.dto";

export class ComponentIndicatorDTO extends BaseDTO {
  indicator!: IndicatorDTO;
  standardWeight: number = 1; // valor padrão
}
