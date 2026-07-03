import FooterClient from './FooterClient';
import JsonLd from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/api-utils';
import { organizationSchema } from '@/lib/seo/schemas';

export default function Footer() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={organizationSchema(siteUrl)} />
      <FooterClient siteUrl={siteUrl} />
    </>
  );
}