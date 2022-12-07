const router = require("express").Router();
const pool = require("../db");
const validateTransactionPayload = require("../middleware/validateTransactionPayload");

router.get("/orders", async (req, res) => {
    try {
        const userId = 1;
        const orderQuery = 'SELECT \
                cid AS id, \
                totalamount AS totalAmount, \
                date, \
                status \
            FROM \
                cart \
            WHERE \
                custId = $1';

        var orders = (await pool.query(orderQuery, [userId])).rows;
        if (orders.length == 0) {
            return res.status(401).json("No Orders");
        }
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

router.get("/orders/:id/:date", async (req, res) => {
    try {
        const userId = 1;
        const id = req.params.id;
        const date = req.params.date;
        const productDetailsQuery =
            'SELECT \
                pname, \
                quantity, \
                pricesold, \
                quantity*pricesold as subtotal \
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
                totalamount \
            FROM \
                ship_address s \
                JOIN cart c ON c.shipaddname = s.saname \
                JOIN credit_card cc ON c.creditcardnumber = cc.cardnumber \
            WHERE \
                cid = $1';

        const deliveryCardDetail = (await pool.query(deliveryCardQuery, [userId])).rows[0];
        return res.json({ date, productDetails, deliveryCardDetail });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/transactions", async (req, res) => {
    try {
        const userId = 1;
        const transactionAllQuery =
            'SELECT \
                cartid, \
                tstatus, \
                tdate, \
                totalamount \
            FROM \
                cart c \
                JOIN stored_card sc ON sc.cardnumber = c.creditcardnumber \
                JOIN customer cu ON cu.cid = sc.custid \
            WHERE \
            cid = $1 \
            ORDER BY \
                tdate DESC';

        const transactionAll = (await pool.query(transactionAllQuery, [userId])).rows;
        return res.json(transactionAll);
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/transactions", validateTransactionPayload, async (req, res) => {
    try {
        const userId = 1;
        const filter = req.body;
        var allTransactionQuery = 'SELECT \
            tstatus, \
            tdate, \
            totalamount, \
            creditcardnumber, \
            cardownername, \
            cardtype, \
            billingaddress, \
            custstatus \
        FROM \
            Cart ca \
            JOIN credit_card cc ON ca.creditcardnumber = cc.cardnumber \
            JOIN stored_card sc ON ca.creditcardnumber = sc.cardnumber \
            JOIN customer cu ON cu.cid = sc.custid \
        WHERE \
            cu.cid = $1'
        var count = 1;
        var params = [userId]
        if (filter.status) {
            if (filter.statusOperator === "equal") allTransactionQuery = allTransactionQuery + ` AND tstatus = $${++count}`;
            else allTransactionQuery = allTransactionQuery + ` AND tstatus != $${++count}`;
            params.push(filter.status)
        }
        if (filter.startDate || filter.endDate) {
            let start, end;
            if (!filter.startDate) {
                start = new Date();
                end = new Date(filter.endDate);
            }
            if (!filter.endDate) {
                end = new Date();
                start = new Date(filter.startDate);
            }
            allTransactionQuery = allTransactionQuery + ` AND tdate >= $${++count} AND tdate<= $${++count}`;
            params.push(start)
            params.push(end);
        }
        if (filter.amount) {
            if (filter.amountOperator === 'equal') allTransactionQuery + ` AND totalamount = $${++count}`;
            else if (filter.amountOperator === 'greater than') allTransactionQuery + ` AND totalamount > $${++count}`;
            else if (filter.amountOperator === 'less than') allTransactionQuery + ` AND totalamount < $${++count}`;
            params.push(filter.amount);
        }

        if (filter.creditcardnumber) {
            if (filter.creditcardnumberOperator === "equal") allTransactionQuery = allTransactionQuery + ` AND creditcardnumber = $${++count}`;
            else allTransactionQuery = allTransactionQuery + ` AND creditcardnumber != $${++count}`;
            params.push(filter.creditcardnumber)
        }

        if (filter.cardownername) {
            if (filter.cardownernameOperator === "equal") allTransactionQuery = allTransactionQuery + ` AND cardownername = $${++count}`;
            else allTransactionQuery = allTransactionQuery + ` AND cardownername != $${++count}`;
            params.push(filter.cardownername)
        }

        if (filter.cardtype) {
            if (filter.cardtypeOperator === "equal") allTransactionQuery = allTransactionQuery + ` AND cardtype = $${++count}`;
            else allTransactionQuery = allTransactionQuery + ` AND cardtype != $${++count}`;
            params.push(filter.cardtype)
        }

        if (filter.billingaddress) {
            if (filter.billingaddressOperator === "contains") allTransactionQuery = allTransactionQuery + ` AND billingaddress like '%$${++count}%'`;
            else allTransactionQuery = allTransactionQuery + ` AND billingaddress not like '%$${++count}%'`;
            params.push(filter.billingaddress)
        }

        if (filter.custstatus) {
            if (filter.custstatusOperator === "equal") allTransactionQuery = allTransactionQuery + ` AND custstatus = $${++count}`;
            else allTransactionQuery = allTransactionQuery + ` AND custstatus != $${++count}`;
            params.push(filter.custstatus)
        }


        console.log(allTransactionQuery);
        var transactions = (await pool.query(allTransactionQuery, params)).rows;
        if (transactions.length == 0) {
            return res.status(401).json("No Transactions");
        }
        return res.json({ transactions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;