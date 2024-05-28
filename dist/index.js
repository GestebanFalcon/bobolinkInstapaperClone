"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        // headless: false,
        defaultViewport: null,
        userDataDir: "./tmp"
    });
    const page = yield browser.newPage();
    yield page.goto("https://docs.npmjs.com/uninstalling-packages-and-dependencies");
    // const textHandles = await page.$$("p");
    // for(const textHandle of textHandles) {
    //     console.log(await page.evaluate(e => e.innerText, textHandle));
    // }
    const pageHtmlHandle = yield page.$("html");
    const pageHtml = yield page.evaluate(e => e ? e : "fuck you", pageHtmlHandle);
    console.log(pageHtml);
});
main();
console.log("hi nigga!");
