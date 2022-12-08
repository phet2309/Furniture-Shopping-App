const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/orders", authorization, async (req, res) => {
    try {
        const userId = req.user;
        const orderQuery = 'SELECT \
                cartid AS id, \
                totalamount AS totalAmount, \
                date, \
                status \
            FROM \
                cart \
            WHERE \
                CID = $1';

        var orders = (await pool.query(orderQuery, [userId])).rows;
        if (orders.length == 0) {
            return res.status(401).json("No Orders");
        }
        console
        orders.map((order) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            order.date = new Date(order.date).toLocaleDateString('en-US', options)
        })
        return res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/orders/:id/:date", authorization, async (req, res) => {
    try {
        const userId = req.user;
        const id = req.params.id;
        const date = req.params.date;
        const productDetailsQuery =
            'SELECT \
                name, \
                a.quantity, \
                pricesold, \
                a.quantity*pricesold as subtotal \
            FROM \
                appears_in a \
                JOIN product p USING (productid) \
            WHERE \
                cartid = $1';

        const productDetails = (await pool.query(productDetailsQuery, [id])).rows;

        const deliveryCardQuery =
            'SELECT \
                snumber || \', \' || street || \', \' || city || \', \' || state || \', \' || country || \'-\' || zip AS shippingAddress, \
                cardownername as name, \
                cardtype, \
                billingAddress, \
                c.totalamount \
            FROM \
                ship_address s \
                JOIN cart c ON c.shipaddname = s.saname AND c.cid = s.cid \
                JOIN transaction t using (transactionid) \
                JOIN credit_card cc ON t.cardnumber = cc.cardnumber \
            WHERE \
                c.cid = $1';

        const deliveryCardDetail = (await pool.query(deliveryCardQuery, [userId])).rows[0];
        return res.json({ date, productDetails, deliveryCardDetail });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/payment", authorization, async (req, res) => {
    try {
        const { cartItems, paymentMethod, cardNumber, saName } = req.body;
        const tDate = new Date().toLocaleDateString();
        const tStatus = paymentMethod === 'Pay Now' ? 'Completed' : 'Pending';
        const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.amount, 0);
        const q1 = 'INSERT INTO transaction (TStatus, TDate, TotalAmount, CardNumber, CID) \
                    VALUES($1, $2, $3, $4, $5) RETURNING *';

        const transaction = (await pool.query(q1, [tStatus, tDate, totalAmount, cardNumber, req.user])).rows[0];
        const transactionId = transaction.transactionid;

        const q2 = 'INSERT INTO cart (TransactionID, Status, Date, TotalAmount, ShipAddName, CID) VALUES \
            ( $1, \'Order Placed\', $2, $3, $4, $5) RETURNING *';

        const cart = (await pool.query(q2, [transactionId, tDate, totalAmount, saName, req.user])).rows[0];
        const cartId = cart.cartid;

        cartItems.map(async (item) => {
            const q = 'INSERT INTO appears_in (CartID, ProductID, Quantity, PriceSold) VALUES \
                    ($1, $2, $3, $4)';
            const temp = (await pool.query(q, [cartId, item.id, item.amount, item.price * item.amount])).rows[0];
        })

        return res.json({ 'message': 'Success' });

    } catch (error) {
        console.error(error);
        res.status(500).send("server error");
    }
});


router.post("/paymentdetail", authorization, async (req, res) => {
    const {
        cardNumber,
        secNumber,
        cardOwnerName,
        cardType,
        billingAddress,
        expDate,
        saName,
        country,
        state,
        city,
        zip,
        street
    } = req.body;

    const q1 =
        'INSERT INTO ship_address (CID, SAName, Country, State, City, Street, ZIP) VALUES \
    ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING';

    const res1 = (await pool.query(q1, [req.user, saName, country, state, city, street, zip])).rows;

    const q2 =
        'INSERT INTO credit_card (CardNumber, SecNumber, CardOwnerName, CardType, BillingAddress, ExpDate) VALUES \
    ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING';

    const res2 = (await pool.query(q2, [cardNumber, secNumber, cardOwnerName, cardType, billingAddress, expDate])).rows;
});

router.get("/products", async (req, res) => {
    try {
        const productQuery =
            'SELECT \
                productId as id, \
                type as category, \
                description, \
                name as title, \
                price, \
                quantity as amount, \
                imageSrc as image \
            FROM \
                Product';

        const products = (await pool.query(productQuery, [])).rows;
        return res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("server error");
    }
});


router.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const productQuery =
            'SELECT \
                productId as id, \
                type as category, \
                description, \
                name as title,\
                imagesrc as image, \
                price \
            FROM \
                Product \
            WHERE \
                productid = $1';

        const products = (await pool.query(productQuery, [id])).rows[0];
        return res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("server error");
    }
});

router.post("/transactions/:criteria", authorization, async (req, res) => {
    try {
        const criteria = req.params.criteria;
        const { product, startDate, endDate } = req.body;
        if (criteria === 'daterange') {
            const dateRange =
                'select C.FName, C.LName, T.TStatus, T.TDate, T.TotalAmount, T.CardNumber \
            FROM transaction T, Cart CT, appears_in A, Customer C \
            WHERE CT.CID = $1  AND CT.CID = C.CID AND CT.TransactionID = T.TransactionID AND T.TDate > $2 AND T.TDate < $3 \
            GROUP BY T.TransactionID, C.Fname, C.Lname';
            const dateRangeRes = (await pool.query(dateRange, [req.user, startDate, endDate])).rows;
            return res.json(dateRangeRes);
        } else if (criteria === 'product') {
            const filterQuery2 = 'select \
                                CT.CartID, \
                                T.TStatus, \
                                T.TDate, T.TotalAmount, \
                                T.CardNumber\
                            FROM \
                                transaction T, \
                                Cart CT, \
                                appears_in A \
                            WHERE \
                                CT.CID = $1  \
                                AND \
                                CT.CartID \
                                    in \
                                        (SELECT \
                                            CT.CartID \
                                        FROM \
                                            appears_in A1, \
                                            product P, \
                                            cart CT1 \
                                        WHERE \
                                            CT.CID = $1 \
                                            AND \
                                            CT1.CartID = A1.CartID \
                                            AND \
                                            A1.ProductID = P.ProductID \
                                            AND \
                                            P.Name = $2 \
                                            GROUP BY \
                                                CT1.CartID) \
                            AND \
                            CT.TransactionID = T.TransactionID\
                            GROUP BY \
                                T.TransactionID, \
                                CT.CartID';

            var filter2 = (await pool.query(filterQuery2, [req.user, product])).rows;
            return res.json(filter2);
        } else {
            const transactionAllQuery =
                'SELECT \
                tstatus, \
                tdate, \
                totalamount \
            FROM \
                Transaction \
            WHERE \
                cid = $1 \
            ORDER BY \
                tdate DESC';

            const transactionAll = (await pool.query(transactionAllQuery, [req.user])).rows;
            return res.json(transactionAll);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;

module.exports = router;