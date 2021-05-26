const backgroundColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'
];
const borderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'
];

const dateDataset = (users, mortgages) => {
  if (!!!users?.length) return [];
  let links = [];
  let dates = [];
  let datasets = [];
  users.forEach((user) => {
    links = [
      ...links,
      ...user.links.map((link) => {
        const date = new Date(link.date).toDateString();
        dates = [...dates.filter((datesDate) => datesDate !== date), date];
        return {
          ...link,
          date,
        };
      }),
    ];
  });

  links.forEach((link) => {
    if (!datasets.find((dataset) => dataset.mortgageId === link.mortgageId))
      datasets.push({
        mortgageId: link.mortgageId,
        data: Array(dates.length).fill(0),
      });
  });

  dates = dates.map(date => new Date(date)).sort((a, b) => a - b).map(date => date.toDateString());

  dates.forEach((date, index) => {
    const linksInDate = links.filter((link) => link.date === date);

    linksInDate.forEach((linkInDate) => {
      datasets.find(
        (dataset) => dataset.mortgageId === linkInDate.mortgageId
      ).data[index] += 1;
    });
  });

  return {
    labels: dates,
    datasets: datasets.map((dataset, index) => ({
      data: dataset.data,
      label: mortgages.find((mortgage) => mortgage._id === dataset.mortgageId)
        .title,
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      borderWidth: 3,
      cubicInterpolationMode: 'monotone'
    })),
  };
};

const circleDataset = (users, mortgages) => {
  const { datasets } = dateDataset(users, mortgages);
  
  const labels = datasets?.map(dataset => dataset.label);
  const data = datasets?.map(dataset => dataset.data.reduce((a, b) => a + b));
  const backgroundColor = datasets?.map(dataset => dataset.borderColor);

  return {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data,
        backgroundColor,
      }
    ]
  };
}

module.exports = { dateDataset, circleDataset };
