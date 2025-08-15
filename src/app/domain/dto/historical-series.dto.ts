import { BaseDTO } from "../common/base.dto";

export interface HistoricalSeriesDTO extends BaseDTO {
  idHistorico: number;  // ID único do histórico
  idEntidade: number;   // ID da entidade (EFPC)
  idPlano: number;      // ID do plano
  nota: number;         // Nota atribuída
  dataReferencia: string;  // Data de referência da alteração
  criadoEm: string;     // Data em que o registro foi criado ou alterado
  tipoAlteracao: "RE" | "RA";  // Tipo de alteração (Retificação ou Ratificação)
  motivacao?: string;  // Motivação para a alteração (opcional)
}
