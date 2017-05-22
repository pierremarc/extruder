# shadowtype
An online text extruder.

# install

The program needs nodejs to build and run, it's been developed with v7.5.0.

After obtaining this package, you might want to adjust its configuration by editing ```client/config.js```. Especially the ```fonts``` list which must point to OpenType font files in the ```server/public``` directory. Note that these font files are not provided as part of this package.

Once done, the following commands will install dependencies and build the client program.

```bash
npm install
npm run build
```

After this step has successfuly passed, you can start the server with:

```bash
npm start
```

It will run the service on 0.0.0.0:3000, if you need to change the port on which it binds, set the environment ```PORT``` variable to the desired value, e.g.:


```bash
PORT=8888 npm start
```

You can now test the installation by pointing a recent web browser to http://localhost:3000



If you wish to bind on a specific interface, set the environment ```HOSTNAME``` variable to the desired value, e.g.:


```bash
HOSTNAME=10.99.99.50 PORT=8888 npm start
```


Done!