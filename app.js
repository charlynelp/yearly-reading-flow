let allBooks = [];
let currentYear = new Date().getFullYear();

// Load books data
async function loadBooks() {
    try {
        const response = await fetch('/books.json');
        allBooks = await response.json();
        renderYearTabs();
        displayBooks(currentYear);
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksGrid').innerHTML = '<div class="empty-state"><p>No books added yet. Start your reading journey!</p></div>';
    }
}

// Get unique years from books
function getYears() {
    const years = [...new Set(allBooks.map(book => book.year))];
    return years.sort((a, b) => b - a); // Most recent first
}

// Render year tabs
function renderYearTabs() {
    const years = getYears();
    const tabsContainer = document.getElementById('yearTabs');
    
    if (years.length === 0) {
        tabsContainer.innerHTML = '';
        return;
    }
    
    tabsContainer.innerHTML = years.map(year => `
        <button class="year-tab ${year === currentYear ? 'active' : ''}" onclick="switchYear(${year})">
            ${year}
        </button>
    `).join('');
}

// Switch active year
function switchYear(year) {
    currentYear = year;
    displayBooks(year);
    
    // Update active tab
    document.querySelectorAll('.year-tab').forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.textContent) === year) {
            tab.classList.add('active');
        }
    });
}

// Display books for selected year
function displayBooks(year) {
    const yearBooks = allBooks.filter(book => book.year === year);
    const booksGrid = document.getElementById('booksGrid');
    
    // Update stats
    updateStats(yearBooks);
    
    if (yearBooks.length === 0) {
        booksGrid.innerHTML = '<div class="empty-state"><p>No books read in ' + year + ' yet.</p></div>';
        return;
    }
    
    // Sort by date added (most recent first)
    yearBooks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    booksGrid.innerHTML = yearBooks.map(book => `
        <div class="book-card">
            ${book.coverUrl 
                ? `<img src="${book.coverUrl}" alt="${book.title} cover" class="book-cover">` 
                : `<div class="book-cover-placeholder">${book.title}</div>`
            }
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-rating">
                    ${renderStars(book.rating)}
                </div>
                <div class="book-blurb">${book.blurb}</div>
            </div>
        </div>
    `).join('');
}

// Render stars with alternating colors
function renderStars(rating) {
    const colors = ['pink', 'purple'];
    let stars = '<span class="stars">';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            const colorIndex = (i - 1) % 2; // Alternate between pink and purple
            stars += `<span class="star filled-${colors[colorIndex]}">★</span>`;
        } else {
            stars += '<span class="star empty">★</span>';
        }
    }
    
    stars += '</span>';
    return stars;
}

// Update stats for current year
function updateStats(books) {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    
    document.getElementById('booksCount').textContent = totalBooks;
    document.getElementById('pagesCount').textContent = totalPages.toLocaleString();
}

// Initialize
loadBooks();
