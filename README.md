The README.md is a crucial file for your project. It acts as a guide for other developers and stakeholders, providing a comprehensive overview of your application. Here is a detailed, markdown-formatted `README.md` file for your "Soundarya's Boutique" project.

-----

# **Soundarya's Boutique E-Commerce Platform**

### **A Full-Stack E-commerce Application**

This project is a full-stack e-commerce solution developed as a group project by students of Amrita Vishwa Vidyapeetham, Coimbatore. It provides a modern, secure, and scalable platform for an online boutique specializing in traditional sarees.

-----

## **📝 Project Details**

  - **Team Name:** Team 8
  - **Project Title:** E-Commerce Platform
  - **GitHub URL:** [Insert GitHub Repository URL]
  - **Project Page:** [Insert Project's Google Sites URL]
  - **URL on Amrita Server:** [Insert Amrita Server URL]

### **🧑‍💻 Members**

  - **Roll No:** CB.SC.U4CSE23239
  - **Name:** S Karthik Vishal S

  - - **Roll No:** CB.SC.U4CSE23240
  - **Name:** S Shibi Krishna Ram

  - - **Roll No:** CB.SC.U4CSE23608
  - **Name:** Ananthasagar N

  - - **Roll No:** CB.SC.U4CSE23629
  - **Name:** Krishnan


-----

## **💡 Key Features**

  - **Secure User Authentication:** Implemented with **NextAuth.js** for robust sign-up, sign-in, and session management.
  - **Database-backed Cart:** A fully persistent and unique shopping cart for each user, ensuring items are saved across devices.
  - **Stripe Payment Gateway:** A complete, end-to-end payment system using **Stripe Checkout** and **webhooks** for secure and reliable order fulfillment.
  - **Admin Dashboard:** A secure, role-based dashboard for administrators to manage products, view all orders, and track sales data with **Recharts** visualizations.
  - **Cloud-based Media Management:** Product images are hosted on **Cloudinary**, with secure, client-side uploads.
  - **Email & WhatsApp Marketing:** An admin-side tool to send targeted emails and WhatsApp messages to subscribers using **Nodemailer** and **Twilio**.

-----

## **🚀 Technology Stack**

  - **Frontend:** React.js, Next.js, Tailwind CSS, Recharts.
  - **Backend:** Node.js, Next.js API Routes.
  - **Database:** MongoDB (Mongoose ODM).
  - **Authentication:** NextAuth.js.
  - **Payment:** Stripe API.
  - **Image Hosting:** Cloudinary.
  - **Email:** Nodemailer.
  - **Messaging:** Twilio.

-----

## **📦 Getting Started**

Follow these steps to set up the project locally.

### **1. Clone the repository**

```bash
git clone https://github.com/your-username/soundaryas_boutique.git
cd soundaryas_boutique
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
```

### **3. Set Up Environment Variables**

Create a file named `.env.local` in the root of your project and add the following keys.

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# NextAuth.js
NEXTAUTH_SECRET=a_long_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary Image Hosting
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890
```

### **4. Run the Development Server**

```bash
npm run dev
# or
yarn dev
```

### **5. Run the Stripe Webhook Listener**

In a **separate terminal**, run the Stripe CLI to forward webhooks to your local server.

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```
