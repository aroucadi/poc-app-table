import api, { route } from "@forge/api";

/**
 * Searches for Jira issues based on issue type and a JQL condition.
 * 
 * @param {string} issueType - The type of issue to search for (e.g., "Program", "Projet (POL)", "Epic").
 * @param {string} jqlCondition - Additional JQL condition to refine the search (e.g., "priority = High").
 * @returns {Promise<object>} - The search results, including matching issues.
 * @throws {Error} - If the search request fails.
 */
export async function searchIssues(issueType, jqlCondition) {
  if (!issueType) {
    throw new Error("Issue type is required.");
  }

  if (!jqlCondition) {
    throw new Error("JQL condition is required.");
  }

  const jql = `issuetype = "${issueType}" AND ${jqlCondition}`;

  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jql }),
    });

    if (!response.ok) {
      throw new Error(`Failed to search issues: ${response.status} - ${response.statusText}`);
    }

    const searchResults = await response.json();
    return searchResults;
  } catch (error) {
    console.error(`Error performing issue search with JQL "${jql}":`, error);
    throw error;
  }
}
