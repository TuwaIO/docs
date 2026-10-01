import { createSectionPage } from '@/lib/nextraSection';

const { generateStaticParams, generateMetadata, Page } = createSectionPage('quasar', 'Quasar');

export { generateMetadata, generateStaticParams };
export default Page;
