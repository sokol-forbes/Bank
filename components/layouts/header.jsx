import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import Link from 'next/link';
import styles from '../../styles/layouts/header.module.scss';

import {
  Navbar,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Container,
  NavItem,
  NavLink,
  Nav,
} from 'reactstrap';
import { useRouter } from 'next/router';

const Header = () => {
  const { logout } = useAuth();
  const user = useUser();
  const router = useRouter();

  return (
    <header className={styles.header}>
      <Navbar
        color="light"
        light
        expand="md"
        className={`py-3 ${styles.header__navbar}`}
      >
        <Container>
          <Link href="/">
            <a className="navbar-brand">
              <img src="logo.png" alt="" className={styles.logo} />
            </a>
          </Link>
          <Nav>
            {user.isAuthenticated ? (
              <>
                <UncontrolledDropdown setActiveFromChild>
                  <DropdownToggle tag="a" className="nav-link text-light" caret>
                    <img
                      src={user.avatar || 'default-avatar.png'}
                      alt=""
                      className={styles.header__avatar}
                    />
                    {user.nickname}
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link href="/profile">
                      <DropdownItem tag="a" className="text-dark">
                        Профиль
                      </DropdownItem>
                    </Link>
                    <Link href="/dashboard">
                      <DropdownItem tag="a" className="text-dark">
                        Личный кабинет
                      </DropdownItem>
                    </Link>

                    <DropdownItem divider />
                    <DropdownItem
                      tag="a"
                      className="text-dark"
                      onClick={logout}
                    >
                      Выйти
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem></NavItem>
              </>
            ) : (
              router.pathname !== '/auth' && (
                <>
                  <NavItem>
                    <Link href="/auth">
                      <a className="text-light nav-link">Войти</a>
                    </Link>
                  </NavItem>
                </>
              )
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
