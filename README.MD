# Publishing an HTML5 Game to GitHub Pages with VSCode

## Prerequisites
- A GitHub account
- Git installed on your machine
- Visual Studio Code (VSCode) installed on your machine

## Step 1: Create a New Repository on GitHub
1. Go to GitHub and log in to your account.
2. Click on the `New` button to create a new repository.
3. Name the repository. 
   - If you want your game to be hosted at the root of your GitHub Pages domain (`<username>.github.io`), you must name your repository this exact name. 
   - For a project page, you can name it whatever you like.
4. Add a description (optional).
5. Set the repository to Public.
6. Initialize the repository with a README (optional).
7. Click on `Create repository`.

## Step 2: Clone the Repository to Your Local Machine
1. Click the `Code` button on the repository page, then copy the URL under "Clone with HTTPS".
2. Open VSCode, then press `Ctrl + Shift + P` to open the command palette.
3. Type `git clone`, then press `Enter`.
4. Paste the URL you copied earlier, then press `Enter`.
5. Choose a local path where you want the repository files to be stored, then press `Enter`.

## Step 3: Add Your Game Files to the Repository
1. Add the HTML file of your game to the repository folder.
2. If your game includes additional files (like images, JavaScript files, or CSS files), add those to the repository as well.

## Step 4: Commit and Push Your Changes
1. In VSCode, click on the source control icon (the one that looks like a branch) on the left sidebar.
2. Click on the `+` button to stage your changes.
3. Type a commit message in the text field at the top, then press `Ctrl + Enter` to commit the changes.
4. Click on the `...` button at the top, then choose `Push`.

## Step 5: Enable GitHub Pages for Your Repository
1. Go back to your repository on GitHub.
2. Click on the `Settings` tab.
3. Scroll down to the GitHub Pages section.
4. Under Source, choose the `master` branch (or `main` depending on your settings).
5. Click `Save`.

Your game should now be available at `<username>.github.io/<repository>` (or just `<username>.github.io` if you named your repository that). Replace `<username>` and `<repository>` with your actual GitHub username and repository name.
