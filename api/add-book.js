module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const bookData = req.body;
        
        if (!bookData.title || !bookData.author || !bookData.rating || !bookData.blurb) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO = process.env.GITHUB_REPO;
        
        console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);
        console.log('GITHUB_REPO exists:', !!GITHUB_REPO);
        
        if (!GITHUB_TOKEN || !GITHUB_REPO) {
            console.error('Missing GitHub credentials');
            return res.status(500).json({ error: 'Server configuration error' });
        }

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

        currentBooks.push(bookData);

        const newContent = JSON.stringify(currentBooks, null, 2);
        const base64Content = Buffer.from(newContent).toString('base64');

        const commitMessage = `Add book: ${bookData.title}`;
        
        const updateResponse = await fetch(fileUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'appli