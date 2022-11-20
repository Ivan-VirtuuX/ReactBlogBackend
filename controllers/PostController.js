import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};



export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      { _id: postId },

      {
        $inc: { viewsCount: 1 },
      },

      {
        returnDocument: "after",
      },

      (err, doc) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Не удалось вернуть статью",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Не удалось удалить статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json({
          success: true,
        });
      }
    );

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      cloudImageUrl: req.body.cloudImageUrl,
      tags: req.body.tags.split(","),
      comments: req.body.comments,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};


export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        cloudImageUrl: req.body.cloudImageUrl,
        tags: req.body.tags.split(","),
        comments: req.body.comments.split(","),
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};


export const getLastComments = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const comments = posts
      .map((obj) => obj.comments)
      .flat()
      .slice(0, 5);

    res.json(comments)
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    if (req.params.id) {
      const posts = await PostModel.find().populate("user").exec();

      const comments = posts.find((obj) => obj.id === req.params.id).comments

      res.json(comments)
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};