const AdminAttributeList = ({ attributes, allowDelete, deleteAttribute }) => {
    let deleteBtn = (a) => <button type="button" className="btn btn-link align-baseline ms-2 p-0" onClick={() => deleteAttribute(a)}>Delete</button>

    if(!allowDelete){
        deleteBtn = () => {}
    }

    return (
        <div>
            <ul>
                {attributes.map((a, i) => {
                    const required = a.required ? "(required)" : "(optional)"
                    return (
                        <li key={i}><b>{a.name}</b> {required} : {a.type}  {deleteBtn(a)}</li>
                    )
                })}
            </ul>
        </div>
    );
}

export default AdminAttributeList;