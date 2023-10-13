import { BaseDTO } from "../common/base.dto";
import { ComponentElementDTO } from "./component-element.dto";
import { ComponentGradeType } from "./component-grade-type.dto";
import { UserDTO } from "./user.dto";

export class ComponentDTO extends BaseDTO {

  ordination!: number | undefined;
  name!: string | undefined;
  description!: string | undefined;
  reference!: string | undefined;
  componentElements: ComponentElementDTO[] = [];
  componentGradeTypes: ComponentGradeType[] = [];
}
