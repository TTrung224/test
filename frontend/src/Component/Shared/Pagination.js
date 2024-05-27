const PaginationList = ({ totalItems, filters, setFilters}) => {

    const page = filters.page
    const maxItemsPerPage = filters.maxPerPage
    const totalPage = Math.ceil(totalItems / maxItemsPerPage)
    const pagingList = generatePagination(totalPage)
    const onChangePage = (newPage) => {
        setFilters({...filters, page: newPage})
    }

    function generatePagination(totalPage) {
        let pagingList = []
        if (totalPage < 7) {
            for (let i = 0; i < totalPage; i++) {
                if ((i + 1) === page) {
                    pagingList.push(<li key={i} className="page-item active"><button className="page-link" onClick={() => onChangePage(i + 1)}>{i + 1}</button></li>)
                } else {
                    pagingList.push(<li key={i} className="page-item"><button className="page-link" onClick={() => onChangePage(i + 1)}>{i + 1}</button></li>)
                }
            }
        } else {
            if (page > 1) {
                pagingList.push(<li key={1} className="page-item"><button className="page-link" onClick={() => onChangePage(1)}>1</button></li>)
            }
            if (page >= 4) {
                pagingList.push(<li key={-1} className="page-item"><button className="page-link" disabled>...</button></li>)
            }
            if (page > 2) {
                pagingList.push(<li key={page - 1} className="page-item"><button className="page-link" onClick={() => onChangePage(page - 1)}>{page - 1}</button></li>)
            }

            pagingList.push(<li key={page} className="page-item active"><button className="page-link" onClick={() => onChangePage(page)}>{page}</button></li>)

            if (page <= totalPage - 2) {
                pagingList.push(<li key={page + 1} className="page-item"><button className="page-link" onClick={() => onChangePage(page + 1)}>{page + 1}</button></li>)
            }
            if (page <= totalPage - 3) {
                pagingList.push(<li key={-2} className="page-item"><button className="page-link" disabled>...</button></li>)
            }
            if (page < totalPage) {
                pagingList.push(<li key={totalPage} className="page-item"><button className="page-link" onClick={() => onChangePage(totalPage)}>{totalPage}</button></li>)
            }
        }
        return pagingList
    }

    return (
        <nav className='paginavtion-nav' aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li key={'prev'} className={(page === 1) ? "page-item disabled" : "page-item"}>
                    <button className="page-link" disabled={page === 1} onClick={() => onChangePage(page - 1)}>Prev</button>
                </li>
                {pagingList}
                <li key={'next'} className={(page === totalPage) ? "page-item disabled" : "page-item"}>
                    <button className="page-link" disabled={page === totalPage} onClick={() => onChangePage(page + 1)}>Next</button>
                </li>
            </ul>
        </nav>
    );
}

export default PaginationList;