let benefit_matrix = [
  [3.141593, 4.442883, 5.441398, 6.283185, 7.024815, 7.695299, 8.311873, 8.885766, 9.424778],
  [7.874805, 9.364774, 10.36383, 11.13666, 11.77558, 12.32474, 12.80897, 13.24379, 13.63956],
  [15.2697, 16.65172, 17.51744, 18.15883, 18.67246, 19.1029, 19.47456, 19.80235, 20.09605],
  [24.55246, 25.63949, 26.29754, 26.77465, 27.15068, 27.46183, 27.72769, 27.96007, 28.16665],
  [34.80827, 35.57047, 36.02404, 36.34936, 36.60372, 36.81287, 36.99063, 37.14531, 37.28228],
  [45.40113, 45.89552, 46.18721, 46.39529, 46.55733, 46.69016, 46.80275, 46.9005, 46.98689],
  [56.0057, 56.30981, 56.48846, 56.61556, 56.71435, 56.79519, 56.86363, 56.92298, 56.97538],
  [66.49837, 66.67866, 66.78436, 66.85945, 66.91775, 66.96543, 67.00576, 67.04072, 67.07157],
  [76.8558, 76.95991, 77.02088, 77.06417, 77.09777, 77.12523, 77.14845, 77.16857, 77.18633],
  [87.09399, 87.15296, 87.18748, 87.21198, 87.23098, 87.24652, 87.25965, 87.27103, 87.28107],
];

let risk_matrix = [
  [0.31831, 0.450158, 0.551329, 0.63662, 0.711763, 0.779697, 0.842169, 0.900316, 0.95493],
  [0.253975, 0.302028, 0.334249, 0.359174, 0.379781, 0.397492, 0.413109, 0.427133, 0.439897],
  [0.277847, 0.302994, 0.318747, 0.330418, 0.339764, 0.347596, 0.354359, 0.360323, 0.365667],
  [0.33557, 0.350427, 0.359421, 0.365942, 0.371081, 0.375334, 0.378967, 0.382143, 0.384967],
  [0.412313, 0.421341, 0.426714, 0.430567, 0.43358, 0.436058, 0.438163, 0.439995, 0.441618],
  [0.500656, 0.506107, 0.509324, 0.511619, 0.513405, 0.51487, 0.516112, 0.51719, 0.518142],
  [0.595894, 0.599129, 0.60103, 0.602382, 0.603433, 0.604294, 0.605022, 0.605653, 0.606211],
  [0.694991, 0.696876, 0.69798, 0.698765, 0.699375, 0.699873, 0.700294, 0.70066, 0.700982],
  [0.796088, 0.797167, 0.797798, 0.798246, 0.798594, 0.798879, 0.799119, 0.799328, 0.799512],
  [0.898112, 0.898721, 0.899076, 0.899329, 0.899525, 0.899685, 0.899821, 0.899938, 0.900042],
];

const defaultProbabilities = [ 0.1, 0.07, 0.08, 0.25, 0.05, 0.02, 0.12, 0.09, 0.08, 0.14 ];
let probabilities = null;

let solutions = [ 5, 7, 12, 15, 17, 20, 21, 25, 30 ];

const external_condition = benefit_matrix.length;
const solution = benefit_matrix[0].length

let average_marks = new Array(external_condition).fill(null);

function criteria_Baesa(choice) {
  let max = (max_index = min_index = 0),
    min = 10000,
    summ = 0;
  if (choice === 0) {
    for (let j = 0; j < solution; j++) {
      for (let i = 0; i < external_condition; i++) {
        summ += benefit_matrix[i][j] * probabilities[i];
      }
      average_marks[j] = summ;
      summ = 0;
      if (average_marks[j] > max) {
        max = average_marks[j];
        max_index = j;
      }
    }
    return { alt: max_index, percents: solutions[max_index], mark: max };
  }
  if (choice === -1) {
    for (let j = 0; j < solution; j++) {
      min = 1000000;
      for (let i = 0; i < external_condition; i++) {
        summ += risk_matrix[i][j] * probabilities[i];
      }
      average_marks[j] = summ;
      summ = 0;
      if (average_marks[j] < min) {
        min = average_marks[j];
        min_index = j;
      }
    }
    return { alt: min_index, percents: solutions[min_index], mark: min };
  }
}

