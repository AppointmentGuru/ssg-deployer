# Statically generate a Vuetify site, host it on AWS S3 and route it through Cloudflare

## Getting started


## Philosophy and more

For when you want all the things:

**Vuetify gives us:**

* A beautiful and rich UI framework which is easy to use
* A powerful developer experience
* Tree-shaking which results in lower css/js package sizes with no extra work
* Baked-in best practices and a lighthouse score of 100 out of the box

The only real problem is that Vuetify is designed primarily for building SPAs - not really for delivering content.
We want a super-fast, pretty and functional website that also is SEO friendly.

## Other approaches

I've tried a few things before landing on this approach. Some of them might work for you.

### 1. Nuxt

Nuxt is a good option when it comes to SSR and SSG. I didn't really need a lot of what Nuxt has to offer, and, importantly, wanted to stay within the default Vuetfiy developer experience.

### 2. Vuepress

Vuepress is a great little server-side renderer. It would be been pretty perfect for what I was trying to do, but, unfortunately, wrangling Vuetify to fit with the Vuepress theme setup proved beyond my capabilities

### 3. Just use a Server-Side Framework

You can always just use something like Django, and just load up the Vuetify css and js from the cdn. But this means you're downloading the whole framework (no tree-shaking), and you also get a non-hydrated flash of content before Vuetify kicks in and renders the content.

And this is where we ended up. Feels like it should be simple. After-all, all I want to do is render some html!

## So what's our solution then?

1. Generate an HTML version of our app using Puppeteer
2. Push this content into an AWS

## Generate static content from your dynamic Vuetify site

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://bookme.guru/guru/', {waitUntil: 'networkidle2'});
  // await page.screenshot({path: 'vuetify.png'});
  // await page.pdf({path: 'vuetify.pdf', format: 'A4'});
  const html = await page.content();
  // console.log(html)
  fs.writeFile('index.html', html, function (err) {
    if (err) return console.log(err);
    console.log('Wrote index.html');
  })
  await browser.close();
})();

```

## Store our content in S3

```python
region = 'eu-central-1'
bucket_name = 'mysite.example.com'
website_configuration = {
    'ErrorDocument': {'Key': 'error.html'},
    'IndexDocument': {'Suffix': 'index.html'},
}
location = {'LocationConstraint': region}

# todo: create or put
try:
  s3_client = boto3.client('s3', region_name=region)
  bucket = s3_client.create_bucket(
    Bucket=bucket_name,
    CreateBucketConfiguration=location
  )
except: # BucketAlreadyOwnedByYou
  pass

# make sure it's setup for static site hosting:
s3_client.put_bucket_website(
    Bucket=bucket_name,
    WebsiteConfiguration=website_configuration
)

# upload files:
extra = {
  'ACL': 'public-read',
  'Metadata': {'Content-Type': 'text/html'}
}
res = s3_client.upload_file('index.html', bucket_name, 'index.html', ExtraArgs={'ACL': 'public-read'})
```

## Resources

* [Configuring an Amazon Web Services static site to use Cloudflare
](https://support.cloudflare.com/hc/en-us/articles/360037983412-Configuring-an-Amazon-Web-Services-static-site-to-use-Cloudflare)
* [Headless Chrome: an answer to server-side rendering JS sites](https://developers.google.com/web/tools/puppeteer/articles/ssr)
* https://paul.kinlan.me/hosting-puppeteer-in-a-docker-container/


