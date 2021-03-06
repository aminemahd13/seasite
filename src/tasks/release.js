/*
 * Copyright (C) 2018 Dirk Holtwick <https://holtwick.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// (C)opyright Dirk Holtwick, 2016-08-20 <dirk.holtwick@gmail.com>
// @jsx html

import { existsSync, statSync } from 'fs'
import { SeaSite } from '../index'

let defaults = {
  folder: 'release',
  pattern: null,
}

export function release(site: SeaSite, opt: Object = {}): Array<Object> {
  opt = Object.assign({}, defaults, opt)

  if (!opt.pattern && opt.folder) {
    opt.pattern = new RegExp(opt.folder + '\/.*\.(zip|exe|dmg|AppImage)$')
  }

  let entries = site.paths(opt.pattern)
    .filter(p => /\.\d+(b\d+)?(-\d+)?\.(zip|exe|dmg|AppImage)$/.test(p))
    .map(path => {
      const r = /(^.+[^\d.])(((\d+)\.(\d+)(\.(\d+))?(\.(\d+))?(b(\d+))?)(-(\d+))?)\.[^.]+$/.exec(path)
      // console.log('r', r)
      const prefix = r[1]
      const fullVersion = r[2]
      const version = r[3]
      const major = +r[4] || 0
      const minor = +r[5] || 0
      const patch = +r[7] || 0
      const fix = +r[9] || 0
      const beta = +r[11] || 0
      const build = +r[13] || 0

      let descPath = `${prefix}${version}.md`
      if (!existsSync(site.path(descPath))) {
        descPath = null
      }

      if (opt.skipMD || descPath) {
        const stat = statSync(site.path(path)) || {}
        return {
          date: stat.mtime, // creation time
          size: stat.size,
          major,
          minor,
          patch,
          fix,
          beta,
          version,
          fullVersion,
          build,
          // md,
          path,
          prefix,
          descPath,
        }
      }
    })
    .filter(o => !!o) // exclude empty ones
    .sort((a, b) => { // by build and version numbers
      let r
      r = a.build - b.build
      if (r === 0) {
        r = a.major - b.major
        if (r === 0) {
          r = a.minor - b.minor
          if (r === 0) {
            r = a.patch - b.patch
            if (r === 0) {
              r = a.fix - b.fix
              if (r === 0) {
                r = a.beta - b.beta
              }
            }
          }
        }
      }
      return r
    })
    .reverse()

  // console.log('entries', entries)
  return entries


  // const APP_VERSION = DOWNLOADS[0].version
  // const DOWNLOAD_URL_DIRECT = `/download/${DOWNLOADS[0].filename}`
  //
  // site.handle('track/ho_variables.php', content => {
  //     // console.log(content)
  //     return content.replace('0.0.0-placeholder', APP_VERSION)
  // })
  //
  // site.handle('php/page-latest.php', content => {
  //     console.log('Latest', DOWNLOAD_URL_DIRECT)
  //     return content.replace(/'\/download\/Receipts-latest.zip'/gi, '\'' + DOWNLOAD_URL_DIRECT + '\'')
  // })
  //
  // site.handle('changelog.html', $ => {
  //     $('#content').empty()
  //     $('link[hreflang]').remove()
  //     for (let release of DOWNLOADS) {
  //         $('#content').append(<div>
  //             <h3>
  //                 Version
  //                 {' '}
  //                 <a href={`/goto/download/${release.filename}`}>{release.version}</a>
  //             </h3>
  //             {
  //                 release.md
  //             }
  //         </div>)
  //         $('#content').append(<div>
  //             <hr/>
  //         </div>)
  //     }
  // })

}
