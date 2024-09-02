import React, {useEffect, useState} from 'react';
import {
    addToDb,
    deleteShoppingCart,
    getShoppingCart,
} from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import {Link, useLoaderData} from 'react-router-dom';

/**
 * * Pagination steps :
 * 1. count the full database document
 * 2. set product per page
 * 3. count total number of pages : math.ceil(count/productPerPage)
 * 4. set pages number in Array
 * 5. create pagination button with pages.map() , also next and previous button
 * 6. set select option for specify product per page
 * 7. manage state currentPage
 * 8. Request to Backend api for product with query parameters (currentPage , productPerPage) -> fetch(`/products?page=${page}&items=${items}`)
 * 9. in the backend : set skip and limit
 *
 */

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const {count} = useLoaderData();
    const [currentPage, setCurrentPage] = useState(0);
    const [productPerPage, setProductPerPage] = useState(9);

    const totalPage = Math.ceil(count / productPerPage);
    //console.log('total pages', totalPage);
    const pages = [...Array(totalPage).keys()];
    console.log(pages);

    useEffect(() => {
        fetch(
            `http://localhost:5000/products?currentPage=${currentPage}&productPerPage=${productPerPage}`
        )
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, [currentPage, productPerPage]);

    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = products.find((product) => product._id === id);
            if (addedProduct) {
                // step 3: add quantity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products]);

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find((pd) => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product];
        } else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter((pd) => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id);
    };

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    };

    //handle page setup
    const handlePerPage = (e) => {
        setProductPerPage(e.target.value);
        setCurrentPage(0);
    };

    return (
        <section>
            <div className="shop-container">
                <div>
                    <div className="products-container">
                        {products.map((product) => (
                            <Product
                                key={product._id}
                                product={product}
                                handleAddToCart={handleAddToCart}></Product>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center m-5 gap-3">
                        <p>current page: {currentPage}</p>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage == 0}
                            className="bg-orange-600 text-white border-none">
                            prev
                        </button>

                        {pages.map((page) => (
                            <button
                                onClick={() => setCurrentPage(page)}
                                key={page}
                                className={
                                    currentPage === page
                                        ? 'bg-black text-white border-none'
                                        : 'bg-orange-600 text-white border-none'
                                }>
                                {page + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage == pages.length - 1}
                            className="bg-orange-600 text-white border-none">
                            Next
                        </button>
                        <select
                            onChange={handlePerPage}
                            className="bg-gray-300 px-3 rounded-xl">
                            <option value="9">9</option>
                            <option value="15">15</option>
                            <option value="21">21</option>
                            <option value="42">42</option>
                        </select>
                    </div>
                </div>

                <div className="cart-container">
                    <Cart cart={cart} handleClearCart={handleClearCart}>
                        <Link className="proceed-link" to="/orders">
                            <button className="btn-proceed">
                                Review Order
                            </button>
                        </Link>
                    </Cart>
                </div>
            </div>
        </section>
    );
};

export default Shop;
