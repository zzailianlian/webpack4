/**
 * 1、验证多层嵌套css文件时，css文件中引入的图片路径是否会因为相对路径问题而找不到
 * 2、验证webpack的resolve配置中的'@'的alias是否生效
 */
import '../../css/childCss/childcss'
// import '../../css/childCss/child2Css/child2css'
import '@/css/childCss/child2Css/child2css'

console.log('引入嵌套目录中的css')
