import React from "react";
import UserForm from "../UserForm";

export const metadata = {
  title: "Create Account | Soundarya's Boutique",
  description: "Create an account with Soundarya's Boutique to manage your orders, cart, and wishlist.",
};

const CreateUser = () => {
  return (
    <main>
      <UserForm />
    </main>
  );
};

export default CreateUser;
