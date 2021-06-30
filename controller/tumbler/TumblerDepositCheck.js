const path = require("path");
const modelsPath = path.resolve(__dirname, "..", "..", "models");
const { Tumbler } = require(path.resolve(modelsPath, "Tumbler"));
const { User } = require(path.resolve(modelsPath, "User"));
const { userInfo } = require("os");

const DEPOSIT = 5000;

const callback = async (req, res) => {
  let user;
  let tumbler;

  try {
    tumbler = await Tumbler.findOne(req.params);
  } catch (err) {
    console.log(err);
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(401).json({
        RESULT: 401,
        MESSAGE: "잘못된 텀블러 id값 입력",
        path: err.path,
      });
    }
    return res.status(500).json({
      RESULT: 500,
      MESSAGE: "DB 에러 발생 (Tumbler Collection)",
      error: err,
    });
  }
  if (!tumbler) {
    return res.status(400).json({
      RESULT: 400,
      MESSAGE: "아이디에 해당하는 텀블러 없음",
    });
  }

  let userQuery = new Object();
  userQuery._id = req.body.to_id;

  try {
    user = await User.findOne(userQuery);
  } catch (err) {
    console.log(JSON.stringify(err));
    if (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(411).json({
          RESULT: 411,
          MESSAGE: "잘못된 유저 id값 입력",
          path: err.path,
        });
      }
      return res.status(500).json({
        RESULT: 500,
        MESSAGE: "DB 에러 발생 (User Collection)",
        error: err,
      });
    }
  }
  if (!user) {
    return res.status(410).json({
      RESULT: 410,
      MESSAGE: "아이디에 해당하는 유저 없음",
    });
  }
  // 1. 텀블러 대여 중인가 (state = false)
  // 2. user 보증금 >= 5000 인가
  // 3. 위에 두개 만족하면 state = true
  // 4. user 보증금 - 5000
  // from_id = to_id
  // to_id = user_id
  // date 추가
  let tumblerUpdate = new Tumbler(tumbler);
  let userUpdate = new User(user);

  if (tumbler.state == false && user.deposit >= DEPOSIT) {
    userUpdate.deposit -= 5000;
    tumblerUpdate.state = true;

    var date = new Date();
    date.setHours(date.getHours() + 9);
    tumblerUpdate.date = date.toISOString();

    tumblerUpdate.from_id = tumbler.to_id;
    tumblerUpdate.to_id = req.body.to_id;

    const session = await User.startSession();
    try {
      /*
      await userUpdate.save((err, userResult) => {
        tumblerUpdate.save((err, tumblerResult) => {
          if (err) {
            if (err.name === "CastError" && err.kind === "ObjectId") {
              return res.status(500).json({
                RESULT: 401,
                MESSAGE: `잘못된 id값 입력, (Tumbler Collection)`,
                path: err.path,
              });
            }
            return res.status(500).json({
              RESULT: 500,
              MESSAGE: `DB 에러 발생 , (Tumbler Collection)`,
              error: err,
            });
          }
        });
      });
      */
      await session.withTransaction(async () => {
        await User.findByIdAndUpdate(userUpdate._id, userUpdate);
        await Tumbler.findByIdAndUpdate(tumblerUpdate._id, tumblerUpdate);
      });
    } catch (err) {
      console.log(err);
      if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(500).json({
          RESULT: 401,
          MESSAGE: `잘못된 id값 입력, (${
            err.message.split('"').reverse()[1]
          } Collection)`,
          path: err.path,
        });
      }
      return res.status(500).json({
        RESULT: 500,
        MESSAGE: `DB 에러 발생 , (${
          err.message.split('"').reverse()[1]
        } Collection)`,
        error: err,
      });
    } finally {
      await session.endSession();
    }
  }

  if (
    user.deposit - userUpdate.deposit >= 5000 &&
    tumbler.state != tumblerUpdate.state
  ) {
    return res.status(200).json({
      RESULT: 200,
      MESSAGE: "텀블러 대여 성공",
      DEPOSIT: userUpdate.deposit,
    });
  } else if (tumbler.state == true) {
    return res.status(301).json({
      RESULT: 301,
      MESSAGE: "텀블러 사용중",
    });
  } else if (user.deposit < 5000) {
    return res.status(300).json({
      RESULT: 300,
      MESSAGE: "보증금 부족",
      DEPOSIT: `현재 보증금 : ${user.deposit}`,
    });
  }
};

module.exports = callback;