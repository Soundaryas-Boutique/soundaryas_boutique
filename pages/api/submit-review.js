


import clientPromise from "../../lib/mongodb"; 

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {

    const client = await clientPromise;
   
    const db = client.db("SoundaryasBoutiqueDB"); 


    const { name, rating, comment, submittedAt } = req.body;


    if (!name || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }


    const collection = db.collection('reviews');

 
    const result = await collection.insertOne({
        name,
        rating,
        comment,
        submittedAt: new Date(submittedAt), 
    });

    console.log('Review inserted with ID:', result.insertedId);

    // Send a success response back to the client
    return res.status(201).json({ message: 'Review submitted successfully!', reviewId: result.insertedId });

  } catch (error) {
    console.error('API Error:', error);
    // Send an error response
    return res.status(500).json({ message: 'Failed to submit review.' });
  }
}
