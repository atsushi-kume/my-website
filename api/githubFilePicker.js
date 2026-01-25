// api/githubFilePicker.js
// --------------------------------------------
// GitHub folder → file picker API
// data1 / data2 / csv / json 混在対応
// --------------------------------------------

export async function listGitHubFiles(config) {
    /*
    config = {
        owner: "YOUR_GITHUB_ID",
        repo: "YOUR_REPO",
        branch: "main",               // or master
        folder: "data1",              // "data1" | "data2"
        token: "ghp_xxx..."           // optional (private repo)
    }
    */

    const { owner, repo, branch, folder, token } = config;

    const url =
        `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${branch}`;

    const headers = {};
    if (token) headers.Authorization = "Bearer " + token;

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error("GitHub API error");

    const list = await res.json();

    // CSV / JSON だけ通す
    const files = list
        .filter(f => f.type === "file")
        .filter(f => f.name.match(/\.(json|csv)$/i))
        .map(f => ({
            name: f.name,
            path: `${folder}/${f.name}`,
            download_url: f.download_url,
            sha: f.sha,
            size: f.size
        }));

    return files;
}