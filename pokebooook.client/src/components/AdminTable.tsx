import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import AdminTableCSS from "../styles/components/AdminTable.module.css";
import { API_URL } from "../env";

type AdminTableProps = {
  id: string;
  name: string;
  cols: string[];
};

interface TableRow {
  [key: string]: string | number;
}

const fetchData = async (name: string) => {
  const response = await fetch(`${API_URL}api/${name}`);
  return await response.json();
};

const addData = async (name: string, data: TableRow) => {
  try {
    if (name.toLowerCase() === "items") {
      if (!data.name) {
        throw new Error("Jméno položky je povinné");
      }

      const requiredFields = [
        "name",
        "description",
        "effect",
        "value",
        "imageId",
      ];
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === "") {
          throw new Error(`Pole ${field} je povinné`);
        }
      }

      if (typeof data.value !== "number") {
        data.value = parseInt(data.value?.toString() || "0") || 0;
      }

      if (typeof data.imageId !== "number") {
        data.imageId = parseInt(data.imageId?.toString() || "1") || 1;
      }
    }

    console.log(
      `Odesílám POST požadavek na ${name}:`,
      JSON.stringify(data, null, 2)
    );

    const response = await fetch(`${API_URL}api/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chyba při vytváření ${name}:`, response.status, errorText);
      throw new Error(
        `Chyba: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Chyba při vytváření ${name}:`, error);
    throw error;
  }
};

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}api/Images/upload`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};

const updateData = async (
  name: string,
  id: string,
  data: TableRow,
  newId?: string
) => {
  console.log(
    `Updating ${name} with ID ${data[id]}`,
    JSON.stringify(data, null, 2)
  );

  try {
    if (name === "Images" && newId && newId !== data[id]) {
      const getResponse = await fetch(`${API_URL}api/Images/${data[id]}`);

      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        console.error(
          `Chyba při získávání dat obrázku:`,
          getResponse.status,
          errorText
        );
        throw new Error(
          `Server vrátil chybu: ${getResponse.status} ${getResponse.statusText}\n${errorText}`
        );
      }

      const currentImageData = await getResponse.json();

      const response = await fetch(`${API_URL}api/Images/${data[id]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentImageData,
          imageId: parseInt(newId),
          name: data.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Chyba při aktualizaci obrázku:`,
          response.status,
          errorText
        );
        throw new Error(
          `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
        );
      }
      return;
    } else if (name === "Images") {
      const getResponse = await fetch(`${API_URL}api/Images/${data[id]}`);

      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        console.error(
          `Chyba při získávání dat obrázku:`,
          getResponse.status,
          errorText
        );
        throw new Error(
          `Server vrátil chybu: ${getResponse.status} ${getResponse.statusText}\n${errorText}`
        );
      }

      const currentImageData = await getResponse.json();

      const response = await fetch(`${API_URL}api/Images/${data[id]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentImageData,
          name: data.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Chyba při aktualizaci obrázku:`,
          response.status,
          errorText
        );
        throw new Error(
          `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      return;
    }

    const response = await fetch(`${API_URL}api/${name}/${data[id]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Chyba při aktualizaci ${name}:`,
        response.status,
        errorText
      );
      throw new Error(
        `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    if (response.status !== 204) {
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          await response.json();
        }
      } catch {
        console.log(
          "Odpověď serveru neobsahuje validní JSON, ale operace proběhla úspěšně."
        );
      }
    }
  } catch (error) {
    console.error(`Chyba při aktualizaci ${name}:`, error);
    throw error;
  }
};

interface PokemonAttack {
  pokemonAttackId: number;
  attackName: string;
  energyCost: number;
  baseDamage: number;
}

interface Attack {
  attackId: number;
  name: string;
  energyCost: number;
  baseDamage: number;
}

