import { Link } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import MenuBtn from "../components/MenuBtn";
import MenuBg from "../components/MenuBg";

const AdminMenu = () => {
  return (
    <MenuBg>
      <h1>Admin Menu</h1>
      <Link to={"/"}>
        <MenuBtn btnText="Zpět" />
      </Link>
      <AdminTable name="items" id="itemId" cols={["name", "description"]} />
      <AdminTable
        name="locations"
        id="locationId"
        cols={["name", "pokemonId", "rocketChance", "imageId", "hasPokemon"]}
      />
    </MenuBg>    
  );
};
export default AdminMenu;
