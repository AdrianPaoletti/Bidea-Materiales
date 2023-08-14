import { useEffect, useState } from "react";
import Head from "next/head";

import "resources-management/statics/locales/i18n";

import MainComponent from "resources-management/components/MainComponent";

export default function Landing() {
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
      <Head>
        <title>Materiales</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {hydrated && <MainComponent />}
    </>
  );
}
