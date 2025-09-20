import HomePage from "./HomePage";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";

export default async function Page() {
  await connectDB();

  // fetch sarees from DB
  const sarees = await Saree.find({}).lean();

  // convert _id to string for Next.js serialization
  const serializedSarees = sarees.map((s) => ({
    ...s,
    _id: s._id.toString(),
  }));

  return <HomePage sarees={serializedSarees} />;
}
