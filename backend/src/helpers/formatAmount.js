const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)    
}
module.exports = formatAmount