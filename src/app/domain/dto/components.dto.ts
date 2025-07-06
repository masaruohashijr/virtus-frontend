import { BaseDTO } from "../common/base.dto";
import { ComponentElementDTO } from "./component-element.dto";
import { ComponentGradeType as ComponentGradeTypeDTO } from "./component-grade-type.dto";
import { ComponentIndicatorDTO } from "./component-indicator.dto";

export class ComponentDTO extends BaseDTO {

  ordination!: number | undefined;
  name!: string | undefined;
  description!: string | undefined;
  reference!: string | undefined;
  componentElements: ComponentElementDTO[] = [];
  componentGradeTypes: ComponentGradeTypeDTO[] = [];
  componentIndicators?: ComponentIndicatorDTO[];
}
