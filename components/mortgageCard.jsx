import {
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  FormGroup,
  Select,
  Label,
  Input,
} from 'reactstrap';
import styles from '../styles/components/mortgageCard.module.scss';
import useUser from '../hooks/useUser';
import useMessage from '../hooks/useMessage';
import { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { setCookie } from 'nookies';
import useGlobalState from '../hooks/useGlobalState';
import { probabilities } from '../utils/gameMethods';
 
const MortgageCard = (props) => {
  const [getModal, setGetModal] = useState(false);
  const user = useUser();
  const { setSuccess, setError } = useMessage();
  const { request } = useHttp();
  const [_, dispatch] = useGlobalState();
  const [sum, setSum] = useState(1000);
 
  const onSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const data = await request(
        '/api/user/add_mortgage',
        'PATCH',
        { id: props._id, sum },
        { Authorization: `Bearer ${user.token}` }
      );
      const userData = { ...user, links: data.links };
 
      setCookie(
        null,
        process.env.COOKIES_STORAGE_NAME,
        JSON.stringify(userData),
        { path: '/' }
      );
      dispatch({ type: 'LOGIN', user: userData });
      setSuccess(data.message);
      setGetModal(false);
    } catch (e) {
      console.log(e);
      setError(e.message);
      if (e.errors) e.errors.forEach((error) => setError(error.msg));
    }
  };
 
  return (
    <Col className="mb-4" key={props._id}>
      <div className={styles.card}>
        <h2 className={`${styles.title} mb-4`}>
          <b>{props.title}</b>
        </h2>
        <p className={`${styles.description} mb-4`}>{props.description}</p>
        {props.percents && (
          <p className="mb-0">
            <b>Процент:</b> {props.percents}%
          </p>
        )}
        {props.sum && (
          <p className="mb-0">
            <b>Сумма:</b> {props.sum}$
          </p>
        )}
        {props.date && (
          <p className="mb-0">
            <b>Дата получения:</b> {new Date(props.date).toDateString()}
          </p>
        )}
        {props.sum && props.percents && (
          <p className="mb-0">
            <b>К оптате:</b> {Math.round(props.sum + (props.sum * props.percents) / 100)}$
          </p>
        )}
        {props.mark && (
          <p className="mb-0">
            <b>Оценка данного решения </b> {(props.mark.toFixed(3))}
          </p>
        )}
        {props.users != null && (
          <p className="mb-0">
            <b>Пользователей взяло:</b> {props.users}
          </p>
        )}
        {props.showButton && (
          <Button
            color="primary"
            onClick={() => setGetModal(!getModal)}
            className="w-100"
          >
            Взять
          </Button>
        )}
        {props.onRemove && (
          <Button
            color="primary"
            onClick={props.onRemove}
            className="w-100 mt-3"
          >
            Убрать
          </Button>
        )}
      </div>
      <Modal
        isOpen={getModal}
        toggle={() => setGetModal(!getModal)}
        className="modal-lg"
      >
        <Form onSubmit={onSubmit}>
          <ModalHeader toggle={() => setGetModal(!getModal)}>
            Взять ипотеку
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="sum">Сумма (от 1000 до 1000000)</Label>
              <Input
                type="number"
                name="sum"
                id="sum"
                min={1000}
                max={1000000}
                value={sum}
                onChange={(e) => setSum(Number(e.target.value))}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Взять
            </Button>{' '}
            <Button color="secondary" onClick={() => setGetModal(!getModal)}>
              Отмена
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Col>
  );
};
 
export default MortgageCard;
 