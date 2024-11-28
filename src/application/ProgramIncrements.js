import { fetchSelectionCustomFieldValues } from "../../infrastructure/SelectionCustomFieldValuesFetcher";
import { CUSTOM_FIELDS } from "./CustomFieldDictionary";

/**
 * Fetches the list of PI Planning values.
 *
 * @returns {Promise<Array>} - An array of PI Planning values.
 */
export async function fetchProgramIncrements() {
  const customFieldId = CUSTOM_FIELDS["PI Planning"];

  try {
    const values = await fetchSelectionCustomFieldValues(customFieldId);
    return values;
  } catch (error) {
    console.error("Error fetching Program Increments values:", error);
    throw error;
  }
}
