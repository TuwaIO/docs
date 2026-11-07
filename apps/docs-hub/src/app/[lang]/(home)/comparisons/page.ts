// `.ts` and not `.tsx`: the page map of Nextra reads every `page.tsx` outside a dynamic folder and calls its `generateMetadata`
// with no params, and it would list this route as a page of the site
import { languageMetadata } from '@/lib/languageMetadata';

import Page, { metadata } from '../../../(default)/(home)/comparisons/page';

export const generateMetadata = languageMetadata(metadata, '/comparisons');
export default Page;
