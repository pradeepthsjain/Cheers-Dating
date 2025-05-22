import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUpload } from "../hooks/useUpload";

const EditProfile = () => {
    const { user, setUser, setProgress } = useContext(AppContext);
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        cheersTo: user?.cheersTo || "",
        age: user?.age || "",
        gender: user?.gender || "",
        genderPreference: user?.genderPreference || "",
        profile: user?.profile || "",
        password: "",
    });
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 1000000) {
            toast.error("Image size must be less than 1MB");
            return;
        }
        setImage(file);
    };

    const onUploadProgress = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(progress);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let profileUrl = form.profile;
            let public_id = user?.publicId;
            if (image) {
                const uploadRes = await useUpload({ image, onUploadProgress });
                if (!uploadRes.url) {
                    toast.error("Image upload failed");
                    return;
                }
                profileUrl = uploadRes.url;
                public_id = uploadRes.public_id;
            }
            const updateData = {
                ...form,
                profile: profileUrl,
                publicId: public_id,
            };
            // Remove empty password
            if (!updateData.password) delete updateData.password;
            const res = await axios.put("http://localhost:5000/api/updateProfile", updateData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.data;
            if (data.success) {
                toast.success("Profile updated successfully");
                setUser(data.data);
                navigate("/profile");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error updating profile");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center my-20">
            <h2 className="font-bold text-xl sm:text-3xl text-white">Edit Profile</h2>
            <form className="grid sm:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 mt-5">
                    <label htmlFor="name" className="text-white">Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="p-2 border border-gray-700 rounded-md" required />
                </div>
                <div className="flex flex-col gap-5 sm:mt-5">
                    <label htmlFor="email" className="text-white">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="p-2 border border-gray-700 rounded-md" required />
                </div>
                <div className="flex flex-col gap-5 ">
                    <label htmlFor="password" className="text-white">Password (leave blank to keep unchanged)</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} className="p-2 border border-gray-700 rounded-md" />
                </div>
                <div className="flex flex-col gap-5 ">
                    <label htmlFor="profile" className="text-white">Profile Photo</label>
                    <input type="file" name="profile" accept="image/*" onChange={handleImageChange} className="p-2 border border-gray-700 rounded-md text-white" />
                    {form.profile && <img src={form.profile} alt="profile" className="w-20 h-20 rounded-full mt-2" />}
                </div>
                <div className="flex flex-col gap-5 ">
                    <label htmlFor="cheersTo" className="text-white">Cheers To</label>
                    <select name="cheersTo" value={form.cheersTo} onChange={handleChange} className="p-2 border border-gray-700 rounded-md" required>
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
                    <label htmlFor="age" className="text-white">Age</label>
                    <input type="number" name="age" value={form.age} min="18" max="100" onChange={handleChange} className="p-2 border border-gray-700 rounded-md" required />
                </div>
                <div className="flex flex-col gap-5 ">
                    <label htmlFor="gender" className="text-white">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="p-2 border border-gray-700 rounded-md" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="flex flex-col gap-5 ">
                    <label htmlFor="genderPreference" className="text-white">Gender Preference</label>
                    <select name="genderPreference" value={form.genderPreference} onChange={handleChange} className="p-2 border border-gray-700 rounded-md" required>
                        <option value="">Select Preference</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <button type="submit" className="p-2 bg-primary text-white rounded-md">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
