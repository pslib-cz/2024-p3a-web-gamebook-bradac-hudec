import { Link } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import Bg from "../components/Bg";
import BackBtn from "../components/BackBtn";
import AdminMenuCSS from "./AdminMenu.module.css";

const AdminMenu: React.FC = () => {
    return (
        <Bg imageId={153}>
            <div className={AdminMenuCSS.adminMenu}>
                <h2>Admin Menu</h2>
                <Link to={"/"}>
                    <BackBtn btnText="Zpět" />
                </Link>
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
                        "imageId",
                        "locationId",
                        "energy",
                        "health",
                        "typeId",
                    ]}
                />
            </div>
        </Bg>
    );
};

export default AdminMenu;