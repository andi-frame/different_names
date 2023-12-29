import { $query, $update, Record, match, Result, StableBTreeMap } from 'azle';

// Define the structure of data records
type Data = Record<{
  owner: string;
  name: string;
}>;

// Create a stable B-tree map to store names
const nameStorage = new StableBTreeMap<string, string>(0, 44, 1024);

// Function to check if a value exists in the map
function findInMap(map: StableBTreeMap<string, string>, val: string): boolean {
  const values = map.values();
  for (const v of values) {
    if (v === val) {
      return true;
    }
  }
  return false;
}

$update;
// Function to add a new name
export function addName(owner: string, name: string): Result<string, string> {
  try {
    // Payload Validation: Ensure that both owner and name are provided
    if (!owner || !name) {
      return Result.Err<string, string>('Invalid payload. Both owner and name are required.');
    }

    // Check if the name already exists
    if (findInMap(nameStorage, name)) {
      return Result.Err<string, string>('Name already exists. Please insert another name.');
    }

    // Insert the new name into the storage
    nameStorage.insert(name, owner);
    return Result.Ok<string, string>(`${name} entered successfully.`);
  } catch (error) {
    return Result.Err<string, string>(`Failed to add name. Error: ${error}`);
  }
}

$query;
// Function to get names for a given owner
export function getNames(owner: string): Result<string, string> {
  try {
    // ID Validation: Ensure that the provided owner is a valid UUID
    if (!owner) {
      return Result.Err<string, string>('Invalid owner ID format.');
    }

    return match(nameStorage.get(owner), {
      Some: (name) => Result.Ok<string, string>(name),
      None: () => Result.Err<string, string>(`No names found for owner: ${owner}`),
    });
  } catch (error) {
    return Result.Err<string, string>(`An error occurred while retrieving names. Error: ${error}`);
  }
}
