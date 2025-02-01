import { FileSysScanHandler, FSEvent, FS_TYPE } from "../index";

async function start() {
  const fsScanner = new FileSysScanHandler("/Users/user/code");

  fsScanner.addListener(FS_TYPE.FILE, (event: FS_TYPE) => {
    console.log(event);
  });

  fsScanner.addListener(FS_TYPE.DIR, (event: FS_TYPE) => {
    console.log(event);
  });

  fsScanner.addListener(FS_TYPE.ERROR, (event: string) => {
    console.log(event);
  });

  fsScanner.scanIterative();
}

start();
