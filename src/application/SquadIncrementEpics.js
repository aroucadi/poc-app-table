import { storage } from "@forge/api";
import { searchIssues } from "../../infrastructure/issuesLookup";
import { CUSTOM_FIELDS } from "./CustomFieldDictionary";

/**
 * Fetches all epics matching the given PI Planning and Squad Porteuse criteria,
 * caches the result, and returns a simplified list of objects with EpicKey and POLProjectKey.
 *
 * @param {string} piPlanningValue - The value for the PI Planning field (e.g., "PI 1 - 2024").
 * @param {string} squadValue - The value for the Squad Porteuse field (e.g., "Squad Analytics").
 * @returns {Promise<Array>} - A cached or freshly fetched list of objects { EpicKey, POLProjectKey }.
 * @throws {Error} - If the search fails.
 */
export async function fetchSquadIncrementEpics(piPlanningValue, squadValue) {
  if (!piPlanningValue || !squadValue) {
    throw new Error("Both PI Planning and Squad values are required.");
  }

  const cacheKey = `epics::${piPlanningValue}::${squadValue}`;
  const cachedData = await storage.get(cacheKey);

  // If data is cached, return it immediately
  if (cachedData) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return cachedData;
  }

  const piPlanningField = CUSTOM_FIELDS["PI Planning"];
  const squadField = CUSTOM_FIELDS["Squad Porteuse"];

  if (!piPlanningField || !squadField) {
    throw new Error("Custom fields for PI Planning or Squad Porteuse are not defined.");
  }

  // Construct the JQL query
  const jql = `"${piPlanningField}[Select List (multiple choices)]" = "${piPlanningValue}" AND "${squadField}[Dropdown]" = "${squadValue}"`;

  try {
    // Search for issues with the given JQL
    const epics = await searchIssues("Epic", jql);

    // Prepare a simplified list with EpicKey and POLProjectKey
    const result = epics.map((epic) => ({
      EpicKey: epic.key,
      POLProjectKey: epic.fields.parent?.key || null, // Parent issue key
    }));

    // Store the result in the cache for future requests
    await storage.set(cacheKey, result);
    console.log(`Cache updated for key: ${cacheKey}`);

    return result;
  } catch (error) {
    console.error("Error fetching Squad Increment Epics:", error);
    throw error;
  }
}
