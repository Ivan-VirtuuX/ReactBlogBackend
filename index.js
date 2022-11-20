import express from "express";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController, CommentController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://123:123@cluster0.l214bwr.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => console.log("DB error", err));

const app = express();
const PORT = process.env.PORT || 4444

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, require.main?.path + "/" + " uploads ");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/upload", checkAuth, upload.single("file"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  `/posts`,
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create,
);

app.post(
  `/posts/:id/comments`,
  checkAuth,
  CommentController.addComment
);

app.post(
  `/auth/login`,
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  `/auth/register`,
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.get(`/posts/:id/comments`, PostController.getPostComments);

app.get(`/posts`, PostController.getAll);

app.get(`/posts/:id`, PostController.getOne);

app.get(`/posts/tags`, PostController.getLastTags);

app.get(`/tags/:tag`, PostController.getLastTags);

app.get(`/tags`, PostController.getLastTags);

app.get(`/auth/me`, checkAuth, UserController.getMe);

app.get(`/comments`, PostController.getLastComments);

app.patch(
  `/posts/:id`,
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.delete(`/posts/:id`, checkAuth, PostController.remove);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
