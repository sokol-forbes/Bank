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
import { dateDataset, circleDataset } from '../utils/graph';

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
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const dataChart = new Chart(ctx, {
      type: 'line',
      data: dateDataset(props.users, props.mortgages),
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const circleCanvas = document.getElementById('circle_canvas');
    const circleCtx = circleCanvas.getContext('2d');

    const circleChart = new Chart(circleCtx, {
      type: 'pie',
      data: circleDataset(props.users, props.mortgages),
    });

    return () => {
      dataChart.destroy();
      circleChart.destroy();
    };
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
      <h1 className="mb-4 mt-5">Статистика взятия ипотек:</h1>
      <div style={{ position: 'relative', height: '531px', width: '100%' }}>
        <canvas id="canvas"></canvas>
      </div>
      <div className="mx-auto mt-5" style={{ position: 'relative', height: 531, width: 531 }}>
        <canvas id="circle_canvas" height="531" width="531" style={{ display: 'block', height: 531, width: 531 }}></canvas>
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
