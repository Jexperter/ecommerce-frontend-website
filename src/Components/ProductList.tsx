import '../App';

type Product = {
	id: number
	name: string
	price: number
	category: string
	quantity: number
	rating: number
	image_link: string
}

type ContentAreaProps = {
	itemList: Product[];
	addToCart: (product: Product) => void; //addToCart prop is defined
  };
  
  export const ProductList = (props: ContentAreaProps) => {
	return (
	  <div id="productList">
		{props.itemList.map((item) => {
		  return (
			<div key={item.id} className="product"> {/* key is used as item.id*/}
			  <div className="product-top-bar">
				<h2>{item.name}</h2>
				<p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
			  </div>
			  <img src={"./src/Assets/Product_Images/" + item.image_link} alt={item.name} /> {/* text alt added */}
			  {item.quantity > 0 ? (
				<button onClick={() => props.addToCart(item)}>Add to Cart</button>//adds to the basket
			  ) : (
				<button disabled>Out of stock</button>
			  )}
			</div>
		  );
		})}
	  </div>
	);
  };
  