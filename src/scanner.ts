import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { load } from 'cheerio'
import { developers, externalApps } from './constants'

interface AppsData {
    apps: string[]
}

class Scanner {
    private static readonly APPS_PATH = path.resolve(process.cwd(), 'data', 'apps.json')

    private static async readApps(): Promise<AppsData> {
        try {
            const content = await fs.readFile(this.APPS_PATH, 'utf-8')
            const parsed = JSON.parse(content)
            return Array.isArray(parsed?.apps) ? parsed : { apps: [] }
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return { apps: [] }
            }
            throw error
        }
    }

    private static async writeApps(data: AppsData): Promise<void> {
        await fs.writeFile(this.APPS_PATH, JSON.stringify(data, null, 2), 'utf-8')
    }

    static async format(): Promise<void> {
        const data = await this.readApps()

        const sortedUniqueApps = Array.from(new Set(data.apps)).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' })
        )

        await this.writeApps({ apps: sortedUniqueApps })
    }

    static async scan(): Promise<void> {
        const data = await this.readApps()
        const appsSet = new Set<string>(data.apps)

        for (const developer of developers) {
            const url = `https://www.rustore.ru/catalog/developer/${developer}`

            console.log(`Scanning «${developer}»`)

            try {
                const response = await fetch(url, {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })

                if (!response.ok) {
                    console.warn(`[scanner] Failed to load page: ${url} (HTTP ${response.status})`)
                    continue
                }

                const html = await response.text()
                const $ = load(html)

                // Селектор: ссылка с обоими классами
                $('a.CEPiHSwn.wuR8_WZN').each((_, element) => {
                    const href = $(element).attr('href') || ""

                    if (href && href.startsWith('/catalog/app/')) {
                        const appPackage = href.replace(/^\/catalog\/app\/?/, '').split('?')[0].split('#')[0]

                        if (appPackage) {
                            console.log(`Adding «${appPackage}» package`)

                            appsSet.add(appPackage)
                        }
                    }
                })
            } catch (error) {
                console.error(`[Scanner] Parsing developer error (${developer}):`, error)
            }
        }

        for (const externalApp of externalApps) {
            appsSet.add(externalApp)
        }

        await this.writeApps({ apps: Array.from(appsSet) })
        await this.format()
    }
}

export default Scanner