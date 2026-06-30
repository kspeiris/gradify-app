exports.predictGPA = (assignment, quiz, mid, expectedFinal) => {
  const average = (
    assignment * 0.20 +
    quiz * 0.10 +
    mid * 0.30 +
    expectedFinal * 0.40
  );

  let grade = "F";
  let point = 0;

  if (average >= 85) {
    grade = "A";
    point = 4.0;
  } else if (average >= 80) {
    grade = "A-";
    point = 3.7;
  } else if (average >= 75) {
    grade = "B+";
    point = 3.3;
  } else if (average >= 70) {
    grade = "B";
    point = 3.0;
  } else if (average >= 65) {
    grade = "B-";
    point = 2.7;
  } else if (average >= 60) {
    grade = "C+";
    point = 2.3;
  } else {
    grade = "F";
    point = 0.0;
  }

  return {
    average: Number(average.toFixed(1)),
    expectedGrade: grade,
    expectedGPA: point,
    confidence: 92,
    outlook: point >= 3.7 ? "Excellent" : point >= 3.0 ? "Good" : "Needs Improvement"
  };
};
