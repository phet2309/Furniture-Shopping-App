const StatusEnum = {
    Pending: 0,
    Completed: 1,
}


const custStatusEnum = {
    Gold : 0,
    Silver: 1,
    Bronze: 2,
    Platinum: 3
}

const isInEnum = (key, enumName) => enumName.hasOwnProperty(key);

const validateDates = (startDate, endDate) => {
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
  
    // Check if the dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }
  
    // Check if the start date is before the end date
    if (start > end || start>today) {
      return false;
    }
  
    return true;
  }

module.exports = function (req, res, next) {
    const { status, startDate, endDate, amount, cardNumber, cardType, billingAddress, custStatus} = req.body;

    if(status && !isInEnum(status, StatusEnum))
        return res.json("Invalid Status");
    if(startDate && endDate && !validateDates(startDate, endDate))
        return res.json("Invalid Date");
    if(custStatus && !isInEnum(custStatus, custStatusEnum))
        return res.json("Invalid Customer Status");
    next();
};