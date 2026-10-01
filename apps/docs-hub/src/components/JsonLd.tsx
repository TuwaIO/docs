/**
 * Structured data (schema.org JSON-LD) for search engines, rendered as a `<script type="application/ld+json">`.
 * `<` is escaped, so no string in the data can close the script.
 *
 * @param props.data - The JSON-LD object.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
