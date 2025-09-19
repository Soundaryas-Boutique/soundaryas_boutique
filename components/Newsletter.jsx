"use client";
import React, { Component } from "react";
import { FiX } from "react-icons/fi";

class Newsletter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      exclusive: false,
      subscriptionType: "", // dropdown
      gender: "", // NEW radio
      editingIndex: null,
    };
  }

  resetForm = () => {
    this.setState({
      name: "",
      email: "",
      phone: "",
      exclusive: false,
      subscriptionType: "",
      gender: "", // RESET
      editingIndex: null,
    });
  };

  closePopup = () => {
    this.props.setIsPopupOpen(false);
    document.body.classList.remove("overflow-hidden");
    this.resetForm();
  };

  handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      email,
      phone,
      exclusive,
      subscriptionType,
      gender,
      editingIndex,
    } = this.state;
    const { subscriptions, setSubscriptions } = this.props;

    // ✅ Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // ✅ Phone validation (10 digits only, optional field)
    if (phone && !/^\d{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const duplicate = subscriptions.some(
      (sub, idx) => sub.email === email && idx !== editingIndex
    );

    if (duplicate) {
      alert("This email is already subscribed.");
      return;
    }

    const formData = { name, email, phone, exclusive, subscriptionType, gender };

    if (editingIndex !== null) {
      const updated = [...subscriptions];
      updated[editingIndex] = formData;
      setSubscriptions(updated);
      alert("Subscription updated successfully!");
    } else {
      setSubscriptions([...subscriptions, formData]);
      alert("Subscribed successfully!");
    }

    this.closePopup();
  };

  handleEdit = (index) => {
    const sub = this.props.subscriptions[index];
    this.setState({
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      exclusive: sub.exclusive,
      subscriptionType: sub.subscriptionType || "",
      gender: sub.gender || "",
      editingIndex: index,
    });
    this.props.setIsPopupOpen(true);
    this.props.setIsSubscriptionOpen(false);
  };

  handleDelete = (index) => {
    const updated = this.props.subscriptions.filter((_, i) => i !== index);
    this.props.setSubscriptions(updated);
  };

  render() {
    const {
      isPopupOpen,
      setIsPopupOpen,
      isSubscriptionOpen,
      setIsSubscriptionOpen,
      subscriptions,
    } = this.props;

    const {
      name,
      email,
      phone,
      exclusive,
      subscriptionType,
      gender,
      editingIndex,
    } = this.state;

    return (
      <>
        {/* Newsletter Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[2px] bg-transparent">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold text-[#A52A2A]">
                  {editingIndex !== null
                    ? "Edit Subscription"
                    : "Subscribe to our Newsletter"}
                </h3>
                <button onClick={this.closePopup}>
                  <FiX className="w-6 h-6 text-gray-500 hover:text-[#8B0000]" />
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={this.handleNewsletterSubmit}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full p-3 border rounded-md"
                  required
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full p-3 border rounded-md"
                  required
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                  placeholder="Enter your phone"
                  className="w-full p-3 border rounded-md"
                />

                {/* Dropdown for subscription type */}
                <select
                  value={subscriptionType}
                  onChange={(e) =>
                    this.setState({ subscriptionType: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="" disabled>
                    Select subscription type
                  </option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                {/* Radio buttons for gender */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    Gender:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === "male"}
                        onChange={(e) =>
                          this.setState({ gender: e.target.value })
                        }
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === "female"}
                        onChange={(e) =>
                          this.setState({ gender: e.target.value })
                        }
                      />
                      Female
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={gender === "other"}
                        onChange={(e) =>
                          this.setState({ gender: e.target.value })
                        }
                      />
                      Other
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exclusive}
                    onChange={(e) =>
                      this.setState({ exclusive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <label className="ml-2 text-gray-700">
                    Send me exclusive offers
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#A52A2A] text-white rounded-md"
                >
                  {editingIndex !== null
                    ? "Update Subscription"
                    : "Subscribe"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    this.closePopup();
                    setIsSubscriptionOpen(true);
                  }}
                  className="text-[#8B0000] hover:underline"
                >
                  View My Subscriptions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Popup */}
        {isSubscriptionOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-[2px] bg-transparent">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold text-[#A52A2A]">
                  My Subscriptions
                </h3>
                <button onClick={() => setIsSubscriptionOpen(false)}>
                  <FiX className="w-6 h-6 text-gray-600 hover:text-[#8B0000]" />
                </button>
              </div>

              {subscriptions.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {subscriptions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-md bg-gray-50 flex justify-between items-start"
                    >
                      <div>
                        <p>
                          <strong>Name:</strong> {sub.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {sub.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {sub.phone || "N/A"}
                        </p>
                        <p>
                          <strong>Type:</strong> {sub.subscriptionType}
                        </p>
                        <p>
                          <strong>Gender:</strong> {sub.gender || "N/A"}
                        </p>
                        <p>
                          <strong>Exclusive Offers:</strong>{" "}
                          {sub.exclusive ? "Yes ✅" : "No ❌"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => this.handleEdit(idx)}
                          className="text-[#8B0000] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => this.handleDelete(idx)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No subscriptions found.</p>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Newsletter;
