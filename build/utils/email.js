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
exports.Email = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./config.env" });
}
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const html_to_text_1 = __importDefault(require("html-to-text"));
const path_1 = __importDefault(require("path"));
const emailfrom = process.env.EMAIL_FROM;
const sendgriduser = process.env.SENDGRID_USERNAME;
const sendgridpass = process.env.SENDGRID_PASS;
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `ChatEasy<${emailfrom}>`;
    }
    newTransport() {
        return nodemailer_1.default.createTransport({
            service: "SendGrid",
            auth: {
                user: sendgriduser,
                pass: sendgridpass,
            },
        });
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `/../views/emails/${template}.ejs`), {
                firstName: this.firstName,
                to: this.to,
                url: this.url,
                subject,
            });
            const mailoptions = {
                from: this.from,
                to: this.to,
                subject,
                html,
                text: html_to_text_1.default.fromString(html),
            };
            yield this.newTransport().sendMail(mailoptions);
        });
    }
    sendWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send("welcome", "Welcome to ChatEasy!");
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send("passwordReset", "YOUR PASSWORD RESET TOKEN");
        });
    }
}
exports.Email = Email;
