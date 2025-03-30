import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";
import Bg from "../components/Bg";
import BackBtn from "../components/BackBtn";
import AdminMenuCSS from "../styles/menus/AdminMenu.module.css";

const AdminMenu: React.FC = () => {
    const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
    const [redirectPath, setRedirectPath] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authStatus, setAuthStatus] = useState<string>("Ověřování přihlášení...");
    
    useEffect(() => {
       
        const adminUser = localStorage.getItem("adminUser");
        console.log("AdminMenu - kontrola přihlášení, adminUser v localStorage:", adminUser ? "nalezen" : "nenalezen");
        
        if (!adminUser) {
            console.log("AdminMenu - adminUser nenalezen, přesměrování na /login");
            setAuthStatus("Nejste přihlášeni. Přesměrování na přihlašovací stránku...");
            setRedirectPath("/login");
            setShouldRedirect(true);
            return;
        }
        
        try {
            const user = JSON.parse(adminUser);
            console.log("AdminMenu - parsovaná data uživatele:", user);
            
            if (!user || !user.isAdmin) {
                console.log("AdminMenu - uživatel není admin, přesměrování na /login");
                setAuthStatus("Nemáte administrátorská práva. Přesměrování na přihlašovací stránku...");
                setRedirectPath("/login");
                setShouldRedirect(true);
            } else {
                console.log("AdminMenu - uživatel je admin, zobrazení admin rozhraní");
                setAuthStatus("Přihlášení úspěšné. Vítejte v administraci.");
            }
        } catch (error) {
            console.error("AdminMenu - chyba při čtení dat uživatele:", error);
            setAuthStatus("Chyba při čtení dat uživatele. Přesměrování na přihlašovací stránku...");
           
            setRedirectPath("/login");
            setShouldRedirect(true);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleLogout = () => {
      
        console.log("AdminMenu - odhlášení uživatele");
        localStorage.removeItem("adminUser");
        setAuthStatus("Odhlášení úspěšné. Přesměrování...");
        setRedirectPath("/nickname");
        setShouldRedirect(true);
    };


    if (shouldRedirect && !isLoading) {
        console.log("AdminMenu - přesměrování na:", redirectPath);
        return <Navigate to={redirectPath} />;
    }


    if (isLoading) {
        return (
            <Bg imageId={153}>
                <div className={AdminMenuCSS.adminMenu}>
                    <h2>Načítání...</h2>
                    <p>{authStatus}</p>
                </div>
            </Bg>
        );
    }

    return (
        <Bg imageId={153}>
            <div className={AdminMenuCSS.adminMenu}>
                <h2>Admin Menu</h2>
                
                <div className={AdminMenuCSS.adminHeader}>
                    <Link to={"/"}>
                        <BackBtn btnText="Zpět" />
                    </Link>
                    <button 
                        className={AdminMenuCSS.logoutButton} 
                        onClick={handleLogout}
                    >
                        Odhlásit se
                    </button>
                </div>
                
                <AdminTable id="imageId" name="Images" cols={["name"]} />
                <AdminTable
                    name="items"
                    id="itemId"
                    cols={["name", "description", "effect", "value", "imageId"]}
                />
                <AdminTable
                    name="locations"
                    id="locationId"
                    cols={[
                        "name",
                        "pokemonId",
                        "rocketChance",
                        "imageId",
                        "hasPokemon",
                    ]}
                />
                <AdminTable
                    name="connections"
                    id="connectionId"
                    cols={["locationFromId", "locationToId"]}
                />
                <AdminTable
                    name="pokemons"
                    id="pokemonId"
                    cols={[
                        "name",
                        "health",
                        "energy",
                        "typeId",
                        "imageId",
                        "locationId",
                    ]}
                />
                <AdminTable
                    name="users"
                    id="userId"
                    cols={[
                        "email",
                        "password",
                        "isAdmin",
                    ]}
                />
            </div>
        </Bg>
    );
};

export default AdminMenu;