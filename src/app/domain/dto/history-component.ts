import { BaseDTO } from "../common/base.dto";

export interface HistoryComponentDTO extends BaseDTO {
    idProdutoComponenteHistorico: number;
    idEntidade: number;
    idCiclo: number;
    idPilar: number;
    idComponente: number;
    iniciaEm: string;
    iniciaEmAnterior: string;
    terminaEm: string;
    terminaEmAnterior: string;
    config: string;
    configAnterior: string;
    peso: number;
    idTipoPontuacao: number;
    nota: number;
    tipoAlteracao: string;
    idAuditor: number;
    auditorAnteriorId: number;
    idAuthor: number;
    authorName: string;
    alteradoEm: string;
    motivacao: string;
}
