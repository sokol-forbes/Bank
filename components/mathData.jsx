import {
  Col,
  Row,
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
import { useState, useEffect } from 'react';
import useHttp from '../hooks/useHttp';
import { setCookie } from 'nookies';
import useGlobalState from '../hooks/useGlobalState';
import { defaultProbabilities } from '../utils/gameMethods';
import Chart from 'chart.js/auto';
import graphStyles from '../styles/components/graph.module.scss';
import { dateDataset } from '../utils/graph';

const MathData = (props) => {
  const user = useUser();
  const { setSuccess, setError } = useMessage();
  const { request } = useHttp();
  const [_, dispatch] = useGlobalState();
  const [data, setData] = useState({
    ...props.data,
    probabilities: props.data.probabilities || defaultProbabilities,
  });
  const [isProbabilities, setIsProbabilities] = useState(
    !!props.data.probabilities
  );

  const restoreMathData = async (e) => {
    try {
      const { mathData, message } = await request(
        '/api/math/data',
        'PATCH',
        null,
        {
          Authorization: `Bearer ${user.token}`,
        }
      );

      setData(mathData);
      setSuccess(message);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const dataset = dateDataset(props.users, props.mortgages);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: 'Ипотека 1',
            data: [3, 12, 3, 7, 2, 3],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3,
            cubicInterpolationMode: 'monotone',
          },
          {
            label: 'Ипотека 2',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 3,
            cubicInterpolationMode: 'monotone',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => myChart.destroy();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { mathData, message } = await request(
        '/api/math/data',
        'PATCH',
        isProbabilities ? data : { ...data, probabilities: null },
        {
          Authorization: `Bearer ${user.token}`,
        }
      );

      setData({
        ...mathData,
        probabilities: mathData.probabilities || defaultProbabilities,
      });
      setSuccess(message);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div style={{ position: 'relative', height: '531px', width: '100%' }}>
        <canvas id="canvas"></canvas>
      </div>
      <h1 className="mb-4 mt-5">Матрица рисков:</h1>
      {data.riskMatrix?.map((row, index) => (
        <Row xs="9" className="mx-n1 mb-2" key={index}>
          {row.map((item, itemIndex) => (
            <Col key={itemIndex} className="px-1">
              <Input
                value={item}
                type="number"
                min="0"
                onChange={(e) => {
                  const newMatrix = [...data.riskMatrix];
                  newMatrix[index][itemIndex] = Number(e.target.value);
                  setData({ ...data, riskMatrix: newMatrix });
                }}
              />
            </Col>
          ))}
        </Row>
      ))}
      <h1 className="mb-4 mt-5">Матрица выйгрышей:</h1>
      {data.benefitMatrix?.map((row, index) => (
        <Row xs="9" className="mx-n1 mb-2" key={index}>
          {row.map((item, itemIndex) => (
            <Col key={itemIndex} className="px-1">
              <Input
                value={item}
                type="number"
                min="0"
                onChange={(e) => {
                  const newMatrix = [...data.benefitMatrix];
                  newMatrix[index][itemIndex] = Number(e.target.value);
                  setData({ ...data, benefitMatrix: newMatrix });
                }}
              />
            </Col>
          ))}
        </Row>
      ))}

      <h1 className="mb-4 mt-5">Решения:</h1>
      <Row xs="9" className="mx-n1 mb-2">
        {data.solutions?.map((item, index) => (
          <Col key={index} className="px-1">
            <Input
              value={item}
              type="number"
              min="0"
              onChange={(e) => {
                const newArray = [...data.solutions];
                newArray[index] = Number(e.target.value);
                setData({ ...data, solutions: newArray });
              }}
            />
          </Col>
        ))}
      </Row>

      <h1 className="mb-4 mt-5">Вероятности внешних условий:</h1>
      <Row xs="9" className="mx-n1 mb-2">
        {data.probabilities?.map((item, index) => (
          <Col key={index} className="px-1">
            <Input
              value={item}
              type="number"
              min="0"
              disabled={!isProbabilities}
              onChange={(e) => {
                const newArray = [...data.probabilities];
                newArray[index] = Number(e.target.value);
                setData({ ...data, probabilities: newArray });
              }}
            />
          </Col>
        ))}
      </Row>
      <FormGroup check>
        <Label check>
          <Input
            checked={isProbabilities}
            onChange={(e) => setIsProbabilities(e.target.checked)}
            type="checkbox"
          />{' '}
          Использовть вероятности
        </Label>
      </FormGroup>
      <Row className="mt-4 mx-n1">
        <Col xs="auto" className="px-1">
          <Button color="primary" onClick={onSubmit}>
            Обновить
          </Button>
        </Col>
        <Col xs="auto" className="px-1">
          <Button color="primary" onClick={restoreMathData}>
            Вернуть стандартные данные
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default MathData;
