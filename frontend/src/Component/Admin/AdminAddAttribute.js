const AdminAddAttribute = ({addAttribute}) => {
    return (
        <div className="container border p-4 my-2">

            <div className="form-group">
                <label htmlFor="attributeName" className="h6 form-label">Attribute Name: </label>
                <input type="text" className="form-control" id="attributeName" placeholder="Name"/>
            </div>

            <div className="mt-3">
                <h6 className="d-inline">Attribute Type:    </h6>
                <div className="form-check form-check-inline ms-2">
                    <input className="form-check-input" type="radio" name="type" id="typeText" value="text" defaultChecked/>
                    <label className="form-check-label" htmlFor="typeText">Text</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="type" id="typeNum" value="number" />
                    <label className="form-check-label" htmlFor="typeNum">Number</label>
                </div>
            </div>

            <div className="form-check mt-3">
                <label className="h6 form-check-label" htmlFor="required">Required</label>
                <input className="form-check-input" type="checkbox" id="required" />
            </div>

            <button type="button" className="btn btn-outline-primary btn-sm mt-3" onClick={() => {
                const name = document.querySelector("#attributeName").value
                if(name === ""){
                    alert("Attribute needs a name")
                    return
                }
                const type = document.querySelector("input[name='type']:checked").value
                const required = document.querySelector("#required")
                addAttribute(name, type, required.checked)
            }}>Add Attribute</button>
        </div>
    );
}

export default AdminAddAttribute;