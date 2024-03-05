import { BaseDTO } from "../common/base.dto";
import { MemberDTO } from "./member.dto";
import { UserDTO } from "./user.dto";

export class TeamMemberDTO extends BaseDTO {
    member!: MemberDTO | undefined | null;
    name!: string;
    role!: string;
    subordinationId!: number;
    startsAt!: Date | undefined | null;
    endsAt!: Date | undefined | null;
}