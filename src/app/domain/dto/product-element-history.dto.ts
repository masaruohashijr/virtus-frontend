import { BaseDTO } from "../common/base.dto";

export interface ProductElementHistoryDTO extends BaseDTO {
    idProdutoComponenteHistorico: number;
    idEntidade: number;
    idCiclo: number;
    idPilar: number;
    idComponente: number;
    idPlano: number;
    idTipoNota: number;
    idElemento: number;
    peso: number;
    metodo: number;
    pesoAnterior: number;
    nota: number;
    notaAnterior: number;
    tipoAlteracao: string;
    idAuthor: number;
    authorName: string;
    alteradoEm: string;
    motivacao: string;
}
