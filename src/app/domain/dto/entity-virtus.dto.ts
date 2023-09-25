import { BaseDTO } from "../common/base.dto";

export class EntityVirtusDTO extends BaseDTO {

    name!: string | undefined;
    acronym!: string | undefined;
    code!: string | undefined;
    description!: string | undefined;
    situation!: string | undefined;
    esi: boolean = false;
    city!: string | undefined;
    uf!: string | undefined;
}