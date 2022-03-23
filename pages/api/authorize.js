import { signToken } from "../../utils/auth";

export default async function handler(req, res) {
  const {username,profilePic,bannerImage,bio} = req.body
  if (req.method === "POST") {
    const token = signToken({ username: username,profilePic,bannerImage,bio })
    res.status(200).json({ token: token, username: username,profilePic,bannerImage,bio })
  }

}

