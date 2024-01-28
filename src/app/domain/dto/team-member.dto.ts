import { BaseDTO } from "../common/base.dto";
import { UserDTO } from "./user.dto";

export class TeamMemberDTO extends BaseDTO {
    member!: UserDTO | undefined | null;
    name!: string;
    role!: string;
    subordinationId!: number;
    startsAt!: Date | undefined | null;
    endsAt!: Date | undefined | null;
}