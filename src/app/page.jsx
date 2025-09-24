import HomePage from "./HomePage";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";

export default async function Page() {
  await connectDB();

  // Fetch sarees from DB
  const sarees = await Saree.find({}).lean();

  // Serialize to plain JSON-safe objects
  const serializedSarees = JSON.parse(JSON.stringify(sarees));

  return <HomePage sarees={serializedSarees} />;
}
