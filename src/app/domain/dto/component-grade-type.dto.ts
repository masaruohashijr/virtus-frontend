import { BaseDTO } from "../common/base.dto";
import { GradeTypeDTO } from "./type-of-note.dto";

export class ComponentGradeType extends BaseDTO {
  gradeType: any;
  standardWeight: number | undefined | null;
}
