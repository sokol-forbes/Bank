import { Container } from 'reactstrap';
import styles from '../../styles/layouts/footer.module.scss';
import { Row, Col } from 'reactstrap';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={`text-light ${styles.footer}`}>
      <Container className={`${styles.footer__container} py-4 text-center`}>
        <a href="https://github.com/sokol-forbes?tab=repositorieshttps://vk.com/ssokolovsky2001" className="text-white">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.instagram.com/sasha.sokol.7/?hl=ru" className="text-white mx-4">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://vk.com/ssokolovsky2001" className="text-white">
          <i className="fab fa-vk"></i>
        </a>
        <br />
        <p> This site made with <i className="far fa-heart" aria-hidden="false"></i> by
          <a href="https://www.facebook.com/sasha.sokol.7"> Alexander Sokolovsky</a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;