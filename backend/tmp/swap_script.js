const fs = require('fs');
const path = require('path');

const modules = ['admin', 'album', 'message', 'song', 'stat', 'user'];
const routesDir = path.join(__dirname, '../src/routes');
const controllersDir = path.join(__dirname, '../src/controller');

modules.forEach(mod => {
    const routePath = path.join(routesDir, `${mod}.route.js`);
    const controllerPath = path.join(controllersDir, `${mod}.controller.js`);

    if (fs.existsSync(routePath) && fs.existsSync(controllerPath)) {
        let originalRouteContent = fs.readFileSync(routePath, 'utf-8');
        let originalControllerContent = fs.readFileSync(controllerPath, 'utf-8');

        // New route content is old controller content
        const newRouteContent = originalControllerContent;

        // New controller content is old route content, but we must update the import from "../controller/X.controller.js" to "../routes/X.route.js"
        const newControllerContent = originalRouteContent.replace(/\.\.\/controller\/([a-z]+)\.controller\.js/g, "../routes/$1.route.js");

        fs.writeFileSync(routePath, newRouteContent);
        fs.writeFileSync(controllerPath, newControllerContent);
        console.log(`Swapped ${mod}`);
    }
});

// also process index.js
const indexPath = path.join(__dirname, '../src/index.js');
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf-8');
    indexContent = indexContent.replace(/\.\/routes\/([a-z]+)\.route\.js/g, "./controller/$1.controller.js");
    fs.writeFileSync(indexPath, indexContent);
    console.log('Processed index.js');
}
