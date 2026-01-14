import { Helmet } from 'react-helmet-async';

const SEOManager = ({ 
  title, 
  description, 
  image, 
  url, 
  personData = null 
}) => {
  const siteName = "Everything BJA";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "The official hub for Brian Jordan Alvarez. Links, merch, credits, and more.";
  const finalDesc = description || defaultDesc;
  const finalUrl = `https://everything-bja.web.app${url || ''}`;
  const finalImage = image || "https://everything-bja.web.app/og-image.jpg";

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />

      {/* X (Twitter) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteName,
          "url": "https://everything-bja.web.app"
        })}
      </script>

      {personData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Brian Jordan Alvarez",
            "url": "https://everything-bja.web.app",
            "sameAs": [
              "https://www.instagram.com/brianjordanalvarez",
              "https://www.tiktok.com/@brianjordanalvarez",
              "https://www.youtube.com/user/BrianJordanAlvarez"
            ],
            "jobTitle": "Actor, Comedian, Creator",
            "image": personData.image
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOManager;
