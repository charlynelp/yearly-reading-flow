module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const bookData = req.body;
        
        // Validate required fields
        if (!bookData.title || !bookData.author || !bookData.rating || !bookData.blurb) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get GitHub credentials from environment variables
 const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO = process.env.GITHUB_REPO;
        
        console.log('All env vars:', Object.keys(process.env));
        console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);
        console.log('GITHUB_REPO exists:', !!GITHUB_REPO);
        console.log('GITHUB_REPO value:', GITHUB_REPO);
        
        if (!GITHUB_TOKEN || !GITHUB_REPO) {
            console.error('Missing GitHub credentials');
            console.error('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);
            console.error('GITHUB_REPO exists:', !!GITHUB_REPO);
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Fetch current books.json from GitHub
        const fileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/books.json`;
        
        let currentBooks = [];
        let currentSha = null;

        try {
            const getResponse = await fetch(fileUrl, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (getResponse.ok) {
                const fileData = await getResponse.json();
                currentSha = fileData.sha;
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                currentBooks = JSON.parse(content);
            }
        } catch (error) {
            console.log('books.json does not exist yet, creating new file');
        }

        // Add new book to the array
        currentBooks.push(bookData);

        // Convert to JSON string with nice formatting
        const newContent = JSON.stringify(currentBooks, null, 2);
        const base64Content = Buffer.from(newContent).toString('base64');

        // Commit to GitHub
        const commitMessage = `Add book: ${bookData.title}`;
        
        const updateResponse = await fetch(fileUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: commitMessage,
                content: base64Content,
                sha: currentSha
            })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            console.error('GitHub API error:', errorData);
            return res.status(500).json({ error: 'Failed to update GitHub repository' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Book added successfully',
            book: bookData
        });

    } catch (error) {
        console.error('Error in add-book handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};