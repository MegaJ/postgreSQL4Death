requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app'
    },
   urlArgs: "v=" +  (new Date()).getTime()
});

requirejs(['app/game']);
