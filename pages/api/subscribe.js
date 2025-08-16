// pages/api/subscribe.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("newsletterDB");

      const { name, email, phone, exclusive } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Insert into "subscribers" collection
      const result = await db.collection("subscribers").insertOne({
        name,
        email,
        phone,
        exclusive,
        createdAt: new Date(),
      });

      res.status(201).json({
        message: "Subscription successful",
        id: result.insertedId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
