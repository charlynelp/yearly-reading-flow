let allBooks = [];
let currentYear = new Date().getFullYear();

// Load books data
async function loadBooks() {
    try {
        const response = await fetch('/books.json?t=' + new Date().getTime());
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
    const tabsContainer = document.getElementById('yearTabs');
    
    // Create array of all years from 2025 down to 2015
    const allYears = [];
    for (let year = 2025; year >= 2015; year--) {
        allYears.push(year);
    }
    
    // Create All-time button + year buttons
    const allTimeButton = `<button class="year-tab ${currentYear === 'all' ? 'active' : ''}" onclick="switchYear('all')">All-time</button>`;
    const yearButtons = allYears.map(year => `
        <button class="year-tab ${year === currentYear ? 'active' : ''}" onclick="switchYear(${year})">
            ${year}
        </button>
    `).join('');
    
    tabsContainer.innerHTML = allTimeButton + yearButtons;
}

// Switch active year
function switchYear(year) {
    currentYear = year;
    displayBooks(year);
    
    
   // Update active tab
    document.querySelectorAll('.year-tab').forEach(tab => {
        tab.classList.remove('active');
        if (year === 'all' && tab.textContent === 'All-time') {
            tab.classList.add('active');
        } else if (parseInt(tab.textContent) === year) {
            tab.classList.add('active');
        }
    });
}

// Display books for selected year
function displayBooks(year) {
    const yearBooks = year === 'all' ? allBooks : allBooks.filter(book => book.year === year);
    const bookshelf = document.getElementById('bookshelf');
    
    
    // Update stats
    updateStats(yearBooks);
    
    if (yearBooks.length === 0) {
      const message = year === 'all' ? 'No books added yet.' : 'No books read in ' + year + ' yet.';
bookshelf.innerHTML = '<div class="empty-state"><p>' + message + '</p></div>';
        return;
        }
    
    // Sort by date added (most recent first)
    yearBooks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    // Grey shades for book spines
    const greyShades = ['#333333', '#555555', '#777777', '#999999', '#BBBBBB'];
    
    // Find max and min page counts for height calculation
    const pageCounts = yearBooks.map(b => b.pages || 200);
    const maxPages = Math.max(...pageCounts);
    const minPages = Math.min(...pageCounts);
    
 bookshelf.innerHTML = yearBooks.map((book, index) => {
        // Calculate proportional height
        const pages = book.pages || 200;
        const heightRange = 20;
        const height = 240 + ((pages - minPages) / (maxPages - minPages || 1)) * heightRange;
        const width = height * 0.67; // Standard book cover ratio
        
        return `
            <div class="book-cover-card" 
                 style="height: ${height}px; width: ${width}px;" 
                 onclick='openPopup(${JSON.stringify(book).replace(/'/g, "&apos;")})'
                ${book.coverUrl 
                    ? `<img src="${book.coverUrl}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : `<div style="width: 100%; height: 100%; background: #999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 10px;">
                        <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; text-align: center;">${book.title}</div>
                        <div style="font-size: 0.7rem; opacity: 0.9; text-align: center;">${book.author}</div>
                       </div>`
                }
            </div>
        `;
    }).join('');
}

// Open popup with book details
function openPopup(book) {
    const overlay = document.getElementById('popupOverlay');
    
    // Set popup content
    if (book.coverUrl) {
        document.getElementById('popupCover').src = book.coverUrl;
        document.getElementById('popupCover').style.display = 'block';
    } else {
        document.getElementById('popupCover').style.display = 'none';
    }
    
    document.getElementById('popupTitle').textContent = book.title;
    document.getElementById('popupAuthor').textContent = book.author;
    document.getElementById('popupRating').innerHTML = renderStars(book.rating);
    document.getElementById('popupPages').textContent = book.pages ? `${book.pages} pages` : 'Page count unknown';
    document.getElementById('popupBlurb').textContent = book.blurb;
    
    // Show popup
    overlay.classList.add('active');
}

// Close popup
function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
}

// Close button click
document.getElementById('closeButton').addEventListener('click', closePopup);

// Click outside popup to close
document.getElementById('popupOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Render stars - all red
function renderStars(rating) {
    let stars = '<span class="stars">';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += `<span class="star filled-pink">★</span>`;
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
