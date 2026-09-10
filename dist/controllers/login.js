"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//imporrtar a biblioteca Express 
const express_1 = __importDefault(require("express"));
// Criar a aplicação Express
const router = express_1.default.Router();
//Criar a rota GET principal 
router.get("/", (req, res) => {
    res.send("será? que minha mulher vai me dar uma caveira de presente de hallowen ???????/");
});
//exprtar a instrução da rota 
exports.default = router;
