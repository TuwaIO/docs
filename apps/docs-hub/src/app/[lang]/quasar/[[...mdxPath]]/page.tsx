import { createSectionPage } from '@/lib/nextraSection';

const { generateStaticParams, generateMetadata, Page } = createSectionPage('quasar', 'Quasar');

// Only the pages that exist: the 404 of an unknown one stays static
export const dynamicParams = false;

export { generateMetadata, generateStaticParams };
export default Page;
