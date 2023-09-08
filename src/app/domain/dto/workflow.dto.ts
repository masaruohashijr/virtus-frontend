import { BaseDTO } from "../common/base.dto";
import { ActivityDTO } from "./activity.dto";

export class WorkflowDTO extends BaseDTO {

    name!: string | undefined;
    description!: string | undefined;
    entityType!: any;
    startAt!: Date | undefined;
    endAt!: Date | undefined;
    activities: ActivityDTO[] = [];

}