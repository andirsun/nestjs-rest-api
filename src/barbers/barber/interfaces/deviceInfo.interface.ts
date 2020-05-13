export interface DeviceInfoInterface {
  // The current bundle build of the app
  appBuild : string,
  // The current bundle verison of the app
  appVersion : string,
  // How much free disk space is available on the the normal data storage path for the os, in bytes
  diskFree : number,
  // The total size of the normal data storage path for the OS, in bytes
  diskTotal : number,
  // Whether the app is running in a simulator/emulator
  isVirtual : Boolean,
  // The manufacturer of the device
  manufacturer : string,
  // Approximate memory used by the current app, in bytes. Divide by 1048576 to get the number of MBs used.
  memUsed : number,
  // The device model. For example, "iPhone"
  model : string,
  // The operating system of the device
  operatingSystem : string,
  // The version of the device OS
  osVersion : string,
  // The device platform (lowercase).
  platform : string,
}