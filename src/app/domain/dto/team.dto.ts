import { BaseDTO } from "../common/base.dto";
import { CycleDTO } from "./cycle.dto";
import { EntityVirtusDTO } from "./entity-virtus.dto";
import { OfficeDTO } from "./office.dto";
import { SupervisorDTO } from "./supervisor.dto";
import { TeamMemberDTO } from "./team-member.dto";
import { UserDTO } from "./user.dto";

export class TeamDTO extends BaseDTO {

    entity!: EntityVirtusDTO;
    office!: OfficeDTO;
    cycle!: CycleDTO;
    supervisor!: SupervisorDTO | undefined | null;
    teamMembers: TeamMemberDTO[] = [];
}