module.exports = {
  createRewardOrder: async (amount, currency = 'USD') => {
    return { orderId: "ord_" + Date.now(), amount, currency, status: "created" };
  }
};
