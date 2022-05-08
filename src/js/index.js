

import '../css/content.less';
import '../css/index.css';
import backgroundImg from '../css/223.png';
// import {count} from './b.js'


document.querySelector('.btn').addEventListener('click',function(){
  // 预加载，当浏览器空闲了偷偷加载文件，然后等点击的时候取已经加载好的缓存，再触发then的回调
  import(/* webpackChunkName:'bb',webpackPrefetch:true */'./b.js').then(res=>{
    console.log('动态架子啊成功',res)
  }).catch(err=>{
    console.log('记载失败',err)
  })
})

console.log('我111是js--211');
document.querySelector('body').style.backgroundImage = 'url('.concat(backgroundImg, ')');
const a = 'astring';
const promise = new Promise(((resolve, reject) => {
  window.setTimeout(() => {
    console.log('我是settimtout');
    resolve('yes');
  });
}));

function add(x, y) {
  return x + y;
}

console.log('add11:11', add(1, 2));
console.log('a:', a); // promise().then(res => {
//   console.log('res', res);
// }).catch(err => {
//   console.error('err', err);
// });


if(module.hot){
  module.hot.accept('./b.js',function(){
    console.log('加载成功了！！')
  })
  console.log('module.hot',module.hot)
}