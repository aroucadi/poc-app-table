import { storage } from "@forge/api";
import { fetchSquadIncrementEpics } from "./SquadIncrementEpics";
import { fetchIssue } from "../../infrastructure/IssueFetcher";
import { CUSTOM_FIELDS } from "./CustomFieldDictionary";

/**
 * Fetches and returns the full hierarchy of Program, Project (POL), and Epics.
 * Uses caching to optimize subsequent requests.
 *
 * @param {string} piPlanningValue - The value for the PI Planning field (e.g., "PI 1 - 2024").
 * @param {string} squadValue - The value for the Squad Porteuse field (e.g., "Squad Analytics").
 * @returns {Promise<Array>} - A list of combined objects { ProgramKey, ProjectKey, EpicKey }.
 * @throws {Error} - If any of the fetches fail.
 */
export async function fetchSquadIncrementHierarchy(piPlanningValue, squadValue) {
  if (!piPlanningValue || !squadValue) {
    throw new Error("Both PI Planning and Squad values are required.");
  }

  const cacheKey = `projects::${piPlanningValue}::${squadValue}`;
  const cachedData = await storage.get(cacheKey);

  // Return cached data if available
  if (cachedData) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return cachedData;
  }

  try {
    // Step 1: Fetch Epics
    const epics = await fetchSquadIncrementEpics(piPlanningValue, squadValue);

    // Step 2: Extract unique POLProjectKeys
    const uniquePOLProjectKeys = [
      ...new Set(epics.map((epic) => epic.POLProjectKey).filter((key) => key)),
    ];

    // Step 3: Fetch Project (POL) details and parent Program for each POLProjectKey
    const projectDetails = await Promise.all(
      uniquePOLProjectKeys.map(async (projectKey) => {
        const projectData = await fetchIssue(projectKey);
        const parentKey = projectData.fields?.parent?.key || null; // Program key
        const idPOL = projectData.fields[CUSTOM_FIELDS["ID POL"]] || null;
        const nature = projectData.fields[CUSTOM_FIELDS["Nature"]] || null;

        return {
          ProjectKey: projectKey,
          ProgramKey: parentKey,
          Summary: projectData.fields.summary,
          IDPOL: idPOL,
          Nature: nature,
        };
      })
    );

    // Step 4: Combine Epics with Project and Program data
    const combinedData = epics.map((epic) => {
      const project = projectDetails.find(
        (proj) => proj.ProjectKey === epic.POLProjectKey
      );
      return {
        ProgramKey: project?.ProgramKey || null,
        ProjectKey: epic.POLProjectKey,
        EpicKey: epic.EpicKey,
      };
    });

    // Step 5: Cache the combined data
    await storage.set(cacheKey, combinedData);
    console.log(`Cache updated for key: ${cacheKey}`);

    return combinedData;
  } catch (error) {
    console.error("Error fetching Squad Increment Hierarchy:", error);
    throw error;
  }
}
