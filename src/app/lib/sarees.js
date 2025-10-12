import Saree from "@/app/(models)/Saree";
import { connectDB } from "./mongoose";

/**
 * Convert a saree object to a fully serializable plain object
 * @param {Object} saree 
 * @returns {Object}
 */
function serializeSaree(saree) {
  return {
    ...saree,
    _id: saree._id.toString(),
    createdAt: saree.createdAt?.toISOString(),
    updatedAt: saree.updatedAt?.toISOString(),
    images: saree.images?.map((img) => ({
      ...img,
      _id: img._id?.toString(),
    })),
  };
}

/**
 * Fetch top best sellers
 */
export async function getBestSellers(limit = 5) {
  await connectDB();

  const bestSellersRaw = await Saree.find({ status: "active" })
    .sort({ sold: -1 })
    .limit(limit)
    .select("productName price discountPrice images slug category createdAt updatedAt")
    .lean();

  return bestSellersRaw.map(serializeSaree);
}

/**
 * Fetch latest sarees (new arrivals)
 */
export async function getNewArrivals(limit = 5) {
  await connectDB();

  const newArrivalsRaw = await Saree.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("productName price discountPrice images slug category createdAt updatedAt")
    .lean();

  return newArrivalsRaw.map(serializeSaree);
}

/**
 * Fetch both best sellers and new arrivals in parallel
 */
export async function getHomepageSarees(limit = 5) {
  await connectDB();

  const [bestSellersRaw, newArrivalsRaw] = await Promise.all([
    Saree.find({ status: "active" })
      .sort({ sold: -1 })
      .limit(limit)
      .select("productName price discountPrice images slug category createdAt updatedAt")
      .lean(),
    Saree.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("productName price discountPrice images slug category createdAt updatedAt")
      .lean(),
  ]);

  return {
    bestSellers: bestSellersRaw.map(serializeSaree),
    newArrivals: newArrivalsRaw.map(serializeSaree),
  };
}
