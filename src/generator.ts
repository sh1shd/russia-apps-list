import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { YAML } from 'bun'

class Generator {
    private static readonly APPS_PATH = resolve(process.cwd(), 'data', 'apps.json')
    private static readonly OUTPUT_DIR = resolve(process.cwd(), 'raw')

    private static async getAppPackages(): Promise<string[]> {
        const rawData = await readFile(this.APPS_PATH, 'utf-8')
        const parsedData = JSON.parse(rawData)
        
        const appPackagesArray: string[] = []

        parsedData.apps.forEach((appPackage: string) => {
            appPackagesArray.push(appPackage)
        });

        return appPackagesArray
    }

    private static async ensureOutputDir(): Promise<void> {
        await mkdir(this.OUTPUT_DIR, { recursive: true })
    }

    static async generateHappServerFile(): Promise<void> {
        const packages = await this.getAppPackages()
        await this.ensureOutputDir()

        const content = [
            '#per-app-proxy-mode: bypass',
            `#per-app-proxy-list: ${packages.join(',')}`,
            ''
        ].join('\n')

        const filePath = join(this.OUTPUT_DIR, 'happ-subscription.txt')
        await writeFile(filePath, content, 'utf-8')
    }

    static async generateHappUserFile(): Promise<void> {
        const packages = await this.getAppPackages()
        await this.ensureOutputDir()

        const content = packages.join('\n')

        const filePath = join(this.OUTPUT_DIR, 'happ-user.txt')
        await writeFile(filePath, content, 'utf-8')
    }

    static async generateMihomoFile(): Promise<void> {
        const packages = await this.getAppPackages()
        await this.ensureOutputDir()

        const data = {
            payload: packages.map((pkg) => `PROCESS-NAME,${pkg}`)
        }

        const content = YAML.stringify(data, null, 2)

        const filePath = join(this.OUTPUT_DIR, 'mihomo-rules.yaml')
        await writeFile(filePath, content, 'utf-8')
    }

    static async generateAll(): Promise<void> {
        await Promise.all([
            this.generateHappServerFile(),
            this.generateHappUserFile(),
            this.generateMihomoFile()
        ])
    }
}

export default Generator