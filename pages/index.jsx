import { Container } from 'reactstrap';
import MainLayout from '../components/layouts/main';
import styles from '../styles/components/mortgage.module.scss';
import { Row, Col } from 'reactstrap';
import MortgageCard from '../components/mortgageCard';

import useUser from '../hooks/useUser';

import { useEffect } from 'react';

const Home = (props) => {
  const user = useUser();

  return (
    <Container>
      <h1 className="text-light text-center mb-5">Главная страница</h1>
      <h1 className="mb-4 text-white">Ипотеки:</h1>
      {!!props.mortgages?.length ? (
        <Row xs="1" md="3" className="mb-5">
          {props.mortgages.map((mortgage) => (
            <MortgageCard {...mortgage} showButton={user.isAuthenticated && !user.isAdmin} key={mortgage._id} />
          ))}
        </Row>
      ) : (
        <p>Нет ипотек</p>
      )}
    </Container>
  );
};

Home.layout = MainLayout('Home page');

export default Home;

export async function getServerSideProps(context) {
  let mortgages = [];

  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/mortgages/`);
    mortgages = await res.json();
  } catch (e) {
    console.log(e);
  }

  return {
    props: { mortgages },
  };
}
