import React, { useEffect , useState } from 'react';
import PizzaForm from './components/PizzaForm/PizzaForm';
import "./App.css";

function App() {
  
  const [cartItem, setCartItem] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartItems, setIsCartItems] = useState(false);
  const [newCartItems, setNewCartItems] = useState([]);
  const [fullCost, setFullCost] = useState(0);

  useEffect(() => {
    setCartItem(cartItem);
    setCartItems(prev => [...prev, cartItem]);
    setIsCartItems(!!cartItems.length)
  }, [cartItem])
  
  const childToParent = (data) => {
    setCartItem(data);
  }
  
  useEffect(() => {
    setCartItems(newCartItems);
  }, [newCartItems])

  useEffect(() => {
    let newFullCost = 0;

    cartItems.forEach(item => {
      newFullCost += parseFloat(item.price)
    });
    setFullCost(newFullCost)
  }, [cartItems])

  const handleRemove = (e) => {
    let newArr = cartItems.filter((item, index) => index.toString() !== e.target.id)
    setNewCartItems(newArr);
  }

  // const calculateCost = () => {

    
  // }

  return (
    <>
      <PizzaForm childToParent={childToParent}/>
      { isCartItems ? (   
      <table>
        <tbody>
          {cartItems.map((cartItem, index) => (
            <tr key={index}>
              <td>{cartItem.size}</td>
              <td>
                {cartItem?.toppings?.map((topping, index_2) => (
                <li key={index_2}>{topping.name}</li>
                ))}
              </td>
              <td>{cartItem.price}</td>
              <td><button id={index} onClick={handleRemove}>REMOVE FROM CART</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (null) }
      <div>
        <span>Cart Value {fullCost.toFixed(2)}</span>
      </div>
    </>
  )
}

export default App;
