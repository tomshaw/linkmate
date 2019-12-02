
export default class PageContent {

  getYouTubeVideoID(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return false;
    }
  }

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
