const cards = (cardslist = [], action) => {
    switch (action.type) {
        case "card":
            return [...action.payload];

        default:
            return cardslist;
    }
};

export default cards;
