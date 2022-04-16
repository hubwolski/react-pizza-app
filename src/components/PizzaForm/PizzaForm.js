import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "./PizzaForm.css";

const PIZZA_QUERY_FIRST = `
    {
      pizzaSizes {
        name,
        maxToppings,
        basePrice,
        toppings{
          pizzaSize{
            name
          },
          defaultSelected,
          topping{
            name,
            price
          }
        }
      }
    }
`;

export default function PizzaForm({childToParent}) {

    const [choosenToppings, setChoosenToppings] = useState([]);
    const [currentSize, setCurrentSize] = useState('')
    const [sizes, setSizes] = useState([]);
    const [isSize, setIsSize] = useState(false);
    const [sizeType, setSizeType] = useState('');
    const [pizzaMaxToppings, setPizzaMaxToppings] = useState('');
    const [pizzaToppings, setPizzaToppings] = useState('');
    const [sumPrices, setSumPrices] = useState(0);

    //Render a MaxToppings value
    useEffect(() => {
      setPizzaMaxToppings(currentSize.maxToppings);
      setPizzaToppings(currentSize.toppings)
    }, [currentSize])
   
    //Calculate pizza and toppings cost 
    useEffect(() => {
      setSumPrices(() => {
        let sumPrices = 0 ;

        choosenToppings.forEach((item) => {
        sumPrices += parseFloat(item.price);
        });
        sumPrices += currentSize.basePrice;
        setSumPrices(sumPrices.toFixed(2))
      })
    }, [choosenToppings, currentSize])

    const isMaxTop = React.useMemo(() => {
      return pizzaMaxToppings === null ? '' : choosenToppings.length > pizzaMaxToppings;
    }, [choosenToppings, pizzaMaxToppings])

    //Query to get data about PIZZA from graphql
    useEffect(() => {
        fetch('https://core-graphql.dev.waldo.photos/pizza', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: PIZZA_QUERY_FIRST })
        }).then(res => res.json())
        .then(data => {
            setSizes(data.data.pizzaSizes);
            setSizeType(data.data.pizzaSizes[0].name);
        })
    }, []);

    const handleSubmitSize = () => {
      setCurrentSize(sizes.find(size => size.name === sizeType))
      setIsSize(!!currentSize);
    }   
    
    const handleChangeSize = (event) => {
      setSizeType(event.target.value);
    }

    const handleChangeToppings = (event) => {
      let topping = {
        id: event.target.id,
        price: event.target.value,
        name: event.target.name
      }
      
      if (choosenToppings.some((item) => item.id === topping.id)) {
        let newChoosenTopping = choosenToppings.filter( (item) => item.id !== topping.id);
        setChoosenToppings(newChoosenTopping);
      } else {
        setChoosenToppings(prev => [...prev, topping]);
      }
  };

  return (
    <div className="pizza-container">
        <div className="con-item pizza-size">
            <h1>Choose a pizza size:</h1>

            <select name="size-select" className='size-select' onChange={handleChangeSize}>
                {sizes.map((size) => (
                    <option key={size.name} value={size.name}>{size.name.toUpperCase()} : {size.basePrice}</option>
                ))}
            </select>
            <button onClick={handleSubmitSize} className='size-btn'>SUBMIT SIZE</button>
        </div>

        <div className="con-item pizza-toppings">
                
                {isSize ? <React.Fragment>
                                    <h1>Choose a pizza toppings: </h1>  
                                    <h1>Toppings limit for this size is {pizzaMaxToppings === null ? 'UNLIMITED!!!' : pizzaMaxToppings}</h1>
                                    <div className='toppings-container'>

                                      {pizzaToppings.map((topping, index) => (
                                      <div className='topping-item' key={index}>
                                          <input id={index} type="checkbox" onChange={handleChangeToppings} value={topping.topping.price} name={topping.topping.name}/>
                                          <label>{topping.topping.name} : {topping.topping.price}</label>
                                      </div>
                                      ))}

                                      <h1>Full Cost: {sumPrices}</h1>

                                      {isMaxTop ? (
                                        <h1>TO MANY TOPPINGS!!!</h1>
                                      ) : (
                                        <button onClick={() => childToParent({
                                          size: sizeType,
                                          toppings: choosenToppings,
                                          price: sumPrices
                                        })}>ADD TO LIST</button>
                                      )}

                                    </div>
                                </React.Fragment> 
                : <h1>Submit Pizza size</h1>}  
        </div>
    </div>
  )
}
