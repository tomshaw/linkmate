import PageContent from './page'

export default class DefaultHandler extends PageContent {

  process(info) {

    return new Promise((resolve, reject) => {

      const targets = [{
        property: 'title',
        selectors: [
          "meta[property='og:title']",
          "meta[name='twitter:title']",
        ]
      }, {
        property: 'description',
        selectors: [
          "meta[property='og:description']",
          "meta[name='twitter:description']",
        ]
      }, {
        property: 'image',
        selectors: [
          "meta[property='og:image']",
          "meta[name='twitter:image']",
          "meta[name='msapplication-TileImage']",
        ]
      }, {
        property: 'url',
        selectors: [
          "meta[property='og:url']",
          "meta[name='twitter:url']",
        ]
      }]

      for (let i = 0; i < targets.length; i++) {
        let property = targets[i].property;
        let selectors = targets[i].selectors;
        for (let j = 0; j < selectors.length; j++) {
          let selector = selectors[j];
          let metaTag = document.querySelector(selector);
          if (metaTag) {
            let content = metaTag.getAttribute("content");
            if (content && !this[property]) {
              this[property] = content;
            }
          }
        }
      }

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
          let data = [];
          for (let i = 0, total = images.length; i < total; i++) {
            let image = images[i];
            const naturalHeight = image.naturalHeight;
            const naturalWidth = image.naturalWidth;
            if (naturalHeight >= 540 && naturalWidth >= 340) {
              if (image.src && image.src.length) {

                let alternateText = (image.alt && image.alt.length) ? image.alt : this.title;

                let imageType = image.src.replace(/^.*\./, '');
                if (imageType == 'svg') {
                  continue;
                }

                // @todo 
                let duplicate = data.map(item => item.src).indexOf(image.src);
                console.log('duplicate', duplicate);
                if (duplicate >= 0) {
                  continue;
                }

                data.push({ src: image.src, alt: alternateText, width: image.naturalWidth, height: image.naturalHeight })

              }
            }
          }
          this.images = data;
        } else {
          this.images = []
        }
      }

      if (!this.url) {
        const href = window.location.href;
        this.url = href ? href : false;
      }

      if (this.image) {
        this.preloadImage(this.image).then((resp) => {

          this.images.push({ src: resp.src, alt: this.title, width: resp.width, height: resp.height });

          resolve({
            ...info.location,
            match: info.location.hostname,
            title: this.title,
            image: this.image,
            images: this.images,
            description: this.description,
            url: this.url
          })

        }).catch((err) => console.log('load-image-error', err));
      }

    });
  }
}
