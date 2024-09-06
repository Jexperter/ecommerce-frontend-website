import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

//this defines the type 'Product' with the properties stated below
type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

// I have defined the class with the properties and constructors shown below
class CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;

  constructor(id: number, name: string, price: number, quantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

// this is the main function where most of the code happen
function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortBy, setSortBy] = useState<string>('AtoZ');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [CartItems, setCartItems] = useState<CartItem[]>([]);

  //This adds items to the Cart
  const addToCart = (product: Product) => {
    const existingItemIndex = CartItems.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...CartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      const newItem = new CartItem(product.id, product.name, product.price, 1);
      setCartItems([...CartItems, newItem]);
    }
  };

  //This removes items from the cart
  const removeFromCart = (id: number) => {
    const updatedCart = CartItems.map(item => {
      if (item.id === id) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          //remove the item from Cart if the quantity is less than 1
          return null;
        }
      }
      return item;
    }).filter(Boolean) as CartItem[]; //cast to CartItem[] and filter out null items
    setCartItems(updatedCart);
  };  

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm, sortBy, inStockOnly, CartItems]);

  // ===== Cart management =====
  function showCart() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'block';
    }
  }

  function hideCart() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'none';
    }
  }

  // ===== Search =====
  function updateSearchedProducts() {
    let sortedList: Product[] = [...itemList];

    //sort section with different options
    sortedList.sort((a, b) => {
      switch (sortBy) {
        case 'ZtoA':
          return b.name.localeCompare(a.name);
        case '£LtoH':
          return a.price - b.price;
        case '£HtoL':
          return b.price - a.price;
        case '*LtoH':
          return a.rating - b.rating;
        case '*HtoL':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    //inStockOnly filter section
    if (inStockOnly) {
      sortedList = sortedList.filter(product => product.quantity > 0);
    }

    //searchTerm filter section
    const filteredList = sortedList.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchedProducts(filteredList);
  }

  //calculates the total cost of the Cart
  const calculateTotalCost = () => {
    return CartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  //get a message on how many items are there for the search term 
function getResultsMessage() {
  const numResults = searchedProducts.length;
  if (searchTerm === '') {
    return numResults === 1 ? '1 Product' : `${numResults} Products`;
  } else {
    if (numResults === 0) {
      return 'No search results found';
    } else {
      return numResults === 1 ? '1 Result' : `${numResults} Results`;
    }
  }
}


  return (
    // this is the layout and design 
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png" alt="Logo"></img>
        </div>
        <div id="shopping-icon-area">
          <img
            id="shopping-icon"
            onClick={showCart}
            src="./src/assets/shopping-Cart.png"
            alt="Shopping Cart"
          ></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideCart}>
              x
            </p>
          </div>
          {CartItems.length === 0 ? (
            <p>Your Cart is empty</p>
          ) : (
            <>
              {CartItems.map(item => (
                <div className="shopping-row" key={item.name}>
                  <div className="shopping-information">
                    <p>{item.name} (£{item.price}) - {item.quantity}</p>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              <p>Total: £{calculateTotalCost().toFixed(2)}</p>
            </>
          )}
        </div>
      </div>
      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={changeEventObject =>
            setSearchTerm(changeEventObject.target.value)
          }
        ></input>
        <div id="control-area">
          <select
            onChange={changeEventObject =>
              setSortBy(changeEventObject.target.value)
            }
          >
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input
            id="inStock"
            type="checkbox"
            onChange={changeEventObject =>
              setInStockOnly(changeEventObject.target.checked)
            }
          ></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{getResultsMessage()}</p>
      <ProductList itemList={searchedProducts} addToCart={addToCart}/>
    </div>
  );
}

export default App;
