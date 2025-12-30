# Yearly Reading Flow

A beautiful, minimalist reading tracker to log your books with automatic cover fetching from Open Library.

## Features

- 📚 Track books read each year with star ratings and personal notes
- 📊 See stats: total books and pages read per year
- 🎨 Automatic book cover fetching from Open Library API
- 🔒 Password-protected admin page to add books
- 📅 Year tabs to browse different years
- 🌸 Beautiful pink & purple gradient design

## Setup Instructions

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the `+` icon in the top right → "New repository"
3. Repository name: `yearly-reading-flow`
4. Set to **Public** (important for Vercel deployment)
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

### 2. Push Code to GitHub

Open your terminal and navigate to where you want to store this project:

```bash
# Navigate to the project folder
cd /path/to/yearly-reading-flow

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repo as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/yearly-reading-flow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Create GitHub Personal Access Token

This allows the website to automatically commit new books to your repo.

1. Go to GitHub → Settings (click your profile picture)
2. Scroll down to **Developer settings** (bottom of left sidebar)
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token** → **Generate new token (classic)**
5. Note: "Reading Flow Website Access"
6. Expiration: Choose what you prefer (I recommend 90 days or 1 year)
7. Select scopes:
   - ✅ Check **repo** (this gives access to your repositories)
8. Click **Generate token**
9. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/log in with GitHub
2. Click **Add New...** → **Project**
3. Import your `yearly-reading-flow` repository
4. Before deploying, add **Environment Variables**:
   - Click **Environment Variables**
   - Add these two variables:
     
     **Variable 1:**
     - Name: `GITHUB_TOKEN`
     - Value: [Paste your GitHub token from step 3]
     
     **Variable 2:**
     - Name: `GITHUB_REPO`
     - Value: `YOUR_USERNAME/yearly-reading-flow` (replace YOUR_USERNAME)
     
5. Click **Deploy**
6. Wait 1-2 minutes for deployment to complete

### 5. Start Adding Books!

1. Visit your deployed site: `https://your-site-name.vercel.app`
2. Go to `/admin` (e.g., `https://your-site-name.vercel.app/admin`)
3. Password: `Osheaga2020!`
4. Search for a book by title
5. Select it, add your rating and thoughts
6. Click "Add Book"
7. Your book will automatically appear on the main page!

## How It Works

- **Main page** (`index.html`): Displays all your books organized by year
- **Admin page** (`admin.html`): Password-protected form to add new books
- **Open Library API**: Automatically fetches book covers and metadata
- **GitHub**: Stores your book data in `books.json`
- **Vercel**: Hosts the site and handles the serverless function that commits to GitHub

## Customization

### Change Admin Password

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add a new variable:
   - Name: `ADMIN_PASSWORD`
   - Value: [Your new password]
4. Redeploy (Deployments → three dots → Redeploy)

OR edit directly in `admin.js` (line 6), but environment variable is more secure.

### Change Colors

Edit `styles.css` and update these color values:
- `#FEB3BA` - Pink accent
- `#DFACE5` - Purple accent
- `#F2F0EF` - Background
- `#222` - Text color
- `#fff` - Card background

## Troubleshooting

**Books not appearing after adding:**
- Wait 30-60 seconds for Vercel to rebuild
- Check your GitHub repo - is `books.json` updated?
- Check Vercel deployment logs for errors

**Can't add books:**
- Verify your GitHub token is correct in Vercel environment variables
- Make sure `GITHUB_REPO` is in format: `username/repo-name`
- Token must have `repo` scope permissions

**Admin page won't unlock:**
- Default password is `Osheaga2020!`
- Check for typos (case-sensitive, includes exclamation mark)

## File Structure

```
yearly-reading-flow/
├── index.html          # Main reading list page
├── admin.html          # Admin page for adding books
├── styles.css          # All styling
├── app.js             # Main page logic
├── admin.js           # Admin page logic
├── books.json         # Your book data
├── api/
│   └── add-book.js    # Serverless function to commit to GitHub
├── vercel.json        # Vercel configuration
└── README.md          # This file
```

## Privacy Note

Your book data is stored in a public GitHub repository, which means anyone can view your reading list by visiting your repo. If you want to keep your reading private, you can:

1. Make your GitHub repo **private** (note: this requires Vercel Pro for deployment from private repos)
2. Or simply be aware that your book reviews are public

---

Enjoy tracking your reading journey! 📚✨
