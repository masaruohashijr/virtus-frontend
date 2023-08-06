import { BaseDTO } from "../common/base.dto";

export class GradeTypeDTO extends BaseDTO {

  ordination!: number | undefined;
  name!: string | undefined;
  description!: string | undefined;
  reference!: string | undefined;
  letter!: string | undefined;
  letterColor: string | undefined = 'C0C0C0';

}
