import { BaseDTO } from "../common/base.dto";
import type { ActivityId } from "../types/ids";
export class WorkflowDTO extends BaseDTO {

    name!: string | undefined;
    description!: string | undefined;
    entityType!: any;
    startAt!: Date | undefined;
    endAt!: Date | undefined;
    activityIds: ActivityId[] = [];

}