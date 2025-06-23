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
    origin: process.env.CLIENT,
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

// Verify Token
app.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Token verified",
    user: req.user,
  });
});

app.get("/user", verifyToken, async (req, res) => {
  try {
    const [rows] = await database.query(
      "SELECT * FROM allUserDetails where uid = ?",
      [req.user.uid]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error querying database" });
  }
});

// Public Posts
app.get("/posts", async (req, res) => {
  try {
    const [rows] = await database.query("SELECT * FROM allPostDetails");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error querying database" });
  }
});

// Authenticated Posts
app.get("/auth/posts", verifyToken, async (req, res) => {
  try {
    const [rows] = await database.query("SELECT * FROM allPostDetails");

    const alteredRows = rows.map((row) => ({
      ...row,
      liked: row.likedBy?.includes(req.user.uid) || false,
    }));

    res.json(alteredRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error querying database" });
  }
});

// My Posts
app.get("/my-posts", verifyToken, async (req, res) => {
  try {
    const [rows] = await database.query(
      "SELECT * FROM allPostDetails WHERE userPost = ?",
      [req.user.uid]
    );

    const alteredRows = rows.map((row) => ({
      ...row,
      liked: row.likedBy?.includes(req.user.uid) || false,
    }));

    res.json(alteredRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error querying database" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await database.query(
      "SELECT * FROM allUserDetails WHERE username = ?;",
      [username]
    );
    if (!users.length) {
      return res.status(404).json({ message: "Username not found" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    console.log(user);

    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        likes: user.total_likes,
        posts: user.post_count,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.SECURE,
      sameSite: process.env.SAME_SITE,
      maxAge: 3600000,
      path: "/",
    });

    res.status(200).json({ message: "You are logged in!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
app.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.SECURE,
    sameSite: process.env.SAME_SITE,
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await database.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (users.length) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 12);
    const [result] = await database.query(
      "INSERT INTO users(username, password) VALUES (?, ?);",
      [username, hashedPwd]
    );

    const [user] = await database.query(
      "Select * from allUserDetails where uid = ?",
      [result.insertId]
    );

    console.log(user);

    const token = jwt.sign(
      {
        uid: user[0].uid,
        username: user[0].username,
        likes: user[0].total_likes,
        posts: user[0].post_count,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.SECURE,
      sameSite: process.env.SAME_SITE,
      maxAge: 3600000,
      path: "/",
    });

    res.status(200).json({ message: "You are now registered and logged in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like a Post
app.patch("/like", verifyToken, async (req, res) => {
  const { pid } = req.body;
  try {
    await database.query("INSERT INTO likes (pid, uid) VALUES (?, ?);", [
      pid,
      req.user.uid,
    ]);

    res.status(200).json({ message: "You liked a post" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Unlike a Post
app.patch("/unlike", verifyToken, async (req, res) => {
  const { pid } = req.body;
  try {
    const [result] = await database.query(
      "Delete from likes where pid = ? and uid = ?;",
      [pid, req.user.uid]
    );
    if (result.affectedRows == 0) {
      return res.status(400).json({ message: "Bad request made!" });
    }
    res.status(200).json({ message: "You un-liked a post" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a Post
app.delete("/delete/:pid", async (req, res) => {
  const postId = req.params.pid;
  try {
    const [result] = await database.query("DELETE FROM posts WHERE pid = ?", [
      postId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload a Post
app.post("/upload", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  const { image, caption } = req.body;

  try {
    await database.query(
      "INSERT INTO posts (uid, image, caption) VALUES (?, ?, ?);",
      [uid, image, caption]
    );

    res.status(200).json({ message: "Post uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log("App listening on port", port);
});
