import { createSectionPage } from '@/lib/nextraSection';

const { generateStaticParams, generateMetadata, Page } = createSectionPage('quasar');

export { generateMetadata, generateStaticParams };
export default Page;
