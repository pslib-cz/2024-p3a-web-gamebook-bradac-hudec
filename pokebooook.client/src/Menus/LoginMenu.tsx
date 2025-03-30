import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Bg from "../components/Bg";
import BackBtn from "../components/BackBtn";
import LoginMenuCSS from "../styles/menus/LoginMenu.module.css";
import { API_URL } from "../env";


interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    userId: number;
    email: string;
    isAdmin: boolean;
  };
}

const LoginMenu: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
  
      if (!email || !password) {
        setError("Vyplňte prosím email a heslo");
        setLoading(false);
        return;
      }

    
      const loginData = {
        email: email,
        password: password
      };


   
      const response = await fetch(`${API_URL}api/Users/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

     
      const responseText = await response.text();

      let data: LoginResponse;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        setError("Chyba při zpracování odpovědi - neplatný JSON");
        console.error("Chyba při parsování JSON:", error);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        
        setError(data.message || `Chyba: ${response.status} ${response.statusText}`);
        return;
      }

      if (!data.success) {
        setError(data.message || "Přihlášení selhalo");
        return;
      }

      
      if (data.user) {
      
        const userData = {
          userId: data.user.userId,
          email: data.user.email,
          isAdmin: data.user.isAdmin
        };
        
        localStorage.setItem("adminUser", JSON.stringify(userData));

      
        setLoginSuccess(true);
      } else {
        setError("Chyba v odpovědi serveru - chybí údaje o uživateli");
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Došlo k chybě při komunikaci se serverem: ${errorMessage}`);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  
  if (loginSuccess) {
    return <Navigate to="/admin" />;
  }

  return (
    <Bg imageId={300}>
      <div className={LoginMenuCSS["login-container"]}>
        <h2>Přihlášení</h2>
        
        {error && <div className={LoginMenuCSS["error-message"]}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className={LoginMenuCSS["form-group"]}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className={LoginMenuCSS["form-group"]}>
            <label htmlFor="password">Heslo</label>
            <input
              type="password"
              id="password"
              placeholder="Heslo"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className={LoginMenuCSS["button-group"]}>
            <button type="submit" className={LoginMenuCSS["login-button"]} disabled={loading}>
              {loading ? "Přihlašování..." : "Přihlásit"}
            </button>
            
            <Link to="/">
              <BackBtn btnText="Zpět" />
            </Link>
          </div>
        </form>
      </div>
    </Bg>
  );
};

export default LoginMenu; 