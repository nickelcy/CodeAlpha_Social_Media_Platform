import express from "express";
import database from "./database.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

import env from "dotenv";
env.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).send("Not verified");

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) return res.status(403).send("Invalid token");
    req.user = decoded;
    next();
  });
};

app.get("/posts", async (req, res) => {
  try {
    const [rows] = await database.query("SELECT * FROM allPostDetails");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

app.get("/auth/posts", verifyToken, async (req, res) => {
  try {
    let alteredRows = [];
    const [rows] = await database.query("SELECT * FROM allPostDetails");

    alteredRows = rows.map((row, index) => {
      if (row.likedBy != null && row.likedBy.includes(req.user.uid)) {
        row.liked = true;
      } else {
        row.liked = false;
      }
      return row;
    });

    res.json(alteredRows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

app.get("/my-posts", verifyToken, async (req, res) => {
  try {
    let alteredRows = [];
    const [rows] = await database.query(
      "SELECT * FROM allPostDetails where userPost = ?",
      [req.user.uid]
    );

    alteredRows = rows.map((row, index) => {
      if (row.likedBy != null && row.likedBy.includes(req.user.uid)) {
        row.liked = true;
      } else {
        row.liked = false;
      }
      return row;
    });

    res.json(alteredRows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying database");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await database.query(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );
    if (!users.length) {
      return res.status(404).send("Username not found");
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign(
      { uid: user.uid, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
      path: "/",
    });

    res.status(200).send("Token sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await database.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (users.length) {
      return res.status(400).send("Username already exists");
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const [result] = await database.query(
      "insert into users(username, password) value(?, ?);",
      [username, hashedPwd]
    );

    const token = jwt.sign(
      { uid: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
      path: "/",
    });

    res.status(200).send("You are now register and logged in");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.patch("/like", verifyToken, async (req, res) => {
  const { pid } = req.body;
  try {
    const result = await database.query(
      "INSERT INTO likes (pid, uid) VALUES (?, ?);",
      [pid, req.user.uid]
    );
    console.log(result);
    res.status(200).send("You liked a post");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.delete("/delete/:pid", async (req, res) => {
  const postId = req.params.pid;
  try {
    const [result] = await database.query("DELETE FROM posts WHERE pid = ?", [
      postId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Post not found");
    }

    res.status(200).send("Post deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/upload", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  const { image, caption } = req.body;

  try {
    const [result] = await database.query(
      "INSERT INTO posts (uid, image, caption) VALUES (?, ?, ?);",
      [uid, image, caption]
    );

    console.log(result);
    res.status(200).send("Post uploaded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log("App listening on the port: ", port);
});
