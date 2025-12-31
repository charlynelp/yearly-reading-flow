let selectedBook = null;
let selectedRating = 0;

// Login function
function login() {
    const password = document.getElementById('password').value;
    const correctPassword = 'Osheaga2020!';
    
    if (password === correctPassword) {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('addBookForm').classList.remove('hidden');
        sessionStorage.setItem('authenticated', 'true');
    } else {
        const error = document.getElementById('loginError');
        error.textContent = 'Incorrect password';
        error.classList.remove('hidden');
    }
}

// Check if already authenticated
if (sessionStorage.getItem('authenticated') === 'true') {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('addBookForm').classList.remove('hidden');
}

// Search for book using Open Library API
async function searchBook() {
    const query = document.getElementById('searchQuery').value.trim();
    if (!query) return;
    
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<p>Searching...</p>';
    
    try {
        // Try searching by title first
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            displayResults(data.docs);
        } else {
            resultsDiv.innerHTML = '<p>No books found. Try a different search term.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p class="error-message">Error searching. Please try again.</p>';
        console.error('Search error:', error);
    }
}

// Display search results
function displayResults(books) {
    const resultsDiv = document.getElementById('searchResults');
    
    resultsDiv.innerHTML = books.map(book => {
        const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null;
        
        const author = book.author_name ? book.author_name[0] : 'Unknown Author';
        const pages = book.number_of_pages_median || 'Unknown';
        
        return `
            <div class="book-result" onclick='selectBook(${JSON.stringify({
                title: book.title,
                author: author,
                pages: pages,
                coverUrl: coverUrl,
                isbn: book.isbn ? book.isbn[0] : null
            })})'>
                ${coverUrl 
                    ? `<img src="${coverUrl}" class="result-cover" alt="${book.title}">` 
                    : `<div class="result-cover" style="background: linear-gradient(135deg, #FEB3BA, #DFACE5); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; text-align: center; padding: 5px;">No Cover</div>`
                }
                <div class="result-info">
                    <div class="result-title">${book.title}</div>
                    <div class="result-author">${author}</div>
                    <div class="result-pages">${pages} pages</div>
                </div>
            </div>
        `;
    }).join('');
}

// Select a book from search results
function selectBook(book) {
    selectedBook = book;
    
    // Hide search step, show details step
    document.getElementById('searchStep').classList.add('hidden');
    document.getElementById('detailsStep').classList.remove('hidden');
    
    // Populate selected book display
    if (book.coverUrl) {
        document.getElementById('selectedCover').src = book.coverUrl;
    } else {
        document.getElementById('selectedCover').style.background = 'linear-gradient(135deg, #FEB3BA, #DFACE5)';
    }
    document.getElementById('selectedTitle').textContent = book.title;
    document.getElementById('selectedAuthor').textContent = book.author;
    
    // Pre-fill pages if available
    if (book.pages && book.pages !== 'Unknown') {
        document.getElementById('pages').value = book.pages;
    }
}

// Set star rating
function setRating(rating) {
    selectedRating = rating;
    document.getElementById('rating').value = rating;
    
    const stars = document.querySelectorAll('.star-button');
    const colors = ['pink', 'purple'];
    
    stars.forEach((star, index) => {
        star.classList.remove('selected-pink', 'selected-purple');
        if (index < rating) {
            const colorIndex = index % 2;
            star.classList.add(`selected-${colors[colorIndex]}`);
        }
    });
}

// Add book to collection
async function addBook(event) {
    event.preventDefault();
    
    if (!selectedBook || !selectedRating) {
        showMessage('Please complete all fields', 'error');
        return;
    }
    
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.textContent = 'Adding...';
    
const bookData = {
    title: selectedBook.title,
    author: selectedBook.author,
    pages: parseInt(document.getElementById('pages').value),
    rating: selectedRating,
    blurb: document.getElementById('blurb').value,
    coverUrl: selectedBook.coverUrl,
    year: parseInt(document.getElementById('year').value),
    dateAdded: new Date().toISOString()
};
    
    try {
        const response = await fetch('/api/add-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        const responseText = await response.text();
        console.log('Server response:', responseText);
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response:', responseText);
            showMessage('Server error: ' + responseText, 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Add Book';
            return;
        }
        
        if (response.ok) {
            showMessage('Book added successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            showMessage(result.error || 'Failed to add book', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Add Book';
        }
    } catch (error) {
        showMessage('Error adding book. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Add Book';
        console.error('Add book error:', error);
    }
}

// Reset form
function resetForm() {
    selectedBook = null;
    selectedRating = 0;
    
    document.getElementById('searchStep').classList.remove('hidden');
    document.getElementById('detailsStep').classList.add('hidden');
    document.getElementById('searchQuery').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('pages').value = '';
    document.getElementById('blurb').value = '';
    document.getElementById('rating').value = '';
    
    const stars = document.querySelectorAll('.star-button');
    stars.forEach(star => {
        star.classList.remove('selected-pink', 'selected-purple');
    });
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = text;
    messageDiv.classList.remove('hidden');
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
    }
}

// Allow Enter key to trigger search
document.getElementById('searchQuery')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBook();
    }
});

// Allow Enter key to trigger login
document.getElementById('password')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});
