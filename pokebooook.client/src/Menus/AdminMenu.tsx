import { Link } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import MenuBg from "../components/MenuBg";
import BackBtn from "../components/BackBtn";

const AdminMenu = () => {
  return (
    <MenuBg>
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
    </MenuBg>    
  );
};
export default AdminMenu;
