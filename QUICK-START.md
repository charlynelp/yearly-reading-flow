# Your Reading Flow Website - Quick Start Guide

Hey! I've built your entire reading tracker website. Here's what you have and how to get it running.

## What You Got

A complete, ready-to-deploy website with:

✅ Main page showing books organized by year with counters
✅ Beautiful pink/purple gradient design (your colors!)
✅ Admin page that searches Open Library for books automatically
✅ Star ratings (1-5) with alternating pink & purple stars
✅ Year tabs that auto-generate as you add books
✅ Password protection (`Osheaga2020!`)
✅ Automatic commits to your GitHub repo when you add books

## Your Next Steps (Super Simple!)

### Step 1: Create GitHub Repo (5 minutes)

1. Go to https://github.com and sign in
2. Click the `+` button (top right) → "New repository"
3. Name it: `yearly-reading-flow`
4. Make it **Public**
5. Don't add README/gitignore/license
6. Click "Create repository"

### Step 2: Push Your Code (5 minutes)

Download the folder I created, then in your terminal:

```bash
cd /path/to/yearly-reading-flow
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/yearly-reading-flow.git
git branch -M main
git push -u origin main
```

(Replace YOUR_USERNAME with your actual GitHub username)

### Step 3: Create GitHub Token (3 minutes)

This lets your website add books automatically.

1. GitHub → Your profile picture → Settings
2. Bottom of sidebar → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Name it "Reading Flow"
6. Check the **repo** checkbox
7. Generate and **COPY THE TOKEN** (starts with `ghp_...`)

### Step 4: Deploy to Vercel (5 minutes)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import `yearly-reading-flow`
4. **BEFORE clicking Deploy**, add Environment Variables:
   
   **GITHUB_TOKEN**: [paste your token from Step 3]
   **GITHUB_REPO**: `YOUR_USERNAME/yearly-reading-flow`

5. Click Deploy!
6. Wait 1-2 minutes

### Step 5: Add Your First Book! (2 minutes)

1. Visit your site: `https://your-project.vercel.app`
2. Add `/admin` to the URL
3. Password: `Osheaga2020!`
4. Type a book title (try it now with whatever you just read!)
5. Select the book from results
6. Rate it and write your thoughts
7. Click "Add Book"
8. In ~30 seconds, it'll appear on your main page!

## How Adding Books Works

**Example: You just finished reading "Project Hail Mary"**

1. Go to `/admin`, enter password
2. Type "Project Hail Mary" in search
3. Results appear with covers - click the right one
4. Form shows:
   - Cover (auto-filled ✓)
   - Title & author (auto-filled ✓)
   - Pages (auto-filled, but you can edit)
   - Star rating (you click the stars)
   - Your thoughts (you write your review)
5. Click "Add Book"
6. Website commits to GitHub automatically
7. 30 seconds later, book appears on your site!

## Files Explained

- `index.html` - Your main reading list page
- `admin.html` - Where you add books
- `styles.css` - All the pink/purple styling
- `app.js` - Makes the main page work
- `admin.js` - Makes the admin form work
- `api/add-book.js` - Commits books to GitHub (magic!)
- `books.json` - Where all your book data lives
- `README.md` - Full documentation

## Customization Ideas

**Change the password:**
- Vercel dashboard → Environment Variables
- Add `ADMIN_PASSWORD` with your new password
- Redeploy

**Different colors:**
- Edit `styles.css`
- Search for `#FEB3BA` and `#DFACE5` and change them

**Add more stats:**
- Edit `app.js` to calculate average rating, favorite genre, etc.

## Troubleshooting

**Book doesn't appear after adding:**
- Wait 30-60 seconds for Vercel to rebuild
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)

**Can't add books:**
- Check your GitHub token in Vercel environment variables
- Make sure it has `repo` permissions
- Verify `GITHUB_REPO` format: `username/repo-name`

**Admin won't unlock:**
- Password is `Osheaga2020!` (case sensitive, includes !)

## Privacy Note

Your GitHub repo is public, which means your reading list is public. If you want it private, you'd need Vercel Pro to deploy from a private repo. But honestly, sharing your reading journey publicly is kind of beautiful!

---

That's it! The whole setup should take about 20 minutes total. Once it's live, adding books takes literally 1 minute each.

Let me know if you hit any snags - I'm here to help! 📚✨
