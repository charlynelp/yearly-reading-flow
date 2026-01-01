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

// Render year dropdown
function renderYearTabs() {
    const menuContainer = document.getElementById('yearDropdownMenu');
    
    // Create array of all years from 2026 down to 2010
    const allYears = [];
    for (let year = 2026; year >= 2010; year--) {
        allYears.push(year);
    }
    
    // Create All-time option + year options
    const allTimeOption = `<div class="year-option" onclick="selectYear('all')">All-time</div>`;
    const yearOptions = allYears.map(year => `
        <div class="year-option" onclick="selectYear(${year})">${year}</div>
    `).join('');
    
    menuContainer.innerHTML = allTimeOption + yearOptions;
}

// Toggle dropdown
document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.getElementById('yearDropdownBtn');
    const dropdownMenu = document.getElementById('yearDropdownMenu');
    
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownBtn.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownBtn.classList.remove('active');
        dropdownMenu.classList.remove('active');
    });
});

// Select year from dropdown
function selectYear(year) {
    currentYear = year;
    
    // Update button text
    const displayText = year === 'all' ? 'All-time' : year;
    document.getElementById('selectedYear').textContent = displayText;
    
    // Close dropdown
    document.getElementById('yearDropdownBtn').classList.remove('active');
    document.getElementById('yearDropdownMenu').classList.remove('active');
    
    // Display books for selected year
    displayBooks(year);
}

// Keep the old switchYear for compatibility but make it call selectYear
function switchYear(year) {
    selectYear(year);
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
    
    // Sort books
if (year === 'all') {
    // For All-time: sort by year (most recent first), then by date added within each year
    yearBooks.sort((a, b) => {
        if (b.year !== a.year) {
            return b.year - a.year; // Sort by year descending
        }
        return new Date(b.dateAdded) - new Date(a.dateAdded); // Then by date added
    });
} else {
    // For specific years: sort by date added (most recent first)
    yearBooks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
}
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
                 onclick='openPopup(${JSON.stringify(book).replace(/'/g, "&apos;")})'>
               ${book.coverUrl 
    ? `<img src="${book.coverUrl}" alt="${book.title.replace(/"/g, '&quot;')}" style="width: 100%; height: 100%; object-fit: cover;">` 
    : `<div style="width: 100%; height: 100%; background: #999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 10px;">
        <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; text-align: center;">${book.title.replace(/"/g, '&quot;')}</div>
        <div style="font-size: 0.7rem; opacity: 0.9; text-align: center;">${book.author.replace(/"/g, '&quot;')}</div>
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

// Search functionality
document.getElementById('searchBar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const bookCards = document.querySelectorAll('.book-cover-card');
    
    bookCards.forEach(card => {
        const bookData = card.getAttribute('onclick');
        const isMatch = bookData.toLowerCase().includes(searchTerm);
        card.style.display = isMatch ? 'block' : 'none';
    });
    
    // Update stats for visible books
    const visibleBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    updateStats(visibleBooks);
});
