type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - serializing our own static data for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "streamui",
  url: "https://streamui.dev",
  description: "Beautiful streaming UI components for AI applications.",
  author: {
    "@type": "Person",
    name: "0xDecker",
    url: "https://x.com/0xDecker",
  },
};

export const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "streamui",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "Beautiful streaming UI components for AI applications.",
  url: "https://streamui.dev",
  author: {
    "@type": "Person",
    name: "0xDecker",
  },
};
