# gs-api-publish-vimeo-example
Publish videos edited in Grand Shooting to Vimeo

## Vimeo preparation

Create an app in your Vimeo developer console (https://developer.vimeo.com/). The application should be kept private for easier configuration

![Private app](/img/private_app.png)


Create an access_token allowing you to upload videos

![create token](/img/generate_access_token.png)

Copy the config.sample.json to a config.json file and fill the information from vimeo (client_id, client_secret, access_token)


## Grand Shooting preparation

Get an API token from Grand Shooting
https://account.grand-shooting.com/team-management/api#apikeys

Fill the token field in the config.json file

