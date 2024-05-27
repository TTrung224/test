const AdminSellerTable = ({ sellers, handleChangeStatus }) => {

      

    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sellers.map(seller => {
                        let rowColor = ""
                        if(seller.sellerStatus === "accepted") rowColor = "table-success"
                        else if(seller.sellerStatus === "rejected") rowColor = "table-danger"
                        return (
                            <tr key={seller._id} className={`${rowColor} align-middle`}>
                                <th scope="row">{seller._id}</th>
                                <td>{seller.fullName}</td>
                                <td>{seller.email}</td>
                                <td>{seller.sellerStatus}</td>
                                <td>
                                    <button className="btn btn-success mx-1" disabled={seller.sellerStatus === 'accepted'} onClick={() => handleChangeStatus(seller._id, "accepted")}><i className="bi-check-lg"/></button>
                                    <button className="btn btn-danger mx-1" disabled={seller.sellerStatus === 'rejected'} onClick={() => handleChangeStatus(seller._id, "rejected")}><i className="bi-x-lg" /></button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default AdminSellerTable;