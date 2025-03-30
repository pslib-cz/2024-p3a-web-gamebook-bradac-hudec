  if (parsedPokemons.length < 6) {
    console.log(`Pokus o vstup do lokace ${locId} s ${parsedPokemons.length} pokémony. Potřeba 6.`);
    setCurrentMessage("Pro vstup do této oblasti potřebuješ tým 6 pokémonů!");
    
    // Odstraníme výpočet validních lokací, protože bude proveden později při kliknutí na StoryBox
    return;
  } 

  // Kontrola, zda má hráč dostatečný počet pokémonů pro lokace 17, 18 a 19
  if ([17, 18, 19].includes(locId)) {
    // Zjistíme, kolik má hráč pokémonů
    const savedPokemons = localStorage.getItem("playerPokemons");
    const parsedPokemons = savedPokemons ? JSON.parse(savedPokemons) : [];
    
    if (parsedPokemons.length < 6) {
      console.log(`Pokus o vstup do lokace ${locId} s ${parsedPokemons.length} pokémony. Potřeba 6.`);
      setCurrentMessage("Pro vstup do této oblasti potřebuješ tým 6 pokémonů!");
      
      // Odstraňujeme automatické přesměrování - bude provedeno při kliknutí v StoryBox
      return;
    }
  } 