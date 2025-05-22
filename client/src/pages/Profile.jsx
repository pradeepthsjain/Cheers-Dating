import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { IoHeartSharp, IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const { user } = useContext(AppContext);

  const getUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/getUsers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const { data } = await res.data;
    // Backend now filters by gender and cheersTo, so only filter out disliked/favourites here
    const filteredUsers = data.filter(
      (u) =>
        u._id !== user?._id &&
        !user?.disliked?.includes(u._id) &&
        !user?.favourites?.includes(u._id)
    );
    setUsers(filteredUsers);
    setCurrentUserIndex(0); // Reset index when user list changes
  };

  const nextProfile = () =>
    currentUserIndex < users.length - 1 &&
    setCurrentUserIndex(currentUserIndex + 1);

  const addToFav = async (id) => {
    const res = await axios.put(
      "http://localhost:5000/api/addToFav/" + id,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    if (data.success === true) {
      toast.success(data.message);
      nextProfile();
    } else {
      toast.error(data.message);
    }
  };
  const addToDis = async (id) => {
    const res = await axios.put(
      "http://localhost:5000/api/addToDis/" + id,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    if (data.success === true) {
      nextProfile();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, [user]);

  return (
    <div className="flex justify-center items-center my-10 sm:my-32">
      {users.length === 0 ? (
        <div className="text-white text-xl">No matching profiles found for your Cheers To choice.</div>
      ) : (
        <div className="rounded-lg shadow-primaryLight shadow-sm w-[75vw] h-[80vw] sm:w-[25vw] sm:h-[60vh] overflow-hidden relative">
          <img
            src={users[currentUserIndex]?.profile}
            alt={users[currentUserIndex]?.profile}
            className="rounded-lg object-coverw-full h-full transition-all duration-300 ease-in-out transfrom hover:scale-105 cusor-pointer"
          />
          <div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h1 className="text-white text-2xl font-semibold">
                {users[currentUserIndex]?.name}
              </h1>
              <p className="text-white">
                Cheers To: {users[currentUserIndex]?.cheersTo}
              </p>
              <div className="flex justify-between items-center mt-2">
                {/* close button */}
                <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-red-500 p-2 transition-all duration-300 ease-in-out cursor-pointer">
                  <IoClose
                    onClick={() => addToDis(users[currentUserIndex]?._id)}
                    className="text-red-500 text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer hover:text-white"
                  />
                </div>
                {/* like button */}
                <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-blue-500 p-2 transition-all duration-300 ease-in-out cursor-pointer">
                  <IoHeartSharp
                    onClick={() => addToFav(users[currentUserIndex]?._id)}
                    className="text-blue-500 text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer hover:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
