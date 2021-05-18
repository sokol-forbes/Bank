import { useState, useEffect } from 'react';
import useHttp from '../hooks/useHttp';
import useUser from '../hooks/useUser';
import { useRouter } from 'next/router';
import styles from '../styles/pages/dashboard.module.scss';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Table,
} from 'reactstrap';
import MortgageCard from '../components/mortgageCard';

import { parseCookies } from 'nookies';

import useMessage from '../hooks/useMessage';
import MainLayout from '../components/layouts/main';
import { probabilities } from '../utils/gameMethods';

const Dashboard = (props) => {
  const { loading, request } = useHttp();
  const [mortgages, setMortgages] = useState(props.mortgages);
  const { setSuccess, setError } = useMessage();
  const [showAddMortgageModal, setShowAddMortgageModal] = useState(false);
  const [newMortgageForm, setNewMortgageForm] = useState({
    title: '',
    description: '',
  });
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUserFields, setUpdateUserFields] = useState({
    gameMethod: null,
    koef: null,
  });
  const [users, setUsers] = useState(props.users);

  const user = useUser();
  const router = useRouter();

  const handleAddMortgage = async (e) => {
    e.preventDefault();
    setShowAddMortgageModal(false);

    try {
      const data = await request(
        '/api/mortgages/add',
        'PATCH',
        newMortgageForm,
        { Authorization: `Bearer ${user.token}` }
      );

      setMortgages(data.mortgages);
      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setShowUserInfoModal(false);

    try {
      const data = await request(
        `/api/user/${selectedUser._id}/update`,
        'PATCH',
        updateUserFields,
        { Authorization: `Bearer ${user.token}` }
      );

      setUsers(data.users);
      setSelectedUser(data.users.find(user => user._id === selectedUser._id));
      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUnlinkMortgage = async (mortgage) => {
    try {
      const data = await request(
        `/api/user/${selectedUser._id}/closeMortgage/${mortgage.mortgageId}`,
        'PATCH',
        null,
        { Authorization: `Bearer ${user.token}` }
      );

      setUsers(data.users);
      setSelectedUser(data.users.find(user => user._id === selectedUser._id));
      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (showUserInfoModal)
      setUpdateUserFields({
        gameMethod: selectedUser.gameMethod,
        koef: selectedUser.koef,
      });
  }, [showUserInfoModal]);

  useEffect(() => {
    if (!user.isAuthenticated) router.push('/auth');
  }, [user]);

  if (!user.isAuthenticated) return <></>;

  return (
    <div className={styles.dashboard}>
      <h1 className="text-light text-center mb-5">
        Личный кабинет {user.isAdmin && 'администратора'}
      </h1>
      <div className={`bg-white rounded p-4`}>
        {user.isAdmin ? (
          <>
            <h1 className="mb-4">Ипотеки:</h1>
            {!!mortgages?.length ? (
              <Row xs="1" md="3" className="mb-3">
                {mortgages.map((mortgage) => (
                  <MortgageCard {...mortgage} key={mortgage._id} />
                ))}
              </Row>
            ) : (
              <p>Нет ипотек</p>
            )}
            <Button
              color="primary"
              onClick={() => setShowAddMortgageModal(!showAddMortgageModal)}
            >
              Добавить ипотеку
            </Button>
            <Modal
              isOpen={showAddMortgageModal}
              toggle={() => setShowAddMortgageModal(!showAddMortgageModal)}
              className="modal-lg"
            >
              <Form onSubmit={handleAddMortgage}>
                <ModalHeader
                  toggle={() => setShowAddMortgageModal(!showAddMortgageModal)}
                >
                  Добавить ипотеку
                </ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="title">Название</Label>
                    <Input
                      type="text"
                      name="title"
                      id="title"
                      value={newMortgageForm.title}
                      onChange={(e) =>
                        setNewMortgageForm({
                          ...newMortgageForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Описание</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      value={newMortgageForm.description}
                      onChange={(e) =>
                        setNewMortgageForm({
                          ...newMortgageForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Добавить
                  </Button>{' '}
                  <Button
                    color="secondary"
                    onClick={() =>
                      setShowAddMortgageModal(!showAddMortgageModal)
                    }
                  >
                    Отмена
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
            <h1 className="mb-4 mt-5">Пользователи:</h1>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Логин</th>
                  <th>ФИО</th>
                  <th>Админ</th>
                  <th>Информация</th>
                </tr>
              </thead>
              <tbody>
                {!!users?.length &&
                  users.map((user) => (
                    <tr key={user._id}>
                      <th scope="row">
                        <img
                          src={user.avatar || 'default-avatar.png'}
                          className={styles.users__avatar}
                          alt=""
                        />
                      </th>
                      <td>{user.nickname}</td>
                      <td>КАкой нибудь фио</td>
                      <td>{user.isAdmin ? 'Да' : 'Нет'}</td>
                      <td>
                        {!user.isAdmin && (
                          <Button
                            color="primary"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserInfoModal(!showUserInfoModal);
                            }}
                          >
                            Показать
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {!!selectedUser && (
              <Modal
                isOpen={showUserInfoModal}
                toggle={() => setShowUserInfoModal(!showUserInfoModal)}
                className="modal-lg"
              >
                <Form onSubmit={handleUserUpdate}>
                  <ModalHeader
                    toggle={() => setShowUserInfoModal(!showUserInfoModal)}
                  >
                    Информация пользователя {selectedUser.nickname}
                  </ModalHeader>
                  <ModalBody>
                    <h1 className="mb-4">Ипотеки:</h1>
                    {!!mortgages?.length ? (
                      <Row xs="1" md="3" className="mb-5">
                        {mortgages
                          .map((mortgage) => ({
                            ...selectedUser.links.find(
                              (link) => link.mortgageId === mortgage._id
                            ),
                            ...mortgage,
                          }))
                          .filter((mortgage) => !!mortgage.mortgageId)
                          .map((mortgage) => (
                            <MortgageCard
                              {...mortgage}
                              key={mortgage._id}
                              onRemove={() => handleUnlinkMortgage(mortgage)}
                            />
                          ))}
                      </Row>
                    ) : (
                      <p>Нет ипотек</p>
                    )}
                    <h1 className="mb-4">Метод:</h1>
                    <FormGroup>
                      <Label for="gameMethod">Метод расчёта</Label>
                      <Input
                        type="select"
                        name="gameMethod"
                        id="gameMethod"
                        value={updateUserFields.gameMethod}
                        onChange={(e) =>
                          setUpdateUserFields({
                            ...updateUserFields,
                            gameMethod: Number(e.target.value),
                          })
                        }
                      >
                        {!!probabilities?.length ? (
                          <>
                            <option value={-1}>
                              Метод байаса по выйгрышам
                            </option>
                            <option value={0}>Метод байаса по рискам</option>
                          </>
                        ) : (
                          <>
                            <option value={1}>Равновероятны</option>
                            <option value={2}>Минимальный выйгрыш</option>
                            <option value={3}>Максимальный риск</option>
                            <option value={4}>Коэффициент пессимизма</option>
                          </>
                        )}
                      </Input>
                    </FormGroup>
                    {updateUserFields.gameMethod === 4 && (
                      <FormGroup>
                        <Label for="koef">Коэффициент (от 0 до 1)</Label>
                        <Input
                          type="number"
                          name="koef"
                          id="koef"
                          min={0}
                          max={1}
                          value={updateUserFields.koef}
                          onChange={(e) =>
                            setUpdateUserFields({
                              ...updateUserFields,
                              koef: Number(e.target.value),
                            })
                          }
                        />
                      </FormGroup>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Обновить
                    </Button>{' '}
                    <Button
                      color="secondary"
                      onClick={() => setShowUserInfoModal(!showUserInfoModal)}
                    >
                      Отмена
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            )}
          </>
        ) : (
          <>
            <h1 className="mb-4">Мои ипотеки:</h1>
            {!!mortgages?.length ? (
              <Row xs="1" md="3" className="mb-5">
                {mortgages
                  .map((mortgage) => ({
                    ...user.links.find(
                      (link) => link.mortgageId === mortgage._id
                    ),
                    ...mortgage,
                  }))
                  .filter((mortgage) => !!mortgage.mortgageId)
                  .map((mortgage) => (
                    <MortgageCard {...mortgage} key={mortgage._id} />
                  ))}
              </Row>
            ) : (
              <p>Нет ипотек</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Dashboard.layout = MainLayout('Dashboard');

export default Dashboard;

export async function getServerSideProps(context) {
  const { user: userJSON } = parseCookies(context, { path: '/' });
  const user =
    userJSON != null ? JSON.parse(userJSON) : { isAuthenticated: false };

  let mortgages = [];
  let users = [];

  try {
    let res = await fetch(`${process.env.SERVER_URL}/api/mortgages/`);
    mortgages = await res.json();

    res = await fetch(`${process.env.SERVER_URL}/api/user/users`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    users = await res.json();
  } catch (e) {
    console.log(e);
  }

  return {
    props: { mortgages, users },
  };
}
