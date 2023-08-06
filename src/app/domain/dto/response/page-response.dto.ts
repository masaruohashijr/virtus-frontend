export class PageResponseDTO<T> {
    content!: T[];
    page: number = 0;
    size: number = 20;
    totalPages!: number;
    totalElements!: number;
}
