# ssg-deployer

Server-Side-Generate a site, but it on S3 and hook it up to a url (with clouddlare)

## What it does

1. Crawl a provided site and save the rendered (hydrated) html to `outputs/` (and a screenshot)
2.

## Before you start

**You will need:**

* AWS account with S3
* Cloudflare account with a domain

Edit the values in `env.example` and rename to `env.production`

## Usage

**Most basic usage:**

```bash
# basic usage. You will be prompted for input
docker-compose run --rm deployr ansible-playbook
```

**Try out just the SSG**

```
docker-compose run --rm deployr node ssg https://example.com
```


