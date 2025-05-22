import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useUpload } from "../hooks/useUpload";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [image, setImage] = useState(null);
  const { setProgress } = useContext(AppContext);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      toast.error("Image size must be less than 1MB");
    }
    setImage(file);
  };

  const onUploadProgress = (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(progress);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const name = e.target.name.value;
      const password = e.target.password.value;
      const email = e.target.email.value;
      const cheersTo = e.target.cheersTo.value;
      const age = e.target.age.value;
      const gender = e.target.gender.value;
      const genderPreference = e.target.genderPreference.value;

      if (!name || !email || !password || !image || !cheersTo || !age || !gender || !genderPreference) {
        return toast.error("All fields are required");
      }
      if (name.trim === "" || email.trim === "" || password.trim === "") {
        return toast.error("All fields are required");
      }
      if (name.length < 3 || (!email.includes("@") && !email.includes("."))) {
        return toast.error("Please enter valid data");
      }

      const { public_id, url } = await useUpload({ image, onUploadProgress });
      if (!public_id || !url) {
        toast.error("Error uploading image");
        return;
      } else {
        const res = await axios.post("http://localhost:5000/api/signup", {
          name,
          email,
          password,
          profile: url,
          publicId: public_id,
          cheersTo,
          age,
          gender,
          genderPreference,
        });
        const data = await res.data;
        if (data.success === true) {
          toast.success(data.message);
          e.target.reset();
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-20">
      <h2 className="font-bold text-xl sm:text-3xl text-white">
        Let's create your profile
      </h2>
      <form className="grid sm:grid-cols-2 gap-5" onSubmit={handleSignup}>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="name" className="text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="p-2 border border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 sm:mt-5">
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="p-2 border border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="p-2 border border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="profile" className="text-white">
            Profile
          </label>
          <input
            type="file"
            name="profile"
            accept="image/*"
            id="profile"
            onChange={handleImageChange}
            required
            className="p-2 border border-gray-700 rounded-md text-white"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="cheersTo" className="text-white">
            Cheers To
          </label>
          <select
            name="cheersTo"
            id="cheersTo"
            required
            className="p-2 border border-gray-700 rounded-md"
          >
            <option value="">Select Drink</option>
            <option value="vodka">Vodka</option>
            <option value="rum">Rum</option>
            <option value="beer">Beer</option>
            <option value="whiskey">Whiskey</option>
            <option value="tequila">Tequila</option>
            <option value="brandy">Brandy</option>
            <option value="gin">Gin</option>
          </select>
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="age" className="text-white">
            Age
          </label>
          <input
            type="number"
            name="age"
            id="age"
            min="18"
            max="100"
            required
            className="p-2 border border-gray-700 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="gender" className="text-white">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            required
            className="p-2 border border-gray-700 rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="genderPreference" className="text-white">
            Gender Preference
          </label>
          <select
            name="genderPreference"
            id="genderPreference"
            required
            className="p-2 border border-gray-700 rounded-md"
          >
            <option value="">Select Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="p-2 bg-primary text-white rounded-md"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
