import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "./PizzaSummary.css";

export default function PizzaSummary({data} , {updateValue}) {

  const [newCartItems, setNewCartItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartItems, setIsCartItems] = useState(false);

  useEffect(() => {
    setCartItems(data);
    setIsCartItems(!!cartItems.length)
    
    console.log({cartItemsSUMMARY: cartItems})
  }, [data])
  
  useEffect(() => {
    setCartItems(newCartItems);
  }, [newCartItems])

  const handleRemove = (e) => {
    console.log({dwqdwq: e.target.id})

    let newArr = cartItems.filter((item, index) => index.toString() !== e.target.id)
    setNewCartItems(newArr);
    // let newCartItems = cartItems.filter((item, index) => console.log({index}))
    
    updateValue = () => (cartItems);
    console.log({cartItemsfewfewf: cartItems})
  }
  
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
