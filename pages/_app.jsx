import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.css';
import Provider from '../store/index';
import { parseCookies } from 'nookies';

const MyApp = ({ Component, pageProps, user }) => {
  const Layout = Component.layout ? Component.layout : React.Fragment;
  
  return (
    <>
      <Head>
        <>
          <noscript dangerouslySetInnerHTML={{ '__html': '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=833641527491259&ev=PageView&noscript=1" />' }}>
          </noscript>
        </>
      </Head>
      <Provider user={user}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { user: userJSON } = parseCookies(appContext.ctx, { path: "/" });
  const user = userJSON != null ? JSON.parse(userJSON) : { isAuthenticated: false }

  return { ...appProps, user };
};

export default MyApp;
