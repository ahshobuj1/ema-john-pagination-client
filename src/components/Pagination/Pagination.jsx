const Pagination = ({
    currentPage,
    setCurrentPage,
    pages,
    setProductPerPage,
}) => {
    //handle page setup
    const handlePerPage = (e) => {
        setProductPerPage(e.target.value);
        setCurrentPage(0);
    };

    return (
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
    );
};

export default Pagination;
