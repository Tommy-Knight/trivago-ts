import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv"
import accomodationRouter from "./services/accomodation/index.js"
import destinationRouter from "./services/destination/index.js"

import {badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler} from "./errorHandlers.js"

dotenv.config()

const server = express();
server.use(cors());
server.use(express.json())

const port = process.env.PORT || 3420;

// ><><><><: MIDDLEWARES :><><><>< \\


// ><><><><: ROUTES :><><><>< \\

server.use("/accomodation", accomodationRouter);
server.use("/destination", destinationRouter);

// ><><><><: ERROR MIDDLEWARES :><><><>< \\

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)


console.table(listEndpoints(server));

// ><><><><: MONGO TIME :><><><>< \\
mongoose
	.connect(process.env.MONGOOSE_CONNECTION, { useNewUrlParser: true }, { unifiedTopology: true })
	.then(() => {
		console.log("Connected to mongo");
		server.listen(port, () => {
			console.log("Server listening on port " + port + " 🍌");
		});
	});

export default server