
const num = Math.floor(Math.random() * 20) + 1;
const color = "gray";

export default function Dice() {

    return (
        <div className="dice">
            <h1 title={color.toUpperCase()}>Dice roll</h1>
            <p>Roll = {num}</p> 
            <p>Color = {color}</p>
            <p>{num % 2 === 0 ? "Even" : "Odd"}</p>
        </div>
    )
}