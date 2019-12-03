
export default class PageContent {

  constructor() {}

  preloadImage(src) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = src;
      image.onload = (img) => {
        resolve({
          src: src,
          width: image.width,
          height: image.height
        })
      }
      image.onerror = (err) => {
        reject(err)
      }
    });
  }
}
