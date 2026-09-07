import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { load, type CheerioAPI } from 'cheerio'
import { developers, externalApps } from './constants'

interface AppsData {
  apps: string[]
}

class Scanner {
  private static readonly APPS_PATH = path.resolve(process.cwd(), 'data', 'apps.json')
  private static readonly BASE_URL = 'https://www.rustore.ru'
  private static readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

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

    // Deduplicate entries using Set and sort alphabetically
    const sortedUniqueApps = Array.from(new Set(data.apps)).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    )

    await this.writeApps({ apps: sortedUniqueApps })
  }

  private static async fetchPage(urlOrPath: string): Promise<{ $: CheerioAPI; rawHtml: string } | null> {
    const targetUrl = urlOrPath.startsWith('http')
      ? urlOrPath
      : `${this.BASE_URL}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': this.USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8'
      }
    })

    if (!response.ok) {
      console.warn(`[Scanner] Failed to load page: ${targetUrl} (HTTP ${response.status})`)
      return null
    }

    const rawHtml = await response.text()
    return { $: load(rawHtml), rawHtml }
  }

  private static extractPackages($: CheerioAPI, rawHtml: string, appsSet: Set<string>): number {
    let addedCount = 0

    // Method 1: Query DOM anchor links matching the application path pattern
    $('a[href*="/catalog/app/"]').each((_, element) => {
      const href = $(element).attr('href') || ''
      const match = href.match(/\/catalog\/app\/([^/?#]+)/)

      if (match && match[1]) {
        const appPackage = match[1]
        if (!appsSet.has(appPackage)) {
          console.log(`Adding «${appPackage}» package`)
          appsSet.add(appPackage)
          addedCount++
        }
      }
    })

    // Method 2: Scan raw markup if DOM returned no items (handles Next.js App Router client chunks)
    if (addedCount === 0) {
      const matches = rawHtml.matchAll(/\/catalog\/app\/([a-zA-Z0-9._-]+)/g)
      for (const match of matches) {
        const appPackage = match[1]
        if (appPackage && !appsSet.has(appPackage)) {
          console.log(`Adding «${appPackage}» package (via stream match)`)
          appsSet.add(appPackage)
          addedCount++
        }
      }
    }

    return addedCount
  }

  private static extractPaginationPages($: CheerioAPI, currentPath: string): string[] {
    const pages = new Set<string>()

    $('a').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return

      const cleanHref = href.split('?')[0].split('#')[0]

      // Check whether the anchor targets a numbered developer page
      const isPaginationLink =
        cleanHref.includes('/catalog/developer/') &&
        /\/page-\d+$/.test(cleanHref)

      if (isPaginationLink && cleanHref !== currentPath) {
        pages.add(cleanHref)
      }
    })

    return Array.from(pages)
  }

  static async scan(): Promise<void> {
    const data = await this.readApps()
    const appsSet = new Set<string>(data.apps)

    for (const developer of developers) {
      const initialPath = `/catalog/developer/${developer}`
      console.log(`Scanning «${developer}»...`)

      try {
        const pageData = await this.fetchPage(initialPath)
        if (!pageData) continue

        this.extractPackages(pageData.$, pageData.rawHtml, appsSet)

        // Find all pagination endpoints: /catalog/developer/<dev_id>/page-<N>
        const additionalPages = this.extractPaginationPages(pageData.$, initialPath)

        for (const pagePath of additionalPages) {
          console.log(`Scanning page: ${pagePath}`)
          const additionalData = await this.fetchPage(pagePath)
          if (additionalData) {
            this.extractPackages(additionalData.$, additionalData.rawHtml, appsSet)
          }
        }
      } catch (error) {
        console.error(`[Scanner] Error while scanning ${developer}:`, error)
      }
    }

    // Merge static external applications
    for (const externalApp of externalApps) {
      appsSet.add(externalApp)
    }

    await this.writeApps({ apps: Array.from(appsSet) })
    await this.format()
  }
}

export default Scanner