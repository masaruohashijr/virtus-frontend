import { BaseDTO } from "../common/base.dto";

export class ElementItemDTO extends BaseDTO {
  name!: string | undefined;
  description!: string | undefined;
  reference!: string | undefined;
}
