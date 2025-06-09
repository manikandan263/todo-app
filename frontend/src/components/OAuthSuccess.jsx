import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TokenContext from '../context/TokenContext.js';

function OAuthSuccess() {
  const { tokenDispatch } = useContext(TokenContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("authToken", JSON.stringify(token));
      console.log("Register");
      navigate("/"); 
      window.location.reload(); 
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <div>Logging you in...</div>;
}

export default OAuthSuccess;
