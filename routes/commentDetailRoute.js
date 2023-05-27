import commentModel from "../model/comment_detailSchema.js";
import express from 'express'
import userModel from '../model/userSchema.js';

const Router = express.Router();

Router.get("/count", async (req, res) => {
  try {
    const result = await commentModel.count({}).exec()
    res.json({
      code: "200",
      message: "OK",
      data: result
    });
  } catch (er) {
    console.log(er)
    res.json({
      code: "404",
      message: "NOT FOUND",
    });
  }
})
Router.get("/:id", async (req, res) => {
  try {
    const landmark_id = req.params.id
    const result = await commentModel.find({ landmark_id: landmark_id }).exec();
    const sum_rating = result.reduce((remider, currentCmt) => remider + currentCmt.rating, 0)
    const rating_average = (sum_rating / result.length).toFixed(0)
    let resultUpdated = [];
    for (let comment of result) {
      let user = await userModel.findById(comment.author_id).exec();
      if (user) {
        let commentWithAuthorName = { ...comment._doc, name: user.name };
        resultUpdated.push(commentWithAuthorName);
      }
    }
    res.json({
      code: "200",
      message: "OK",
      data: {
        comments: resultUpdated, rating_average
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "404",
      message: "NOT FOUND"
    });
  }
});
Router.post("/create", async (req, res) => {
  try {
    const { landmark_id, author_id, content, rating } = req.body;

    const filter = { landmark_id, author_id };
    const update = { content, rating };
    const options = { upsert: true, new: true };

    const result = await commentModel.findOneAndUpdate(filter, update, options).exec();

    res.json({
      code: "200",
      message: "OK",
      data: result
    });
  } catch (ex) {
    console.log(ex);
    res.json({
      code: "400",
      message: "BAD REQUEST"
    });
  }
});

export default Router;