import { BaseDTO } from "../common/base.dto";
import { ElementDTO } from "./element.dto";
import { GradeTypeDTO } from "./type-of-note.dto";

export class ComponentElementDTO extends BaseDTO {
  element: ElementDTO | undefined | null;
  gradeType: GradeTypeDTO | undefined | null;
  standardWeight: number | undefined | null;
}
