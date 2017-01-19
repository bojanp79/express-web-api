import {getLogger, addAppender, setLevel, Logger, Appender} from "aurelia-logging";

export enum AuLogLevel {
    none = 0,
    error = 1,
    warn = 2,
    info = 3,
    debug = 4
}

export class AuLogManager {

    public static getLogger(id: string): Logger {
        return getLogger(id);
    }

    public static addAppender(appender: Appender) {
        addAppender(appender);
    }

    public static setLevel(level: AuLogLevel) {
        setLevel(level);
    }


}