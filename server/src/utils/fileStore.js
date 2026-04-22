import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function readJsonFile(filePath) {
  try {
    const fileContents = await readFile(filePath, 'utf-8')
    return JSON.parse(fileContents)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function writeJsonFile(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')
}
