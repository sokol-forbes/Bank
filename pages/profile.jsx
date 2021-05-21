import MainLayout from '../components/layouts/main';
import useHttp from '../hooks/useHttp';
import useUser from '../hooks/useUser';
import { Form, Input, Label, FormText, FormGroup, Button } from 'reactstrap';
import useMessage from '../hooks/useMessage';
import { setCookie } from 'nookies';
import useGlobalState from '../hooks/useGlobalState';
import Dropzone from '../components/dropzone';
import styles from '../styles/pages/profile.module.scss';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
  const { request } = useHttp();
  const [state, dispatch] = useGlobalState();
  const user = useUser();
  const [avatar, setAvatar] = useState(user.avatar);
  const { setSuccess, setError } = useMessage();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const data = await request(
        '/api/user/profile',
        'PATCH',
        formData,
        { Authorization: `Bearer ${user.token}` },
        true
      );
      const userData = { ...user, ...data.user };

      setCookie(
        null,
        process.env.COOKIES_STORAGE_NAME,
        JSON.stringify(userData),
        { path: '/' }
      );
      dispatch({ type: 'LOGIN', user: userData });
      setSuccess(data.message);
    } catch (e) {
      console.log(e);
      setError(e.message);
      if (e.errors) e.errors.forEach((error) => setError(error.msg));
    }
  };

  const onAvatarSelect = (e) => {
    e.target.files[0] && setAvatar(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (!user.isAuthenticated) router.push('/auth');
  }, [user]);

  if (!user.isAuthenticated) return <></>;

  return (
    <>
      <h1 className="text-light text-center mb-5">Профиль</h1>
      <div className={`${styles.profile} bg-white rounded p-4`}>
        <Form onSubmit={onSubmit}>
          <img
            className={styles.profile__avatar}
            src={avatar || 'default-avatar.png'}
            alt=""
          />
          <FormGroup>
            <Label for="avatar">Аватар</Label>
            <Dropzone
              id="avatar"
              name="avatar"
              onChange={onAvatarSelect}
              accept="image/jpeg, image/jpg, image/png"
            />
          </FormGroup>
          <FormGroup>
            <Label for="name">Логин:</Label>
            <Input
              type="text"
              name="username"
              id="username"
              defaultValue={user.username}
            />
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
      </div>
    </>
  );
};

Profile.layout = MainLayout('Profile');

export default Profile;
