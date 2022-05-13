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