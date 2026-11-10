import type { ListQuery, QueryTerm } from './types'

/** Keep the expression (including OR groups) intact when AND-ing a quick status. */
export function withListStatus(query: ListQuery, column: string, status: string): ListQuery {
  if (status === 'all') return { ...query }
  const terms: QueryTerm[] = query.terms?.length ? [{ terms: query.terms }] : []
  return { ...query, terms: [...terms, { column, termType: 'eq', value: status, type: 'and' }] }
}

/** The legacy flow-error option expresses NULL, including inside nested groups. */
export function normalizeCardTerms(terms: QueryTerm[] = []): QueryTerm[] {
  return terms.map(term => term.terms
    ? { ...term, terms: normalizeCardTerms(term.terms) }
    : term.column === 'flowError' && term.value === 'flowError'
      ? { ...term, termType: 'isnull', value: '' }
      : { ...term })
}

export function readCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error('Invalid list count')
  }
  return value
}
