import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()

const server = express();
server.use(cors());
server.use(express.json())

const port = process.env.PORT || 3420;

// ><><><><: MIDDLEWARES :><><><>< \\


// ><><><><: ROUTES :><><><>< \\

// server.use("/accomodation", accomodationRouter);
// server.use("/destination", destinationRouter);

// ><><><><: ERROR MIDDLEWARES :><><><>< \\


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