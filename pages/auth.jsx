import { FormGroup, Form, Button, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import useAuth from '../hooks/useAuth';
import MainLayout from '../components/layouts/main';
import { useRouter } from 'next/router';
import useUser from '../hooks/useUser';

const AuthPage = () => {
  const router = useRouter();
  const user = useUser();

  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState('1');
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    fio: '',
  });

  const registerHandler = e => {
    e.preventDefault();
    register(registerForm);
  };

  const loginHandler = e => {
    e.preventDefault();
    login(loginForm);
  };

  useEffect(() => {
    user.isAuthenticated && router.push('/');
  }, [user]);

  if (user.isAuthenticated) return <></>;

  return (
    <div>
      <h1 className="mb-4 text-center text-light">Войти в систему</h1>
      
      <Nav tabs>
        <NavItem className="w-50 text-center">
          <NavLink
            className={`${classnames({ active: activeTab === '1' })} ${ activeTab !== '1' ? 'text-white' : ''} cursor-pointer py-1`}
            onClick={() => setActiveTab('1')}
          >
            Авторизация
          </NavLink>
        </NavItem>
        <NavItem className="w-50 text-center">
          <NavLink
            className={`${classnames({ active: activeTab === '2' })} ${ activeTab !== '2' ? 'text-white' : ''} cursor-pointer py-1`}
            onClick={() => setActiveTab('2')}
          >
            Регистрация
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Form onSubmit={loginHandler} className="border border-top-0 p-3 rounded-bottom shadow bg-white">
            <FormGroup>
              <Label for="username">Логин:</Label>
              <Input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Пароль: </Label>
              <Input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </FormGroup>
            <Button color="primary" className="mt-2">Войти</Button>
          </Form>
        </TabPane>
        <TabPane tabId="2">
        <Form onSubmit={registerHandler} className="border border-top-0 p-3 rounded-bottom shadow bg-white">
          <FormGroup>
            <Label for="username">Логин:</Label>
            <Input
              type="text"
              name="username"
              value={registerForm.username}
              onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="fio">ФИО:</Label>
            <Input
              type="text"
              name="fio"
              value={registerForm.fio}
              onChange={e => setRegisterForm({ ...registerForm, fio: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Пароль: </Label>
            <Input
              type="password"
              name="password"
              value={registerForm.password}
              onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
          </FormGroup>
          <Button color="primary" className="mt-2">Зарегистрироваться</Button>
          </Form>
        </TabPane>
      </TabContent>
    </div>
  )
};

AuthPage.layout = MainLayout('Auth');

export default AuthPage;
