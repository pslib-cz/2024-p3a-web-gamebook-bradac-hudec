interface GameItem {
    id: number;
    name: string;
    imageId: string;
    description: string;
    effect: string;
    value: number;
    count?: number;
}

export default GameItem; 