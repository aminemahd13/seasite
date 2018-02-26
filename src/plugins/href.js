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

// @flow

import * as url from "url"
import {handleLinks} from '../site/relativeurls'

const defaults = {
    // relative: false,
    handleURL(url) {
        return url
    }
}

function isAbsoluteURL(url: string) {
    return url.indexOf('http') === 0
}

export function href(gopt: Object = {}) {
    gopt = Object.assign({}, defaults, gopt)

    return ($: Function, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        let baseURL = opt.path || '/'
        if (baseURL[0] !== '/') {
            baseURL = '/' + baseURL
        }

        handleLinks($, href => {
            return opt.handleURL(url.resolve(baseURL, href))
        })

        // absoluteLinks($, opt.path)
    }

}