/** Remove caracteres que quebram filtros PostgREST (.or) e limita tamanho. */
export function sanitizeSearchTerm(value: string, maxLength = 100): string {
  return value
    .replace(/[(),.%\\]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Escapa curingas SQL LIKE (% e _). */
export function escapeLikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}
