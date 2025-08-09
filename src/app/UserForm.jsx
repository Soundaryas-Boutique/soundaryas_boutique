"use client";
 import { useRouter } from "next/navigation";
 import React, { useState } from "react";

 const UserForm=()=>{
    const router = useRouter();
    const [formData,setFormData] = useState({});
    const [errorMessage,setErrorMessage] = useState("");

    const handleChange = (e) => {
        const value =e.target.value
        const name = e.target.name;
        setFormData((prevState) =>({
            ...prevState,
            [name]:value,
        }));
    };

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setErrorMessage("");
        const res =await fetch("/api/Users",{
            method:"POST",

            body:JSON.stringify({formData}),
            "content-type":"application/json",
        });
        if(!res.ok){
            const {message} = await res.json();
            setErrorMessage(message);
            return;
        }
        else{
            router.refresh();
            router.push("/");
        }
    };
    return(<>
    <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-4 p-4">
        <h1>Create new user</h1><br></br>

        <label>Name</label>
        <input id="name"
         name="name"
         type="text"
         onChange={handleChange}
         value={formData.name} 
         className="border border-gray-300 p-2 rounded-md" />
<br></br>
<label>Email</label>
        <input id="email"
         name="email"
         onChange={handleChange}
         value={formData.email} 
         className="border border-gray-300 p-2 rounded-md" />

<label>password</label>
        <input id="password"
         name="password"
         type="password"
         onChange={handleChange}
         value={formData.password} 
         className="border border-gray-300 p-2 rounded-md" />

<label>Phone</label>
        <input id="phone"
         name="phone"
         type="number"
         onChange={handleChange}
         value={formData.phone} 
         className="border border-gray-300 p-2 rounded-md" />
<br></br>

<label>Address</label>
        <input id="address"
         name="address"
         type="text"
         onChange={handleChange}
         value={formData.address} 
         className="border border-gray-300 p-2 rounded-md" />
<br></br>
       

        <input type="submit" value="Create User" className="bg-blue-500 text-white p-2 rounded-md cursor-pointer" />
        </form>

        <p className="text-red-500">
            {errorMessage}
        </p>
   
    </>)
 }

 export default UserForm;