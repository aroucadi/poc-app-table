import api, { route } from "@forge/api";

/**
 * Fetches issue data from Jira using the Forge REST API.
 * 
 * @param {string} issueKey - The key of the issue to fetch (e.g., "PROJ-123").
 * @returns {Promise<object>} - The data of the requested issue.
 * @throws {Error} - If the issue fetch fails.
 */
export async function fetchIssue(issueKey) {
  if (!issueKey) {
    throw new Error("Issue key is required.");
  }

  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch issue: ${response.status} - ${response.statusText}`);
    }

    const issueData = await response.json();
    return issueData;
  } catch (error) {
    console.error(`Error fetching issue with key ${issueKey}:`, error);
    throw error;
  }
}
