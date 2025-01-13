import AdminTable from "../components/AdminTable";



const AdminMenu = () => {


    return (
        <div>
            <h1>Admin Menu</h1>
            <AdminTable name="items" id="itemId" cols={["name", "description"]}/>
            <AdminTable name="locations" id="locationId" cols={["name", "pokemonId", "rocketChance", "imageId", "hasPokemon"]}/>
        </div>
    );
 }
export default AdminMenu;