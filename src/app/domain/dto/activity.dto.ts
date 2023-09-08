import { BaseDTO } from "../common/base.dto";
import { ActionDTO } from "./action.dto";
import { ActivityRoleDTO } from "./activity-role.dto";
import { FeatureActivityDTO } from "./feature-activity.dto";
import { WorkflowDTO } from "./workflow.dto";

export class ActivityDTO extends BaseDTO {
    actionId!: number | undefined;
    startAt!: Date | null | undefined;
    endAt!: Date | null | undefined;
    expirationTimeDays!: number | null | undefined; 
    expirationActionId!: number | undefined;
    rolesStr!: string;
    action!: ActionDTO | null | undefined;
    expirationAction!: ActionDTO | null | undefined;
    workflow!: WorkflowDTO;
    features: FeatureActivityDTO[] = [];
    roles: ActivityRoleDTO[] = [];

}