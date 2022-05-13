import $ from 'jquery'
import '../css/content.less';
import '../css/index.css';
import { multiple } from './b';
import { getNewArr } from './testExternals';

console.log('$-jquery:', $('body'))
console.log('test2.js  / getNewArr ', getNewArr())
// import backgroundImg from '../css/223.png'; // import {count} from './b.js'
// document.querySelector('.btn').addEventListener('click'  ,  function()   {
//   // 预加载，当浏览器空闲了偷偷加载文件，然后等点击的时候取已经加载好的缓存，再触发then的回调
//   import(/* webpackChunkName:'bb',webpackPrefetch:true */'./b.js').then(res=>{
//     console.log('动态架子啊成功',res)
//   }).catch(err=>{
//     console.log('记载失败',err)
//   })
// })

console.log('我111是js--21---3--1---33'); // document.querySelector('body').style.backgroundImage = 'url('.concat(backgroundImg, ')');

const a = 'astring'; // const promise = new Promise((resolve, reject) => {
//   window.setTimeout(() => {
//     console.log('我是settimtout');
//     resolve('yes');
//   });
// });

function add(x, y) {
  return x + y;
}

console.log('add11:11', add(1, 2), multiple(3, 4));
console.log('a:', a); // promise().then(res => {
//   console.log('res', res);
// }).catch(err => {
//   console.error('err', err);
// });



// 注册需要热模块替换的js文件
if (module.hot) {
  module.hot.accept('./b.js', () => {
    console.log('加载成功了！！');
  });
  console.log('module.hot', module.hot);
}

// 如果浏览器支持serviceWorker，就将生成的service-worker.js文件注册下。当离线时可以进serviceWorker里去捞缓存的资源
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(res => {
      console.log('启用serviceWorker！')
    }).catch(err => {
      console.log('启用serviceWorker失败！')
    })
  })
}