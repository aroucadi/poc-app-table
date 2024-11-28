import api, { route } from "@forge/api";

/**
 * Fetches the list of possible values for a selection-based custom field.
 *
 * @param {string} customFieldId - The ID of the custom field (e.g., "customfield_10000").
 * @returns {Promise<Array>} - An array of possible values for the custom field. Returns an empty array if the field type is not supported.
 * @throws {Error} - If the request fails.
 */
export async function fetchSelectionCustomFieldValues(customFieldId) {
  if (!customFieldId) {
    throw new Error("Custom field ID is required.");
  }

  try {
    // Fetch the custom field definition to check its type
    const fieldResponse = await api.asApp().requestJira(route`/rest/api/3/field/${customFieldId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!fieldResponse.ok) {
      throw new Error(
        `Failed to fetch custom field details: ${fieldResponse.status} - ${fieldResponse.statusText}`
      );
    }

    const fieldData = await fieldResponse.json();

    // Check if the custom field is of the correct type
    const supportedTypes = ["single-select", "multi-select"];
    if (!supportedTypes.includes(fieldData.schema?.type)) {
      console.warn(`Custom field ${customFieldId} is not a selection type. Returning empty array.`);
      return [];
    }

    // Fetch possible values for the custom field
    const valuesResponse = await api.asApp().requestJira(route`/rest/api/3/customField/${customFieldId}/option`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!valuesResponse.ok) {
      throw new Error(
        `Failed to fetch custom field values: ${valuesResponse.status} - ${valuesResponse.statusText}`
      );
    }

    const valuesData = await valuesResponse.json();
    return valuesData.values || []; // Return the list of possible values
  } catch (error) {
    console.error(`Error fetching custom field values for ${customFieldId}:`, error);
    throw error;
  }
}
