export default class YouTubeHandler {

  process(info) {
 
    return new Promise((resolve, reject) => {

      let videoId = this.getYouTubeVideoID(info.location.url);

      if (!this.title) {
        this.title = document.title
      }
  
      if (!this.description) {
        let headers = document.getElementsByTagName('h1');
        if (headers.length) {
          this.description = headers[0].textContent;
        }
      }

      if (!this.images) {
        let images = document.getElementsByTagName('img');
        if (images.length) {
          this.images = images;
        } else {
          this.images = []
        }
      }

      if (!this.image && videoId) {
        this.image = `http://img.youtube.com/vi/${videoId}/0.jpg`
      }
  
      if (!this.url) {
        const href = window.location.href;
        this.url = href ? href : false;
      }

      console.log('this.images', this.images);

      resolve({
        match: info.match,
        title: this.title,
        description: this.description,
        image: this.image,
        images: this.images,
        url: this.url
      })

    });
    
  }

  getYouTubeVideoID(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return false;
    }
  }

}