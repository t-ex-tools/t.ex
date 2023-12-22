# T.EX - The Transparency EXtension

![Build Status](https://github.com/t-ex-tools/t.ex/actions/workflows/node.js.yml/badge.svg)

T.EX is Web privacy measurement framework in form of a Web extension for Firefox and Chromium-based browsers to enable data collection, inspection, analysis, and visualization to be used in research.

## Installation

### Set up an development environment

Clone the respository and all its submodules with the following command:

```git clone --recurse-submodules https://github.com/t-ex-tools/t.ex.git```

or

```git clone --recurse-submodules git@github.com:t-ex-tools/t.ex.git```

To use t.ex, you need to install Node.js (ideally v16+) and npm (ideally v8+). Use the following command to install the dependencies.

```npm install```

Afterwards you can start the development environment with:

```npm run dev```

**NOTE:** The errors below will be logged. However, the development environment is successfully set up eventually. The reason for this error is that the submodules have to be built first. The build process of the main repository, which finishes first, is started at the same time as the build processes of the submodules. This circumstance causes the errors below. Changes to the builds of the submodules are detected by the main repository and included in its ```dist/``` folder. This way, the errors *vanish* whenever a submodule is finished building. Unfortunately, all processes must be executed concurrently as ```npx webpack``` does not exit if the ```--watch``` flag is set.

```
[.] ERROR in unable to locate '/path/to/t.ex/t.ex-tension/dist' glob
[.] 
[.] ERROR in unable to locate '/path/to/t.ex/labeler-core/dist/labeler-core.var.js' glob
[.] 
[.] ERROR in unable to locate '/path/to/t.ex/t.ex-gui/dist/**/*' glob
```

To build T.EX on your own use the following command:

```npm run build```

The build is placed in the folder ```dist/```.

### Install a build

The following steps also work with a self-build version of T.EX. Simply follow the steps from **Step 3** onwards and chose the ```dist/``` folder in **Step 6** (**Step 5** for Firefox).

#### Chrome and Chromium-based browsers

1. Download the [latest version of T.EX](https://github.com/t-ex-tools/t.ex/releases/tag/v3.2.0) to your local drive
2. Extract the ZIP-archive to a location of your liking
3. Open Chrome (or Chromium-based browser) and navigate to **More tools** -> **Extensions**
4. Enable **Developer mode** *(switch on the upper right)*
5. Click on **Load unpacked**
6. Select the extracted folder (**Step 2**) and click **Open**

#### Firefox

1. Download the [latest version of T.EX](https://github.com/t-ex-tools/t.ex/releases/tag/v3.2.0) to your local drive
2. Extract the ZIP-archive to a location of your liking
3. Open Firefox and navigate to ```about:debugging#/runtime/this-firefox```
4. Click on **Load Temporary Add-on...**
6. Navigate to the extracted folder (**Step 2**), select ```manifest.json```, and click **Open**

## Inject an existing T.EX state to fresh installation

You can import the state of an existing T.EX installation to your instance of T.EX. This is useful if you crawled data with a T.EX instance on a remote server (e.g., a cloud server) and now you want to explore the data on your local machine. You can find existing datasets [here](https://zenodo.org/record/7123945#.Y4hqdXaZPtU).

### Chrome and Chromium-based browsers

1. Determine the ```extension_id``` Chrome assigned to T.EX by clicking on the button **Details** on the Extension page. The field field **ID** shows the ```extension_id```

2. Open the folder in which the T.EX state is persisted:

    * **Windows:** ```C:\Users\<username>\AppData\Local\Google\Chrome\User Data\<profile>\Local Extension Settings\<extension_id>\```

    * **macOS:** ```/Users/<username>/Library/Application Support/Google/Chrome/<profile>/Local Extension Settings/<extension_id>/``` 

    * **Linux:** ```/home/<username>/.config/google-chrome/<profile>/Local Extension Settings/<extension_id>/```

3. Close Chrome and delete all files in this folder.

4. Extract the ```*.ldb``` files from the ZIP-archive to this folder.

5. Open Chrome and T.EX again.

### Firefox

1. Extract directory moz-extension+++<extension_id> from ZIP-archive to: 

    * **Windows:** ```C:\Users\<username>\AppData\Roaming\Mozilla\Firefox\Profiles\<profile>\storage\default\``` 

    * **macOS:** ```/Users/<username>/Library/Application Support/Firefox/Profiles/<profile>/storage/default/``` 

    * **Linux:** ```/home/<username>/mozilla/firefox/Profiles/<profile>/storage/default/``` 

2. Open Firefox and load T.EX as a temporary Add-on. 

3. Enter ```about:debugging#/runtime/this-firefox``` in the address bar. 

4. Remember the **Internal UUID** assigned to T.EX: 

5. Enter ```about:config``` in the address bar. 

6. Accept the risk and search for ```extensions.webextensions.uuids```. 

7. Click on **Edit**.

8. Search for the **Internal UUID** assigned to T.EX, when you added it as temporary add-on. 

  * **Hint:** It is usually at the end of the long string.
  
9. Replace the **Internal UUID** with ```<extension_id>``` from **Step 1**. 

10. Go back to ```about:debugging#/runtime/this-firefox``` and reload T.EX. 

11. The **Internal UUID** will have changed, and the extension storage will be read from the extracted directory from the ZIP archive. 
