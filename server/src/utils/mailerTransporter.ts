import nodemailer, {TransportOptions} from "nodemailer";



const createTransporter = (config: TransportOptions) => {
  return nodemailer.createTransport({...config});
};


export default createTransporter;