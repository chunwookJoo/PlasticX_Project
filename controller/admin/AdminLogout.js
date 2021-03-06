const path = require("path");
const modelsPath = path.resolve(__dirname, "..", "..", "models");
const { Admin } = require(path.resolve(modelsPath, "Admin"));

const callback = (req, res) => {
  Admin.findOneAndUpdate(
    { _id: req.admin._id },
    { token: "" },
    (err, adminInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
};

module.exports = callback;
