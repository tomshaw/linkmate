import PageContent from './page'

export default class YouTubeHandler extends PageContent {

  constructor() {
    super();
  }

  process(info) {
 
    return new Promise((resolve, reject) => {

      let videoId = this.getYouTubeVideoID(info.location.url);

      if (!this.title) {
        let title = document.querySelector('#info h1.title');
        if (title) {
          this.title = title.innerText;
        } else {
          this.title = document.title
        }
      }

      if (!this.description) {
        let description = document.getElementById('description');
        if (description) {
          this.description = description.textContent;
        } else {
          this.description = 'Please enter a description.'
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

      this.images = [];
      if (this.image) {
        this.images.push({ src: this.image, alt: this.title, width: 480, height: 360 });
      }
  
      if (!this.url) {
        const href = window.location.href;
        this.url = href ? href : false;
      }

      resolve({
        match: info.match,
        title: this.title,
        description: this.description,
        image: this.image,
        images: this.images,
        url: this.url
      });

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
