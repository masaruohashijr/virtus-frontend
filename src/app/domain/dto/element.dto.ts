import { BaseDTO } from "../common/base.dto";
import { ElementItemDTO } from "./element-item.dto";
import { UserDTO } from "./user.dto";

export class ElementDTO extends BaseDTO {
  ordination!: number | undefined;
  name!: string | undefined;
  description!: string | undefined;
  reference!: string | undefined;
  author: UserDTO | undefined;
  items: ElementItemDTO[] = [];
}
