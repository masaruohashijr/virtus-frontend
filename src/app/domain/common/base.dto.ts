import type { UserId } from "../types/ids";

export class BaseDTO {
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
  authorId!: UserId;

  equals(other: BaseDTO): boolean {
    return !!this.id && this.id === other.id;
  }
}
