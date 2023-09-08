import { BaseDTO } from "../common/base.dto";
import { FeatureDTO } from "./feature.dto";

export class FeatureActivityDTO extends BaseDTO {

    feature!: FeatureDTO | undefined; 

}