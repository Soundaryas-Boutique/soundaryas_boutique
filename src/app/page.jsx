import HomePage from "./HomePage";
import { connectDB } from "@/app/lib/mongoose";
import Saree from "@/app/(models)/Saree";
import NewsletterSection from "../../components/NewsletterSection"; // ✅ Import newsletter section

export default async function Page() {
  await connectDB();
  const sarees = await Saree.find({}).lean();
  const serializedSarees = JSON.parse(JSON.stringify(sarees));

  return (
    <>
      <HomePage sarees={serializedSarees} />
 {/* ✅ Render the newsletter section on the homepage */}
    </>
  );
}