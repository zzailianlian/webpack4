/**
 * 1、验证webpack的externals功能
 * 2、验证webpack的dll静态资源引入功能
 */

import { map } from 'lodash'
import dayjs from 'dayjs'


const arr = [
  {
    name: 'zzz', age: 21
  }, {
    name: 'zzz2', age: 22
  }
]

console.log('dayjs--:', dayjs(new Date()))

export const getNewArr = () => {
  return map(arr, item => item.name)
}