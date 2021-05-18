import Header from './header';
import Footer from './footer';
import Head from 'next/head';
import { Container } from 'reactstrap';
import useMessage from '../../hooks/useMessage';
import styles from '../../styles/layouts/mainLayout.module.scss';

const MainLayout = title => ({ children }) => {
  const { clearMessage, message, messageColor } = useMessage();

  return (
    <>
    <Head>
      <title>{ title }</title>
    </Head>
    <Header />
    <main>
      <Container>
        { children }
      </Container>
    </main>
    <Footer />
    </>
  );
};

export default MainLayout;