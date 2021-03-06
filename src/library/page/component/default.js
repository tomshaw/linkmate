import PageContent from './page'

export default class DefaultHandler extends PageContent {

  constructor() {
    super();
    this.minimums = {
      width: 200,
      height: 200
    }
  }

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

        const images = document.getElementsByTagName('img');

        if (images.length) {

          let data = [];
          let compare = [];
          for (let i = 0, total = images.length; i < total; i++) {

            const image = images[i];
            const source = image.src;

            const naturalHeight = image.naturalHeight;
            const naturalWidth = image.naturalWidth;

            if (naturalHeight >= this.minimums.height && naturalWidth >= this.minimums.width) {
              if (source && source.length) {

                let alternateText = (image.alt && image.alt.length) ? image.alt : this.title;

                // Filter out images
                if (!source.match(/(https?:\/\/.*\.(?:gif|jpg|jpeg|png|webp))/i)) {
                  continue;
                }

                // Remove duplicate items.
                if (compare.includes(source)) {
                  continue;
                }

                compare.push(source);

                data.push({ src: source, alt: alternateText, width: image.naturalWidth, height: image.naturalHeight });
              }
            }
          }

          compare.length = 0;

          this.images = data;

        } else {
          this.images = [];
        }
      }

      if (!this.url) {
        const href = window.location.href;
        this.url = href ? href : false;
      }

      // Begin append social share image to images stack if the image is not already present.
      // This is highly imperfect, many sites upload the same image multiple times for SEO reasons.

      const imageExists = this.images.some((el) => { return el.src === this.image });

      const resolvePromise = () => {
        resolve({
          ...info.location,
          match: info.location.hostname,
          title: this.title,
          image: this.image,
          images: this.images,
          description: this.description,
          url: this.url
        });
      }

      if (imageExists) {
        resolvePromise();
      } else {
        this.preloadImage(this.image).then((resp) => {
          if (resp.height >= this.minimums.height && resp.width >= this.minimums.width) {
            this.images.push({ src: resp.src, alt: this.title, width: resp.width, height: resp.height });
          }
          resolvePromise();
        }).catch((err) => { });
      }

    });
  }
}
