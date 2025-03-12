interface GameItem {
    itemId: number;
    name: string;
    description: string;
    effect: "heal" | "energy" | "other"; 
    value: number;                       
    imageId: number;
  }
  
  export default GameItem;