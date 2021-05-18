import MainLayout from '../components/layouts/main';

const About = () => {

  return (
    <h1 className="text-light text-center">
      О нас
    </h1>
  )
};

About.layout = MainLayout('About us');

export default About;