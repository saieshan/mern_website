import React, { useState } from "react";
import { useNavigate } from "react-router";
//import { send } from 'emailjs-com';
import emailjs from '@emailjs/browser';

export default function Create() {
 const [form, setForm] = useState({
   name: "",
   height: "",
   email: "",
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function isValidHeight(height) {
  return /\(|\)|\d{3}/.test(height); //    \(|\)|\d{3}       [1-9][0-9][0-9]
}
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
   var invalidEmail = 0;
   var invalidHeight = 0;

   if(!isValidHeight(newPerson.height))
   {
    invalidHeight = 1;
   }

   if(!isValidEmail(newPerson.email)) {
    invalidEmail = 1;
   }

   if(invalidHeight == 1 && invalidEmail == 1)
   {
    window.alert("Invalid height and email address");
    return;
   }
   else if(invalidHeight == 1 && invalidEmail == 0)
   {
    window.alert("Invalid height");
    return;
   }
   else if(invalidHeight == 0 && invalidEmail == 1)
   {
    window.alert("Invalid email address");
    return;
   }

   var templateParams = {
    to_name: newPerson.name,
    user_height: newPerson.height,
    avg_height: "170",
    reply_to: newPerson.email,
   };

   emailjs.send("service_s2q901w","template_tn7obik", templateParams, "3XXpMZ1KnqGm9NOPK")
	.then((response) => {
    window.alert("Email sent successfully");
	}, (err) => {
    window.alert("Failed to send email");
	});
 
   await fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ name: "", height: "", email: "" });
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Please enter your details below:</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="height">Height (cm)</label>
         <input
           type="text"
           className="form-control"
           id="height"
           value={form.height}
           onChange={(e) => updateForm({ height: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="email">E-Mail Address</label>
         <input
           type="text"
           className="form-control"
           id="email"
           value={form.email}
           onChange={(e) => updateForm({ email: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Submit"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}