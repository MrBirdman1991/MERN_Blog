import logger from "pino";
import dayjs, {locale} from "dayjs"



const log = (() => {
    locale("de");
    
    const loggingMessage = logger({
        base: {
            pid: false
        },
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true
            }
        },
        timestamp: () => `, "time": "${dayjs().format("DD.MM.YYYY @ HH:mm:ss")}" `,
    });

    return loggingMessage;
})();

export default log;