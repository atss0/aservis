import storage from "../storage"

export const safeStorageSet = (key: string, value: any): boolean => {
  try {
    if (value === null || value === undefined) {
      console.warn(`Attempting to store null/undefined value for key: ${key}`)
      return false
    }

    // Handle different types safely
    if (typeof value === "string") {
      storage.set(key, value)
    } else if (typeof value === "number") {
      storage.set(key, value)
    } else if (typeof value === "boolean") {
      storage.set(key, value)
    } else if (typeof value === "object") {
      // Convert object to JSON string
      storage.set(key, JSON.stringify(value))
    } else {
      // Convert other types to string
      storage.set(key, String(value))
    }

    return true
  } catch (error) {
    console.error(`Failed to store value for key ${key}:`, error)
    return false
  }
}

export const safeStorageGet = (key: string, isObject = false): any => {
  try {
    const value = storage.getString(key)

    if (!value) {
      return null
    }

    if (isObject) {
      try {
        return JSON.parse(value)
      } catch (parseError) {
        console.warn(`Failed to parse JSON for key ${key}:`, parseError)
        return null
      }
    }

    return value
  } catch (error) {
    console.error(`Failed to get value for key ${key}:`, error)
    return null
  }
}

export const safeStorageDelete = (key: string): boolean => {
  try {
    storage.delete(key)
    return true
  } catch (error) {
    console.error(`Failed to delete key ${key}:`, error)
    return false
  }
}
