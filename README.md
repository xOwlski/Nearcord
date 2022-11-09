# Nearcord
### Run
Go to front folder
`yarn`
`yarn build` - This will generate static html files in back folder

Go to back folder
`yarn`
`yarn build:release`
`cd final`
`node nearcord.cjs`
open new terminal
`local-ssl-proxy --source 9879 --target 9898`
### Development