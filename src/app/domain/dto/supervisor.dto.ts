import { BaseDTO } from "../common/base.dto";

export class SupervisorDTO extends BaseDTO {
    userId!: number;
    name!: string;
    role!: string;
}