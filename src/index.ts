import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import type { Alias, Plugin } from 'vite'
import { REG_GETPATH, REG_MATCHIMG, REG_ONLYIMG, R_OK, W_OK } from './constants'

function print(msg: string): void {
  process.stdout.write(msg)
}

function convertPath(imagePath: string): string {
  const { dir, root, name } = path.parse(imagePath)
  return path.format({ dir, root, name, ext: '.webp' })
}

async function fsExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, R_OK | W_OK)
    return true
  }
  catch (error) {
    return false
  }
}

function isRelativePath(path: string): boolean {
  return path.startsWith('.')
}

/**
 * compress image.
 * jpg and png to webp.
 *
 * @param files
 * @returns
 */
async function compressImage(files: string[], root: string): Promise<string[]> {
  const outputs: string[] = []
  for (const file of files) {
    const filePath = isRelativePath(file) ? path.resolve(root, file) : file
    const outPath = convertPath(filePath)

    // Do nothing if the webp file already exists.
    if (await fsExists(outPath))
      continue

    await sharp(filePath).webp().toFile(outPath)
    print(`\ncompress: ${filePath} -> WEBP`)
    outputs.push(outPath)
  }

  /**
   * The generated webp files are recorded here in order to delete these files after
   * the build is completed, because these files will affect git diff.
   */
  return outputs
}

const VitePluginWebpCompress = (): Plugin => {
  let alias: Alias[] = []
  const outputs: string[] = []

  return {
    name: 'vite: webp-compress',
    apply: 'build',
    configResolved(config) {
      /**
       * Compatible with custom modules to introduce address
       * rewriting and restore the real path。
       */
      alias = config.resolve.alias as Alias[]
    },
    async transform(code: string, filePath: string) {
      if (code.match(REG_ONLYIMG)) {
        const files: string[] = []
        const root = path.dirname(filePath)
        const replacedCode = code.replace(REG_MATCHIMG, (key) => {
          files.push(
            alias.reduce((next: string, item: Alias) => {
              return next.match(item.find) ? next.replace(item.find, item.replacement) : next
            }, key.replace(REG_GETPATH, '')) as string,
          )
          return key.replace(REG_ONLYIMG, '.webp')
        })

        outputs.push(...(await compressImage(files, root)))
        return replacedCode
      }
      else {
        return code
      }
    },
    async closeBundle() {
      /**
       * Delete the generated webp files.
       */
      for (const file of outputs) {
        if (await fsExists(file)) {
          await fs.rm(file)
          print(`\ndelete: ${file}`)
        }
      }
    },
  }
}

export default VitePluginWebpCompress

export { VitePluginWebpCompress }
