document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-tope-group button');
    const products = document.querySelectorAll('.isotope-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedFilter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('how-active1'));
            button.classList.add('how-active1');

            products.forEach(product => {
                if (selectedFilter === '*' || product.classList.contains(selectedFilter.substring(1))) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
});

const products = [

];
const productsPerPage = 10;
let currentPage = 1;

function displayProducts(page) {
    const start = (page - 1) * productsPerPage;
    const end = page * productsPerPage;
    const productsToDisplay = products.slice(start, end);

    const productContainer = document.getElementsByClassName("row isotope-grid");
    productContainer.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productHTML = `
            
        `;
    });
};