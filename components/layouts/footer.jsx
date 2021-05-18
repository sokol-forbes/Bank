import { Container } from 'reactstrap';
import styles from '../../styles/layouts/footer.module.scss';
import { Row, Col } from 'reactstrap';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={`text-light ${styles.footer}`}>
      <Container className={`${styles.footer__container} py-4`}>
        hello
      </Container>
    </footer>
  );
};

export default Footer;