import { BaseDTO } from "../common/base.dto";

export class TeamMemberDTO extends BaseDTO {
    userId!: number;
    name!: string;
    role!: string;
    subordinationId!: number;
}