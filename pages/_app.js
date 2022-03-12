import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import PageLayout from "../components/templates/PageLayout";
import ContextProvider from "../components/templates/ContextProvider";

import Head from "next/head";
import Script from "next/script";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Import Bootstrap to use within code. (NOTE: we use className NOT class) */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />
      {/*
      Below is where all the files in the pages folder will render.
      So we wrap this in whatever code we would want globally in the code (Example: Header, Footer, Navigation, Context)
    */}
      <ContextProvider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ContextProvider>
    </>
  );
}

export default App;
