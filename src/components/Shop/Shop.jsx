import React, {useEffect, useState} from 'react';
import {
    addToDb,
    deleteShoppingCart,
    getShoppingCart,
} from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import {Link} from 'react-router-dom';
import Pagination from '../Pagination/Pagination';

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

/**
 *
 *  * Sort Steps:
 * 1. select option for sort
 * 2. manage state for sorting like 'asc' and 'desc'
 * 3. get Fetch API request with query parameters
 * 4. On the backend: get query parameter and set condition
 * 5. then sort()
 *
 */

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [productPerPage, setProductPerPage] = useState(9);
    const [sortOrder, setSortOrder] = useState('desc');

    const totalPage = Math.ceil(count / productPerPage);
    const pages = [...Array(totalPage).keys()];

    useEffect(() => {
        fetch(
            `https://ema-john-pagination-server-starter-eight.vercel.app/products?currentPage=${currentPage}&productPerPage=${productPerPage}&sortOrder=${sortOrder}`
        )
            .then((res) => res.json())
            .then((data) => {
                setCount(data.totalProducts);
                setProducts(data.products);
            });
    }, [currentPage, productPerPage, sortOrder]);

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

    //sort handle
    const handleSortOrder = (e) => {
        setSortOrder(e.target.value);
        console.log(sortOrder);
    };

    return (
        <section>
            <div className="shop-container grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    {/* Sort */}
                    <div>
                        <select
                            onChange={handleSortOrder}
                            className="select select-bordered bg-violet-600 h-10 text-white">
                            <option disabled selected>
                                Sort by price
                            </option>
                            <option value="asc">Low to high</option>
                            <option value="desc">High to low</option>
                        </select>
                    </div>
                    <div className="products-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-11">
                        {products.map((product) => (
                            <Product
                                key={product._id}
                                product={product}
                                handleAddToCart={handleAddToCart}></Product>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div>
                        <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pages={pages}
                            setProductPerPage={setProductPerPage}
                        />
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
