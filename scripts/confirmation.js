  const customerName = localStorage.getItem('customerName');
  if (customerName) {
    document.querySelector('.customer-name').textContent = customerName;
  }