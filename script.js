// --- DOM Elements ---
const githubSearchInput = document.getElementById('github-search-input');
const githubSearchBtn = document.getElementById('github-search-btn');
const githubResults = document.getElementById('github-results');
const newsResults = document.getElementById('news-results');
const jokeResults = document.getElementById('joke-results');

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Functions to run when the page loads
    getTechNews();
    getProgrammingJoke();
});

githubSearchBtn.addEventListener('click', () => {
    const searchTerm = githubSearchInput.value;
    if (searchTerm) {
        getGitHubRepos(searchTerm);
    }
});

// --- API Functions ---

async function getGitHubRepos(query) {
    const apiUrl = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`;
    githubResults.innerHTML = `<p>Searching GitHub for '${query}'...</p>`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const repos = data.items.slice(0, 3); // Get the top 3 results
            const reposHtml = repos.map(repo => `
                <div class="repo-item">
                    <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                    <p>⭐ ${repo.stargazers_count}</p>
                    <p>${repo.description || 'No description available.'}</p>
                </div>
            `).join('');
            githubResults.innerHTML = reposHtml;
        } else {
            githubResults.innerHTML = `<p>No repositories found for '${query}'. Try another search.</p>`;
        }
    } catch (error) {
        githubResults.innerHTML = `<p>Could not fetch data from GitHub. Please try again later.</p>`;
        console.error('GitHub API Error:', error);
    }
}

async function getTechNews() {
    // We use a free RSS to JSON converter to get the Hacker News feed.
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.ycombinator.com%2Frss';
    newsResults.innerHTML = '<p>Loading latest tech news...</p>';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the API call was successful
        if (data.status === 'ok') {
            const articles = data.items.slice(0, 5); // Get the first 5 articles
            const newsHtml = articles.map(article =>
                `<li><a href="${article.link}" target="_blank">${article.title}</a></li>`
            ).join('');

            newsResults.innerHTML = `<ul>${newsHtml}</ul>`;
        } else {
            newsResults.innerHTML = '<p>Could not fetch news at the moment.</p>';
        }
    } catch (error) {
        newsResults.innerHTML = '<p>Could not fetch news. The API might be down.</p>';
        console.error('News API Error:', error);
    }
}

async function getProgrammingJoke() {
    const apiUrl = 'https://official-joke-api.appspot.com/jokes/programming/ten';
    jokeResults.innerHTML = '<p>Thinking of a funny joke...</p>';

    try {
        const response = await fetch(apiUrl);
        const jokes = await response.json();
        // Get a random joke from the list of 10
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        
        jokeResults.innerHTML = `
            <p style="font-style: italic;">${joke.setup}</p>
            <p>${joke.punchline} 😂</p>
        `;
    } catch (error) {
        jokeResults.innerHTML = '<p>Couldn\'t fetch a joke. The API might be down.</p>';
        console.error('Joke API Error:', error);
    }
}