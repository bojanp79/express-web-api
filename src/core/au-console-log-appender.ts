import {Appender, Logger} from "aurelia-logging";

export class AuConsoleLogAppender implements Appender {


    debug(logger: Logger, message, ...rest: any[]) {
        var msg = `[${logger.id}] ${message}`;
        console.info(msg);
    }


    info(logger: Logger, message, ...rest: any[]) {
        var msg = `[${logger.id}] ${message}`;
        console.info(msg);
    }


    warn(logger: Logger, message, ...rest: any[]) {
        var msg = `[${logger.id}] ${message}`;
        console.warn(msg);
    }

    error(logger: Logger, message, ...rest: any[]) {
        var msg = `[${logger.id}] ${message}`;
        console.error(msg);
    }

}
