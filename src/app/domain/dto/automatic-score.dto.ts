import { BaseDTO } from "../common/base.dto";

export class AutomaticScoreDTO extends BaseDTO {
  cnpb: string | null = null;
  dataReferencia: string | null = null;
  idComponente: number | null = null;
  nota: number | null = null;
  criadoEm: string | null = null; // ou Date, dependendo do formato que o backend retorna
    override equals(other: AutomaticScoreDTO): boolean {
    return this.id === other.id;
  }
}