function criteria_Laplasa() {
  let max = (max_index = 0),
    summ = 0;
  for (let j = 0; j < solution; j++) {
    for (let i = 0; i < external_condition; i++) {
      summ += benefit_matrix[i][j] / solution;
    }
    average_marks[j] = summ;
    summ = 0;
    if (average_marks[j] > max) {
      max = average_marks[j];
      max_index = j;
    }
  }
  return {
    alt: max_index,
    percents: solutions[max_index],
    mark: max,
  };
}

function criteria_Valda() {
  let min = 1000000,
    max = (max_index = min_index = 0);
  let min_benefit = new Array(solution);
  for (let j = 0; j < solution; j++) {
    for (let i = 0; i < external_condition; i++) {
      if (benefit_matrix[i][j] < min) {
        min = benefit_matrix[i][j];
      }
      min_benefit[j] = min;
    }
    for (let j = 0; j < solution; j++) {
      let summ = 0;
      for (let i = 0; i < external_condition; i++) {
        summ += benefit_matrix[i][j] * min_benefit[j];
      }
      average_marks[j] = summ;

      if (average_marks[j] > max) {
        max = average_marks[j];
        max_index = j;
      }
    }
  }

  return {
    alt: max_index,
    percents: solutions[max_index],
    mark: min_benefit[max_index],
  };
}
function criteria_Sevidga() {
  let min = 1000000,
    max = (max_index = min_index = 0);
  let max_risk = new Array(solution).fill(null);

  for (let j = 0; j < solution; j++) {
    for (let i = 0; i < external_condition; i++) {
      if (risk_matrix[i][j] > max) {
        max = risk_matrix[i][j];
      }
    }
    max_risk[j] = max;
    max = 0;
  }

  for (let j = 0; j < solution; j++) {
    min = 1000000;
    for (let i = 0; i < external_condition; i++) {
      summ = risk_matrix[i][j] * max_risk[j];
    }
    average_marks[j] = summ;
    if (average_marks[j] < min) {
      min = average_marks[j];
      min_index = j;
    }
  }
  return {
    alt: min_index,
    percents: solutions[max_index],
    mark: min,
    risk: max_risk[min_index],
  };
}
function criteria_Gurvica(a) {
  let max_benefit = (min_index = max_index = 0),
    min_benefit = 1000000;
  for (let j = 0; j < solution; j++) {
    for (let i = 0; i < external_condition; i++) {
      if (benefit_matrix[i][j] > max_benefit) {
        max_benefit = benefit_matrix[i][j];
        max_index = i;
      }
      if (benefit_matrix[i][j] < min_benefit) {
        min_benfit = benefit_matrix[i][j];
        min_index = i;
      }
      average_marks[j] =
        a * benefit_matrix[min_index][j] +
        (1 - a) * benefit_matrix[max_index][j];
      max_benefit = 0;
      min_benefit = 100000;
    }
  }
  max = 0;
  for (let j = 0; j < solution; j++) {
    if (average_marks[j] > max) {
      max = average_marks[j];
      max_index = j;
    }
  }

  return { alt: max_index, percents: solutions[max_index], mark: max };
}

function game_method(choice, koef, mathData) {
  if (mathData) {
    risk_matrix = mathData.riskMatrix;
    benefit_matrix = mathData.benefitMatrix;
    probabilities = mathData.probabilities;
    solutions = mathData.solutions;
  }

  if ((choice === 0 || choice === -1)) {
    return criteria_Baesa(choice);
  } else if (choice === 1) {
    return criteria_Laplasa();
  } else if (choice === 2) {
    return criteria_Valda();
  } else if (choice === 3) {
    return criteria_Sevidga();
  } else if (choice === 4) {
    return criteria_Gurvica(koef);
  }
}

module.exports = { game_method, probabilities, defaultProbabilities };
