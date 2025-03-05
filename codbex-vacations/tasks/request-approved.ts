import { process } from "sdk/bpm"
import { sendMail } from "./mail-util"

const execution = process.getExecutionContext();
const executionId = execution.getId();

const toWho = process.getVariable(executionId, "To");
const fromWho = process.getVariable(executionId, "From");
const status = process.getVariable(executionId, "Status");


if (status === "Approved") {

    const subject = "Leave Request Approved";

    const content = `<h4>Your leave request has been approved by ${fromWho}</h4>`;

    sendMail(toWho, subject, content);
}