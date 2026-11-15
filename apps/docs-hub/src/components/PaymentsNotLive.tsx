import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';

/**
 * Says that Quasar Payments is documented ahead of its launch: these pages are public to be read and indexed, and must not read
 * as a product a reader can use. Remove it, and its uses, when Payments reach production.
 *
 * @param props - The language of the page (English by default).
 * @returns The notice.
 */
export function PaymentsNotLive({ locale = 'en' }: { locale?: Locale }) {
  if (locale === 'uk') {
    return (
      <Callout type="warning">
        <strong>Лише документація, у продакшні ще не працює.</strong> Quasar Payments ще в розробці: описане на цих
        сторінках поки недоступне й може змінитися.
      </Callout>
    );
  }
  if (locale === 'zh-CN') {
    return (
      <Callout type="warning">
        <strong>仅为文档，尚未在生产环境上线。</strong>Quasar Payments
        仍在开发中：这些页面所描述的功能尚不可用，并可能变更。
      </Callout>
    );
  }
  return (
    <Callout type="warning">
      <strong>Docs only, not live in production.</strong> Quasar Payments is still being built: what these pages
      describe is not available yet and may change.
    </Callout>
  );
}
