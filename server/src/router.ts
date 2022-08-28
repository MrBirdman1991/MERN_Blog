import {Express} from "express"

import helperRoutes from "./routes/helper.routes";
import userRoutes from "./routes/user.routes"

export  function router(app: Express){
    app.use("/api/helper/1.0/", helperRoutes);
    app.use("/api/user/1.0/", userRoutes)
}