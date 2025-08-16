import { BaseDTO } from "../common/base.dto";
import { JurisdictionId, UserId, MemberId } from "../types/ids";

export class OfficeDTO extends BaseDTO {
  name!: string | undefined;
  abbreviation!: string | undefined;
  description!: string | undefined;
  bossId!: UserId | undefined;
  jurisdictionIds: JurisdictionId[] = [];
  memberIds: MemberId[] = [];
}
