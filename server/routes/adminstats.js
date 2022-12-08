const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const validateTransactionPayload = require("../middleware/validateTransactionPayload");

// 1
router.post("/highestsold", async (req, res) => {
    try {
        const filter = req.body;
        const statsQuery1 = 'SELECT \
                            P.Name as field, \
                            SUM(CT.Quantity) as total \
                        FROM \
                            product P \
                            JOIN Appears_in CT using (ProductID) \
                            JOIN cart C using (CartID) \
                        WHERE \
                            C.Date > $1 \
                            AND C.Date < $2\
                        GROUP BY \
                            P.ProductID\
                        ORDER BY \
                            total DESC';

        var stats1 = (await pool.query(statsQuery1, [filter.startDate, filter.endDate])).rows;
        if (stats1.length == 0) {
            return res.status(401).json("No Data Found");
        }
        return res.json(stats1);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 3
router.post("/bestcustomers", async (req, res) => {
    try {
        const filter = req.body;
        const statsQuery3 = 'SELECT \
                                C.Fname as field, \
                                SUM(CT.TotalAmount) as total \
                            FROM \
                                customer C \
                                JOIN cart CT using (CID) \
                                JOIN transaction T on CT.transactionID = T.TransactionID \
                            WHERE \
                                T.TDate > $1\
                                AND T.TDate < $2 \
                                AND T.TStatus = \'Completed\' \
                            GROUP BY \
                                C.CID \
                            ORDER BY \
                                total DESC \
                            LIMIT 10';

        var stats3 = (await pool.query(statsQuery3, [filter.startDate, filter.endDate])).rows;
        if (stats3.length == 0) {
            return res.status(401).json("No Data Found");
        }
        return res.json(stats3);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 4
router.post("/zip", async (req, res) => {
    try {
        const filter = req.body;
        const statsQuery4 = 'SELECT \
                                SA.ZIP as field, \
                                COUNT(SA.ZIP) as total \
                            FROM \
                                transaction T \
                                JOIN cart C ON T.TransactionID = C.TransactionID \
                                JOIN ship_address SA ON C.CID = SA.CID AND C.ShipAddName = SA.SAName \
                            WHERE \
                                T.TDate > $1 AND T.TDate < $2 AND T.TStatus = \'Completed\' \
                            GROUP BY \
                                SA.ZIP \
                            ORDER BY  \
                                total DESC \
                            LIMIT 5';

        var stats4 = (await pool.query(statsQuery4, [filter.startDate, filter.endDate])).rows;
        if (stats4.length == 0) {
            return res.status(401).json("No Data Found");
        }
        return res.json(stats4);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 5
router.post("/type", async (req, res) => {
    try {
        const filter = req.body;
        const statsQuery5 = 'SELECT \
                                P.type as field, \
                                AVG(CT.PriceSold) as total \
                            FROM \
                                product P \
                                JOIN Appears_in CT ON P.ProductID = CT.ProductID \
                                JOIN cart C ON CT.CartID = C.CartID\
                            WHERE \
                                C.Date > $1 \
                                AND C.Date < $2 \
                            GROUP BY \
                                P.type';

        var stats5 = (await pool.query(statsQuery5, [filter.startDate, filter.endDate])).rows;
        if (stats5.length == 0) {
            return res.status(401).json("No Data Found");
        }
        return res.json(stats5);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.post("/highestsoldcustom", async (req, res) => {
    try {
        const filter = req.body;
        const statsQuery5 = 'SELECT P.name as field, COUNT(DISTINCT C.cid) AS total \
                            FROM product P, Appears_In CT, Cart C \
                            WHERE P.ProductID = CT.ProductID AND CT.CartID = C.CartID \
                                AND C.Date > $1 AND C.Date < $2 \
                            GROUP BY P.name \
                            ORDER BY total DESC \
                            LIMIT 10'; 

        var stats5 = (await pool.query(statsQuery5, [filter.startDate, filter.endDate])).rows;
        if (stats5.length == 0) {
            return res.status(401).json("No Data Found");
        }
        return res.json(stats5);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/changeorder/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const store = ['Order Placed', 'Out for Delivery', 'Shipped', 'Delivered', 'Completed'];
        const {status} = req.body;
        const idx = store.indexOf(status);
        const lat = store[(idx+1)%store.length];
        console.log(lat)
        const q = 'UPDATE Cart set status=$1 where cartid=$2';
        var stats5 = (await pool.query(q, [lat, id])).rows;
        return res.json("Success");
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;