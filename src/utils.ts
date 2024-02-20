export function prettyfyStr(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str[0].toUpperCase())
}

export function camelCaseToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function convertString(str: string): boolean | number | string {
  // Check if the string is a boolean
  if (str.toLowerCase() === 'true') return true
  if (str.toLowerCase() === 'false') return false

  // Check if the string is a number
  const num = Number(str)
  if (!isNaN(num)) return num

  // If the string is not a boolean or a number, return it as is
  return str
}

export function convertObjectValues(
  obj: Record<string, string>,
): Record<string, boolean | number | string> {
  const newObj: Record<string, boolean | number | string> = {}

  for (const key in obj) {
    newObj[key] = convertString(obj[key])
  }

  return newObj
}
