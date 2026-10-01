import { createSectionPage } from '@/lib/nextraSection';

const { generateStaticParams, generateMetadata, Page } = createSectionPage('guides', 'Guides');

export { generateMetadata, generateStaticParams };
export default Page;
