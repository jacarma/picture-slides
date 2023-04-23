# Picture Slides

[https://javi-talarian-test.netlify.app/](https://javi-talarian-test.netlify.app/)

This is just a demo slider

[![Netlify Status](https://api.netlify.com/api/v1/badges/5f74cbf2-e241-4d49-9b82-f0c5fc04b6f7/deploy-status)](https://app.netlify.com/sites/javi-talarian-test/deploys)

## How to run the dev environment

I created serverless functions inside `netlify/functions` to prevent sharing the API KEY.

If you want to start the app you can use netlify

1. Install netlify cli with `npm install netlify-cli -g` and then `netlify login`.
2. Create a .env file with
   ```
   SLSTICE_API_KEY=YOUR_API_KEY
   ```
3. Run `netlify dev`

Another alternative would be to replace the three urls in the three files inside `src/SlideShow/api` with the actual API url (including the API-KEY) and then start with `npm dev`
