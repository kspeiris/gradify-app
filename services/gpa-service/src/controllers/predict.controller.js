const service = require("../services/predict.service");

exports.predict = (req, res) => {
  try {
    const { assignment, quiz, mid, final } = req.body;

    if (assignment === undefined || quiz === undefined || mid === undefined || final === undefined) {
      return res.status(400).json({ message: "assignment, quiz, mid, and final scores are required." });
    }

    const result = service.predictGPA(
      Number(assignment),
      Number(quiz),
      Number(mid),
      Number(final)
    );

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
