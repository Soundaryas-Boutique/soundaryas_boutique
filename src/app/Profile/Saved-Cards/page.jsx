"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";
import ProfileNav from "../../../../components/ProfileNav";

export default function SavedCardsPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const { userInfo, loading, error } = useUserInfo(email);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    pincode: "",
  });

  const [cards, setCards] = useState(userInfo?.cards || []);
  const [defaultCardId, setDefaultCardId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);

  if (status === "unauthenticated") {
    return (
      <div className="relative items-center justify-center flex flex-col h-screen -top-20">
        <p>Please Login to continue.</p>
        <Link href="/signin">
          <button className="text-blue-500">Sign In</button>
        </Link>
      </div>
    );
  }

  if (error) return <p>{error.message}</p>;

  // Detect card type
  const getCardType = (number) => {
    const re = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      rupay: /^6/,
    };
    if (re.visa.test(number)) return "Visa";
    if (re.mastercard.test(number)) return "MasterCard";
    if (re.amex.test(number)) return "Amex";
    if (re.rupay.test(number)) return "RuPay";
    return "Card";
  };

  // Add new card
  const handleAddCard = (e) => {
    e.preventDefault();

    const newCard = {
      id: Date.now(),
      cardNumber: cardNumber.replace(/\d{12}(\d{4})/, "**** **** **** $1"),
      expiry,
      nameOnCard,
      type: getCardType(cardNumber),
      billingAddress,
      lastUsed: "Never",
    };

    setCards([...cards, newCard]);

    // Reset form
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setNameOnCard("");
    setBillingAddress({ street: "", city: "", pincode: "" });
  };

  // Remove card
  const handleRemoveCard = (id) => {
    if (confirm("Are you sure you want to remove this card?")) {
      setCards(cards.filter((card) => card.id !== id));
      if (defaultCardId === id) setDefaultCardId(null);
    }
  };

  // Set default card
  const handleSetDefault = (id) => {
    setDefaultCardId(id);
  };

  // Edit card
  const handleEditClick = (card) => {
    setEditingCardId(card.id);
    setNameOnCard(card.nameOnCard);
    setExpiry(card.expiry);
    setBillingAddress(card.billingAddress || { street: "", city: "", pincode: "" });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    setCards(
      cards.map((card) =>
        card.id === editingCardId
          ? {
              ...card,
              nameOnCard,
              expiry,
              billingAddress,
            }
          : card
      )
    );

    // Reset
    setEditingCardId(null);
    setNameOnCard("");
    setExpiry("");
    setBillingAddress({ street: "", city: "", pincode: "" });
  };

  return (
    <div className="flex flex-col md:flex-row p-4">
      {/* Left side */}
      <ProfileNav />

      {/* Right side */}
      <div className="ml-9 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Saved Cards</h1>

        {/* Existing saved cards */}
        <div className="mb-6 space-y-3">
          {cards.length === 0 ? (
            <p className="text-gray-600">No saved cards yet.</p>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className="border p-3 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{card.nameOnCard}</p>
                  <p className="text-sm text-gray-700">{card.cardNumber}</p>
                  <p className="text-sm text-gray-500">
                    {card.type} • Exp: {card.expiry}
                  </p>
                  {card.billingAddress && (
                    <p className="text-xs text-gray-400">
                      {card.billingAddress.street}, {card.billingAddress.city} -{" "}
                      {card.billingAddress.pincode}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Last used: {card.lastUsed}
                  </p>
                  {defaultCardId === card.id && (
                    <span className="text-xs text-green-600 font-semibold">
                      Default Card
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    {defaultCardId === card.id ? "✓ Default" : "Set Default"}
                  </button>
                  <button
                    onClick={() => handleEditClick(card)}
                    className="text-yellow-500 hover:text-yellow-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit card form */}
        <form
          onSubmit={editingCardId ? handleSaveEdit : handleAddCard}
          className="bg-gray-100 p-4 rounded-lg shadow-md space-y-3"
        >
          <h2 className="font-semibold mb-2">
            {editingCardId ? "Edit Card" : "Add New Card"}
          </h2>

          <input
            type="text"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            placeholder="Name on Card"
            className="w-full border rounded-md p-2"
            required
          />

          {!editingCardId && (
            <>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                maxLength="16"
                className="w-full border rounded-md p-2"
                required
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-1/2 border rounded-md p-2"
                  required
                />
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  maxLength="3"
                  className="w-1/2 border rounded-md p-2"
                  required
                />
              </div>
            </>
          )}

          {editingCardId && (
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              className="w-full border rounded-md p-2"
              required
            />
          )}

          {/* Billing address */}
          <h3 className="font-medium text-sm">Billing Address</h3>
          <input
            type="text"
            value={billingAddress.street}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, street: e.target.value })
            }
            placeholder="Street"
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            value={billingAddress.city}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, city: e.target.value })
            }
            placeholder="City"
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            value={billingAddress.pincode}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, pincode: e.target.value })
            }
            placeholder="Pincode"
            className="w-full border rounded-md p-2"
          />

          <p className="text-xs text-gray-500">
            ⚠️ CVV is required only at checkout and will not be saved.
          </p>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              {editingCardId ? "Save Changes" : "Save Card"}
            </button>

            {editingCardId && (
              <button
                type="button"
                onClick={() => setEditingCardId(null)}
                className="ml-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
