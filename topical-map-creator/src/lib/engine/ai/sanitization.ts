/**
 * Prompt Injection Defense & Input Sanitization
 * Specification: DOC-14 §4 & PROJECT_CONTEXT.md §26
 */

/**
 * Sanitizes external search titles, snippets, and PAA queries to prevent prompt injection.
 * Escapes XML tag delimiters, removes system directive prefixes, and wraps contents
 * in an isolated <untrusted_search_data> envelope.
 */
export function sanitizeSearchDataForPrompt(rawSnippets: string[]): string {
  const sanitized = rawSnippets.map(s =>
    s
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\b(system|assistant|developer)\s*:/gi, '')
      .trim()
  ).filter(s => s.length > 0);

  return `<untrusted_search_data>\n${sanitized.join('\n')}\n</untrusted_search_data>`;
}

/**
 * Sanitizes user input string: trims, removes control characters,
 * and strips HTML tags.
 */
export function sanitizeUserInput(input: string, maxLength: number = 150): string {
  if (!input) return '';
  return input
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim()
    .slice(0, maxLength);
}
