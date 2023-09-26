import { promises as fs } from 'fs'
import sharp from 'sharp'
import path from 'path'
import { REG_GETPATH, REG_MATCHIMG, REG_ONLYIMG, R_OK, W_OK } from './constants'
import { Plugin, Alias } from 'vite'

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
  } catch (error) {
    return false
  }
}

/**
 * compress image.
 * jpg and png to webp.
 *
 * @param files
 * @returns
 */
async function compressImage(files: string[]): Promise<string[]> {
  let outputs: string[] = []
  for (const file of files) {
    const outPath = convertPath(file)

    // Do nothing if the webp file already exists.
    if (await fsExists(outPath)) {
      continue
    }

    await sharp(file).webp().toFile(outPath)
    print(`\ncompress: ${file} -> WEBP`)
    outputs.push(outPath)
  }

  /**
   * The generated webp files are recorded here in order to delete these files after
   * the build is completed, because these files will affect git diff.
   */
  return outputs
}

export default function (): Plugin {
  let alias: Alias[] = []
  let outputs: string[] = []

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
    async transform(code: string, _filePath: string) {
      if (code.match(REG_ONLYIMG)) {
        let files: string[] = []
        const replacedCode = code.replace(REG_MATCHIMG, (key) => {
          files.push(
            alias.reduce((next: string, item: Alias) => {
              return next.match(item.find) ? next.replace(item.find, item.replacement) : next
            }, key.replace(REG_GETPATH, '')) as string
          )
          return key.replace(REG_ONLYIMG, '.webp')
        })

        outputs.push(...(await compressImage(files)))
        return replacedCode
      } else {
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
