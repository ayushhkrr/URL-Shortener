import express from "express";
import { createUrl, redirect } from "../controllers/urlController.js";

const routes = express.Router();

routes.post("/", createUrl);

routes.get("/:urlCode", redirect);

export default routes;
