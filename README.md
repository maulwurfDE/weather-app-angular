# Weather App

A basic weather app. 

## Demo
[Demo](https://nearmint.github.io/weather-app-angular)

## Built with

* Angular
* async/await
* http.get

## My way of deploying an Angular project to Github Pages

```
git branch gh-pages
git checkout gh-pages
git push origin gh-pages
npm install -g angular-cli-ghpages
ng build --prod --base-href https://[username].github.io/[repo]/
sudo chown -R $(whoami) /usr/lib/node_modules/angular-cli-ghpages/
ngh --dir=dist/[project-name]
```

