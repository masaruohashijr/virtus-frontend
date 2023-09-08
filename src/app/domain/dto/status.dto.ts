import { BaseDTO } from "../common/base.dto";

export class StatusDTO extends BaseDTO {
    name!: string | undefined;
    description!: string | undefined;
    stereotype!: string | undefined;
}