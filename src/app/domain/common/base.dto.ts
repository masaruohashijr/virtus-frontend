import { UserDTO } from "../dto/user.dto";

export class BaseDTO {
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
  author!: UserDTO;

  equals(other: BaseDTO): boolean {
    if(this.id && other.id){
      return this.id === other.id;
    }
    return false;
  }
}