const PokemonAttacksManager: React.FC<{
  pokemonId: number;
  onUpdate: () => void;
}> = ({ pokemonId, onUpdate }) => {
  const [attacks, setAttacks] = useState<PokemonAttack[]>([]);
  const [availableAttacks, setAvailableAttacks] = useState<Attack[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pokemonResponse = await fetch(
          `${API_URL}api/Pokemons/${pokemonId}`
        );

        if (!pokemonResponse.ok) {
          throw new Error(
            `Nepodařilo se načíst údaje o pokémonovi. Status: ${pokemonResponse.status}`
          );
        }

        const pokemonData = await pokemonResponse.json();
        setAttacks(pokemonData.pokemonAttacks || []);

        const attacksResponse = await fetch(`${API_URL}api/Attacks`);

        if (!attacksResponse.ok) {
          throw new Error(
            `Nepodařilo se načíst seznam útoků. Status: ${attacksResponse.status}`
          );
        }

        const attacksData = await attacksResponse.json();
        setAvailableAttacks(attacksData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Neznámá chyba";
        setError(`Chyba při načítání dat: ${errorMessage}`);
        console.error("Chyba při načítání dat pro PokemonAttacksManager:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonId]);

  const handleAddAttack = async () => {
    if (!selectedAttack) {
      alert("Prosím vyberte útok k přidání.");
      return;
    }

    try {
      const attackId = parseInt(selectedAttack);

      const response = await fetch(`${API_URL}api/PokemonAttacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attackId: attackId,
          pokemonId: pokemonId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Nepodařilo se přidat útok. Status: ${response.status}. ${errorText}`
        );
      }

      const newAttack = await response.json();

      setAttacks([...attacks, newAttack]);
      setSelectedAttack("");
      onUpdate();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Neznámá chyba";
      alert(`Chyba při přidávání útoku: ${errorMessage}`);
      console.error("Chyba při přidávání útoku:", err);
    }
  };

  const handleDeleteAttack = async (attackId: number) => {
    if (!confirm("Opravdu chcete smazat tento útok?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/PokemonAttacks/${attackId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Nepodařilo se smazat útok. Status: ${response.status}. ${errorText}`
        );
      }

      setAttacks(
        attacks.filter((attack) => attack.pokemonAttackId !== attackId)
      );
      onUpdate(); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Neznámá chyba";
      alert(`Chyba při mazání útoku: ${errorMessage}`);
      console.error("Chyba při mazání útoku:", err);
    }
  };

  if (loading) {
    return <div>Načítání útoků...</div>;
  }

  if (error) {
    return <div className={AdminTableCSS.error}>{error}</div>;
  }

  return (
    <div className={AdminTableCSS.attacksManager}>
      <h4>Útoky pokémona</h4>

      {attacks.length === 0 ? (
        <p>Tento pokémon nemá přiřazené žádné útoky.</p>
      ) : (
        <table className={AdminTableCSS.adminTable__table}>
          <thead>
            <tr>
              <th className={AdminTableCSS.adminTable__th}>ID</th>
              <th className={AdminTableCSS.adminTable__th}>Název</th>
              <th className={AdminTableCSS.adminTable__th}>Energie</th>
              <th className={AdminTableCSS.adminTable__th}>Poškození</th>
              <th className={AdminTableCSS.adminTable__th}>Akce</th>
            </tr>
          </thead>
          <tbody>
            {attacks.map((attack) => (
              <tr
                key={attack.pokemonAttackId}
                className={AdminTableCSS.adminTable__tr}
              >
                <td className={AdminTableCSS.adminTable__td}>
                  {attack.pokemonAttackId}
                </td>
                <td className={AdminTableCSS.adminTable__td}>
                  {attack.attackName}
                </td>
                <td className={AdminTableCSS.adminTable__td}>
                  {attack.energyCost}
                </td>
                <td className={AdminTableCSS.adminTable__td}>
                  {attack.baseDamage}
                </td>
                <td className={AdminTableCSS.adminTable__td}>
                  <button
                    className={`${AdminTableCSS["adminTable__button"]} ${AdminTableCSS["adminTable__button--delete"]}`}
                    onClick={() => handleDeleteAttack(attack.pokemonAttackId)}
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={AdminTableCSS.attacksManager__add}>
        <select
          value={selectedAttack}
          onChange={(e) => setSelectedAttack(e.target.value)}
          className={AdminTableCSS.adminTable__input}
        >
          <option value="">-- Vyberte útok --</option>
          {availableAttacks.map((attack) => (
            <option key={attack.attackId} value={attack.attackId}>
              {attack.name} (Poškození: {attack.baseDamage}, Energie:{" "}
              {attack.energyCost})
            </option>
          ))}
        </select>
        <button
          className={AdminTableCSS.adminTable__button}
          onClick={handleAddAttack}
        >
          Přidat útok
        </button>
      </div>
    </div>
  );
};

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRoot = document.body;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className={AdminTableCSS.modal}>
      <div className={AdminTableCSS.modalContent}>
        <span className={AdminTableCSS.closeModal} onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>,
    modalRoot
  );
};


const PokemonNameCell: React.FC<{
  row: TableRow;
  col: string;
  onNameChange: (value: string) => void;
  name: string;
  fetchData: (name: string) => Promise<TableRow[]>;
  setData: React.Dispatch<React.SetStateAction<TableRow[]>>;
}> = ({ row, col, onNameChange, name, fetchData, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <input
        type="text"
        defaultValue={row[col] as string}
        className={AdminTableCSS.adminTable__input}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <button
        className={AdminTableCSS.adminTable__button}
        onClick={() => setIsModalOpen(true)}
      >
        Spravovat útoky
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3>Správa útoků pro pokémona {row.name}</h3>
          <PokemonAttacksManager
            pokemonId={row.pokemonId as number}
            onUpdate={() => {
        
              const refreshData = async () => {
                try {
                  const refreshedData = await fetchData(name);
                  setData(refreshedData);
                } catch (err) {
                  console.error("Chyba při obnovování dat:", err);
                }
              };
              refreshData();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

const AdminTable: React.FC<AdminTableProps> = ({ id, name, cols }) => {
  const [data, setData] = useState<TableRow[]>([]);
  const [newRow, setNewRow] = useState<TableRow>({});
  const [editingId, setEditingId] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData(name);
        if (name === "Images") {
          const simplifiedData = result.map((item: TableRow) => ({
            imageId: item.imageId,
            name: item.name,
          }));
          setData(simplifiedData);
        } else {
          setData(result);
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };
    fetchDataAsync();
  }, [name]);

  const handleAddRow = async () => {
    try {
      if (name === "Images" && selectedFile) {
        const uploadedImage = await uploadImage(selectedFile);
        setData([...data, uploadedImage]);
        setSelectedFile(null);
      } else {
        const rowToAdd = { ...newRow };

   
        if (name.toLowerCase() === "items") {
          const requiredFields = [
            "name",
            "description",
            "effect",
            "value",
            "imageId",
          ];
          const missingFields = requiredFields.filter(
            (field) => !rowToAdd[field]
          );

          if (missingFields.length > 0) {
            throw new Error(`Chybí povinná pole: ${missingFields.join(", ")}`);
          }


          rowToAdd.value = parseInt(rowToAdd.value?.toString() || "0");
          rowToAdd.imageId = parseInt(rowToAdd.imageId?.toString() || "1");

      
          if (isNaN(rowToAdd.value)) {
            throw new Error("Hodnota (value) musí být číslo");
          }

          if (isNaN(rowToAdd.imageId)) {
            throw new Error("ID obrázku (imageId) musí být číslo");
          }

          
          const itemToAdd = {
            name: rowToAdd.name,
            description: rowToAdd.description,
            effect: rowToAdd.effect,
            value: rowToAdd.value,
            imageId: rowToAdd.imageId,
          };

          
          const requestData = [itemToAdd];

          console.log(
            "Odesílám data pro položku (item):",
            JSON.stringify(requestData, null, 2)
          );

        
          const response = await fetch(`${API_URL}api/${name}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Chyba při vytváření položky:`,
              response.status,
              errorText
            );
            throw new Error(
              `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
            );
          }

          const addedRow = await response.json();
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        } else if (name.toLowerCase() === "locations") {
  
          if (rowToAdd.pokemonId) {
            rowToAdd.pokemonId = parseInt(rowToAdd.pokemonId.toString()) || 0;
          }

          if (rowToAdd.rocketChance) {
            rowToAdd.rocketChance =
              parseFloat(rowToAdd.rocketChance.toString()) || 0;
          }

          if (rowToAdd.imageId) {
            rowToAdd.imageId = parseInt(rowToAdd.imageId.toString()) || 1;
          }

      
       
          const locationId = rowToAdd.locationId
            ? parseInt(rowToAdd.locationId.toString())
            : undefined;

      
          if (!rowToAdd.name) {
            throw new Error("Pole 'name' je povinné");
          }

         
          if (locationId !== undefined && isNaN(locationId)) {
            throw new Error("ID lokace musí být číslo");
          }

          const locationToAdd = {
            locationId: locationId,
            name: rowToAdd.name as string,
            hasPokemon: rowToAdd.hasPokemon === "true", 
            rocketChance: parseFloat(rowToAdd.rocketChance?.toString() || "0"),
            pokemonId: parseInt(rowToAdd.pokemonId?.toString() || "0"),
            imageId: parseInt(rowToAdd.imageId?.toString() || "1"),
            descriptions: ["Toto místo jsi ještě neprozkoumal."],
          };

          console.log(
            "Odesílám data pro lokaci:",
            JSON.stringify(locationToAdd, null, 2)
          );

        
          const response = await fetch(`${API_URL}api/${name}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(locationToAdd),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Chyba při vytváření lokace:`,
              response.status,
              errorText
            );
            throw new Error(
              `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
            );
          }

          const addedRow = await response.json();
          console.log("Přidaná lokace:", addedRow);
          setData([...data, addedRow]);
        } else if (name.toLowerCase() === "pokemons") {
          
          if (rowToAdd.imageId) {
            rowToAdd.imageId = parseInt(rowToAdd.imageId.toString()) || 1;
          }

          if (rowToAdd.locationId) {
            rowToAdd.locationId = parseInt(rowToAdd.locationId.toString()) || 0;
          }

          if (rowToAdd.energy) {
            rowToAdd.energy = parseInt(rowToAdd.energy.toString()) || 100;
          }

          if (rowToAdd.health) {
            rowToAdd.health = parseInt(rowToAdd.health.toString()) || 100;
          }

          if (rowToAdd.typeId) {
            rowToAdd.typeId = parseInt(rowToAdd.typeId.toString()) || 1;
          }

         
          const pokemonToAdd = {
            ...rowToAdd,
            pokemonAttacks: [], 
          };

          console.log(
            "Odesílám data pro pokémona:",
            JSON.stringify([pokemonToAdd], null, 2)
          );

        
          const response = await fetch(`${API_URL}api/${name}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([pokemonToAdd]), 
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Chyba při vytváření pokémona:`,
              response.status,
              errorText
            );
            throw new Error(
              `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
            );
          }

          const addedRows = await response.json();
          if (Array.isArray(addedRows) && addedRows.length > 0) {
            console.log("Přidaný řádek:", addedRows[0]);
            setData([...data, addedRows[0]]);
          } else {
            console.log("Přidaný řádek:", addedRows);
            setData([...data, addedRows]);
          }
        } else if (name.toLowerCase() === "connections") {
          if (rowToAdd.locationFromId) {
            rowToAdd.locationFromId = parseInt(
              rowToAdd.locationFromId.toString()
            );
          }

          if (rowToAdd.locationToId) {
            rowToAdd.locationToId = parseInt(rowToAdd.locationToId.toString());
          }

          console.log(
            "Odesílám data pro spojení:",
            JSON.stringify(rowToAdd, null, 2)
          );
          const addedRow = await addData(name, rowToAdd);
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        } else {
          console.log(
            `Odesílám data pro ${name}:`,
            JSON.stringify(rowToAdd, null, 2)
          );
          const addedRow = await addData(name, rowToAdd);
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        }
      }
      setNewRow({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Neznámá chyba";
      setError(`Chyba při přidávání řádku: ${errorMessage}`);
      console.error("Chyba při přidávání řádku:", err);

      alert(`Nepodařilo se přidat řádek: ${errorMessage}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSaveRow = async (row: TableRow) => {
    try {
      const newId = editingId[row[id]];

      if (name === "Images") {
        await updateData(name, id, row, newId);

        try {
          const refreshedData = await fetchData(name);
          const simplifiedData = refreshedData.map((item: TableRow) => ({
            imageId: item.imageId,
            name: item.name,
          }));
          setData(simplifiedData);
        } catch (error) {
          console.error(
            "Chyba při obnovování dat po aktualizaci obrázku:",
            error
          );
          alert(
            "Obrázek byl aktualizován, ale nepodařilo se obnovit tabulku. Obnovte prosím stránku."
          );
        }

        setEditingId({});
        alert("Změny byly úspěšně uloženy.");
        return;
      }

      if (name.toLowerCase() === "items" && typeof row.value === "string") {
        row.value = parseInt(row.value) || 0;
      }

      if (name.toLowerCase() === "pokemons") {
        const numericFields = [
          "health",
          "energy",
          "typeId",
          "imageId",
          "locationId",
        ];
        const pokemonData = { ...row };

        numericFields.forEach((field) => {
          if (typeof pokemonData[field] === "string") {
            pokemonData[field] = parseInt(pokemonData[field] as string) || 0;
          }
        });

        const response = await fetch(`${API_URL}api/Pokemons/${row[id]}`);

        if (response.ok) {
          const serverPokemonData = await response.json();
          const attacks = serverPokemonData.pokemonAttacks || [];

          const putResponse = await fetch(`${API_URL}api/${name}/${row[id]}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...pokemonData,
              pokemonAttacks: attacks,
            }),
          });

          if (!putResponse.ok) {
            const errorText = await putResponse.text();
            console.error(
              `Chyba při aktualizaci pokémona:`,
              putResponse.status,
              errorText
            );
            throw new Error(
              `Server vrátil chybu: ${putResponse.status} ${putResponse.statusText}\n${errorText}`
            );
          }
        } else {
          const putResponse = await fetch(`${API_URL}api/${name}/${row[id]}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...pokemonData,
              pokemonAttacks: [],
            }),
          });

          if (!putResponse.ok) {
            const errorText = await putResponse.text();
            console.error(
              `Chyba při aktualizaci pokémona:`,
              putResponse.status,
              errorText
            );
            throw new Error(
              `Server vrátil chybu: ${putResponse.status} ${putResponse.statusText}\n${errorText}`
            );
          }
        }

        try {
          const refreshedData = await fetchData(name);
          setData(refreshedData);
        } catch (error) {
          console.error("Chyba při obnovování dat po aktualizaci:", error);
          alert(
            "Data byla aktualizována, ale nepodařilo se obnovit tabulku. Obnovte prosím stránku."
          );
        }
        setEditingId({});
        return;
      }

     
      await updateData(name, id, row, newId);

      try {
        const refreshedData = await fetchData(name);
        if (name === "Images") {
          const simplifiedData = refreshedData.map((item: TableRow) => ({
            imageId: item.imageId,
            name: item.name,
          }));
          setData(simplifiedData);
        } else {
          setData(refreshedData);
        }
      } catch (error) {
        console.error("Chyba při obnovování dat po aktualizaci:", error);
        alert(
          "Data byla aktualizována, ale nepodařilo se obnovit tabulku. Obnovte prosím stránku."
        );
      }

      setEditingId({});

   
      alert("Změny byly úspěšně uloženy.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Neznámá chyba";
      setError(`Chyba při ukládání řádku: ${errorMessage}`);
      console.error("Chyba při ukládání řádku:", err);

   
      alert(`Nepodařilo se uložit změny: ${errorMessage}`);
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    try {
      console.log(`Pokus o smazání záznamu s ID: ${rowId}`);

  
      if (name.toLowerCase() === "pokemons") {
        
        const pokemonResponse = await fetch(`${API_URL}api/Pokemons/${rowId}`);
        if (pokemonResponse.ok) {
          const pokemonData = await pokemonResponse.json();
          if (
            pokemonData.pokemonAttacks &&
            pokemonData.pokemonAttacks.length > 0
          ) {
            console.log(
              `Pokémon ${rowId} má ${pokemonData.pokemonAttacks.length} útoků, které budou smazány.`
            );

          
            for (const attack of pokemonData.pokemonAttacks) {
              try {
                const deleteAttackResponse = await fetch(
                  `${API_URL}api/PokemonAttacks/${attack.pokemonAttackId}`,
                  {
                    method: "DELETE",
                  }
                );

                if (!deleteAttackResponse.ok) {
                  console.error(
                    `Nepodařilo se smazat útok ${attack.pokemonAttackId}`
                  );
                }
              } catch (err) {
                console.error(`Chyba při mazání útoku:`, err);
              }
            }
          }
        }
      }

    
      const response = await fetch(`${API_URL}api/${name}/${rowId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Chyba při mazání záznamu:`, response.status, errorText);
        throw new Error(
          `Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const updatedData = data.filter((row) => {
        const currentRowId = String(row[id]);
        const targetId = String(rowId);
        return currentRowId !== targetId;
      });

      setData(updatedData);

      
      alert(`Záznam byl úspěšně smazán.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Neznámá chyba";
      setError(`Chyba při mazání záznamu: ${errorMessage}`);
      console.error("Chyba při mazání záznamu:", err);

      
      alert(`Nepodařilo se smazat záznam: ${errorMessage}`);
    }
  };

  const handleDeleteClick = (rowId: string) => {
    if (confirm(`Opravdu chcete smazat tento záznam?`)) {
      handleDeleteRow(rowId);
    }
  };

  const renderIdCell = (row: TableRow) => {
    if (name === "Images") {
      return (
        <td className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[id]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => {
              setEditingId({
                ...editingId,
                [row[id]]: e.target.value,
              });
            }}
          />
        </td>
      );
    }
    return <td className={AdminTableCSS.adminTable__td}>{row[id]}</td>;
  };

  const renderCell = (row: TableRow, col: string) => {
    if (name === "Images" && col === "name") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={`${API_URL}api/Images/${row.imageId}`}
              alt={row.name as string}
              className={AdminTableCSS.imagePreview}
            />
            <input
              type="text"
              defaultValue={row[col]}
              className={AdminTableCSS.adminTable__input}
              onChange={(e) => (row[col] = e.target.value)}
            />
          </div>
        </td>
      );
    }

  
    if (name.toLowerCase() === "items" && col === "effect") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <select
            defaultValue={(row[col] as string) || "other"}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = e.target.value)}
          >
            <option value="heal">heal</option>
            <option value="energy">energy</option>
            <option value="other">other</option>
          </select>
        </td>
      );
    }

    if (name.toLowerCase() === "items" && col === "value") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[col]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = parseInt(e.target.value) || 0)}
          />
        </td>
      );
    }


    if (name.toLowerCase() === "locations" && col === "hasPokemon") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <select
            defaultValue={row[col]?.toString() || "false"}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = e.target.value)}
          >
            <option value="true">Ano</option>
            <option value="false">Ne</option>
          </select>
        </td>
      );
    }


    if (
      name.toLowerCase() === "locations" &&
      (col === "pokemonId" || col === "rocketChance" || col === "imageId")
    ) {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[col]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) =>
              (row[col] = e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </td>
      );
    }

    if (name.toLowerCase() === "locations" && col === "locationId") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[col]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) =>
              (row[col] = e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </td>
      );
    }


    if (name.toLowerCase() === "pokemons" && col === "name") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <PokemonNameCell
            row={row}
            col={col}
            onNameChange={(value) => (row[col] = value)}
            name={name}
            fetchData={fetchData}
            setData={setData}
          />
        </td>
      );
    }

    return (
      <td key={col} className={AdminTableCSS.adminTable__td}>
        <input
          type="text"
          defaultValue={row[col]}
          className={AdminTableCSS.adminTable__input}
          onChange={(e) => (row[col] = e.target.value)}
        />
      </td>
    );
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  let displayCols = [...cols];

  if (name.toLowerCase() === "locations" && !cols.includes("locationId")) {
    displayCols = ["locationId", ...cols];
  }

  if (error) {
    return <div className={AdminTableCSS.error}>{error}</div>;
  }

  return (
    <div className={AdminTableCSS.adminTable}>
      <h3 className={AdminTableCSS.adminTable__heading}>{name}</h3>

      <div className={AdminTableCSS.adminTable__filter}>
        <input
          type="text"
          placeholder="Hledat..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {name === "Images" && (
        <div className={AdminTableCSS.imageUpload}>
          <label className={AdminTableCSS.imageUpload__label}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={AdminTableCSS.imageUpload__input}
            />
            Nahrát obrázek
          </label>
          {selectedFile && (
            <button
              className={AdminTableCSS.adminTable__button}
              onClick={handleAddRow}
            >
              Uložit obrázek
            </button>
          )}
        </div>
      )}

      <table className={AdminTableCSS.adminTable__table}>
        <thead>
          <tr>
            <th className={AdminTableCSS.adminTable__th}>ID</th>
            {displayCols.map((col, index) => (
              <th key={index} className={AdminTableCSS.adminTable__th}>
                {col}
              </th>
            ))}
            <th className={AdminTableCSS.adminTable__th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => {
            return (
              <tr key={row[id]} className={AdminTableCSS.adminTable__tr}>
                {renderIdCell(row)}
                {displayCols.map((col) => renderCell(row, col))}
                <td className={AdminTableCSS.adminTable__td}>
                  <button
                    className={AdminTableCSS.adminTable__button}
                    onClick={() => handleSaveRow(row)}
                  >
                    Uložit
                  </button>
                  <button
                    className={`${AdminTableCSS["adminTable__button"]} ${AdminTableCSS["adminTable__button--delete"]}`}
                    onClick={() => handleDeleteClick(row[id].toString())}
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            );
          })}
          {name !== "Images" && (
            <tr className={AdminTableCSS.adminTable__tr}>
              <td className={AdminTableCSS.adminTable__td}>New</td>
              {displayCols.map((col, index) => (
                <td key={index} className={AdminTableCSS.adminTable__td}>
                  {name.toLowerCase() === "items" && col === "effect" ? (
                    <select
                      value={(newRow[col] as string) || "other"}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    >
                      <option value="heal">heal</option>
                      <option value="energy">energy</option>
                      <option value="other">other</option>
                    </select>
                  ) : name.toLowerCase() === "items" && col === "value" ? (
                    <input
                      type="number"
                      value={newRow[col] || "0"}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({
                          ...newRow,
                          [col]: parseInt(e.target.value) || 0,
                        });
                      }}
                    />
                  ) : name.toLowerCase() === "locations" &&
                    col === "hasPokemon" ? (
                    <select
                      value={(newRow[col] as string) || "false"}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    >
                      <option value="true">Ano</option>
                      <option value="false">Ne</option>
                    </select>
                  ) : name.toLowerCase() === "locations" &&
                    (col === "pokemonId" ||
                      col === "rocketChance" ||
                      col === "imageId") ? (
                    <input
                      type="number"
                      value={newRow[col] || ""}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    />
                  ) : name.toLowerCase() === "locations" &&
                    col === "locationId" ? (
                    <input
                      type="number"
                      value={newRow[col] || ""}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                      placeholder="Ponech prázdné pro automatické ID"
                    />
                  ) : (
                    <input
                      type="text"
                      value={newRow[col] || ""}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    />
                  )}
                </td>
              ))}
              <td className={AdminTableCSS.adminTable__td}>
                <button
                  className={AdminTableCSS.adminTable__button}
                  onClick={handleAddRow}
                >
                  Přidat
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
