import { BaseDTO } from "../common/base.dto";
import { StatusDTO } from "./status.dto";

export class ActionDTO extends BaseDTO {
    name!: string | undefined;
    description!: string | undefined;
    otherThan = false;
    originStatus!: StatusDTO | undefined;
    destinationStatus!: StatusDTO | undefined;
    idOriginStatus!: number | undefined;
    idDestinationStatus!: number | undefined;

}