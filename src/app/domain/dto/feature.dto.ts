import { BaseDTO } from "../common/base.dto";

export class FeatureDTO extends BaseDTO {
    name!: string | undefined;
    description!: string | undefined;
    code!: string | undefined;
    
}