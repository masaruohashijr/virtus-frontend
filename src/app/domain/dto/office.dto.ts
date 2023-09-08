import { BaseDTO } from "../common/base.dto";
import { UserDTO } from "./user.dto";

export class OfficeDTO extends BaseDTO {

    name!: string | undefined;
    abbreviation!: string | undefined;
    description!: string | undefined;
    boss!: UserDTO | undefined;

}