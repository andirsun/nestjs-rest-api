import { Schema } from "mongoose"; 

export const DeviceSchema = new Schema({
    // The current bundle build of the app
    appBuild : String,
    // The current bundle verison of the app
    appVersion : String,
    // How much free disk space is available on the the normal data storage path for the os, in bytes
    diskFree : Number,
    // The total size of the normal data storage path for the OS, in bytes
    diskTotal : Number,
    // Whether the app is running in a simulator/emulator
    isVirtual : Boolean,
    // The manufacturer of the device
    manufacturer : String,
    // Approximate memory used by the current app, in bytes. Divide by 1048576 to get the number of MBs used.
    memUsed : Number,
    // The device model. For example, "iPhone"
    model : String,
    // The operating system of the device
    operatingSystem : String,
    // The version of the device OS
    osVersion : String,
    // The device platform (lowercase).
    platform : String,

});


