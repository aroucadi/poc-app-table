import { fetchSelectionCustomFieldValues } from "../../infrastructure/SelectionCustomFieldValuesFetcher";
import { CUSTOM_FIELDS } from "./CustomFieldDictionary";

/**
 * Fetches the list of Squad Porteuse values.
 *
 * @returns {Promise<Array>} - An array of Squad Porteuse values.
 */
export async function fetchProgramSquads() {
  const customFieldId = CUSTOM_FIELDS["Squad Porteuse"];

  try {
    const values = await fetchSelectionCustomFieldValues(customFieldId);
    return values;
  } catch (error) {
    console.error("Error fetching Program Squads values:", error);
    throw error;
  }
}
