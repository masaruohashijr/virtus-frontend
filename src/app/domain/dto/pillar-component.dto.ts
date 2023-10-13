import { BaseDTO } from "../common/base.dto";
import { ComponentDTO } from "./components.dto";
import { UserDTO } from "./user.dto";

export class PillarComponentDTO extends BaseDTO{
  component: ComponentDTO | undefined | null;
  standardWeight: number | undefined | null;
  averageType: any;
  probeFile: string | undefined | null;
}
