const cards = (cardslist = null, action) => {
    switch (action.type) {
        case "card":
            cardslist = action.payload
            return cardslist;

        default:
            return cardslist;
    }
};

export default cards;
