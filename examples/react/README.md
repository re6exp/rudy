## React examples

```bash
create-react-app demo
rm demo/src -rf
cp -r basic/{package.json,.env,src} demo
cd demo
yarn
# git init # needed to apply patches from other examples.
# install any additional libs used by applied patches.
yarn start
```
