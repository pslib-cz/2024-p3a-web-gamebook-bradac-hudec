import { Link } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import Bg from "../components/Bg";
import BackBtn from "../components/BackBtn";

const AdminMenu = () => {
  return (
    <Bg imageId={153}>
      <h1>Admin Menu</h1>
      <Link to={"/"}>
        <BackBtn btnText="Zpět" />
      </Link>
      <AdminTable name="items" id="itemId" cols={["name", "description"]} />
      <AdminTable
        name="locations"
        id="locationId"
        cols={["name", "pokemonId", "rocketChance", "imageId", "hasPokemon"]}
      />
      <AdminTable
        name="connections"
        id="connectionId"
        cols={["locationFromId", "locationToId"]}
      />
      <AdminTable
        name="pokemons"
        id="pokemonId"
        cols={["name", "imageId", "locationId", "energy", "health", "typeId"]}
      />
    </Bg>    
  );
};
export default AdminMenu;
