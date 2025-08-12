import { useState, useEffect } from "react";
import axios from "axios";

export default function useUserInfo(email) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Email passed to hook:", email);

    if (!email) return;


    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/Users?email=${email}`);
        console.log("User info response:", res);
        setUserInfo(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [email]);

  return { userInfo, loading, error };
}
