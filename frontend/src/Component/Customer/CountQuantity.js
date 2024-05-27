const CountQuantity = ({ quantity, setQuantity }) => {

    const changeQuant = (e) => {
        let newQuant = parseInt(e.target.value)

        if(isNaN(newQuant) || newQuant < 1){
            newQuant = 1
        }

        setQuantity(newQuant)
    }

    const increaseQuant = () => {
        const newQuant = quantity + 1
        setQuantity(newQuant);
    }

    const decreaseQuant = () => {
        if (quantity > 1) {
            const newQuant = quantity - 1
            setQuantity(newQuant);
        }

        else {
            setQuantity(1)
        }
    }

    return (
        <div className="input-group">
            <button className="btn btn-secondary" type='button' onClick={() => decreaseQuant()}> - </button>
            <input key={"quantity"} id="quantity" min="1" name="quantity" value={quantity} type="number"
                className="form-control input-number form-control-sm" onChange={(e) => changeQuant(e)} />
            <button className="btn btn-secondary" type='button' onClick={() => increaseQuant()}> + </button>
        </div>

    )
}

export default CountQuantity;