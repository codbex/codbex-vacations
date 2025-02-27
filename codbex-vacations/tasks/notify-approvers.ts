import { process } from "sdk/bpm"
import { sendMail } from "./mail-util"

const execution = process.getExecutionContext();
const executionId = execution.getId();

const toWho = process.getVariable(executionId, "To");
const fromWho = process.getVariable(executionId, "From");
const requestId = process.getVariable(executionId, "RequestId");
const status = process.getVariable(executionId, "Status");

if (!status) {
    const subject = "New leave request";

    const approvalLink = "http://localhost:8080/services/web/codbex-vacations/ext/generate/LeaveDeduction/leave-deduction-generate.html?id=" + requestId;

    const content = `<h4>A new leave request for ${toWho} has been created</h4>Open the inbox <a href="${approvalLink}" target="_blank">here</a> to process the request.`;

    sendMail(toWho, subject, content);
}
else {
    if (status === "Approved") {

        const subject = "Leave Request Approved";

        const content = `<h4>Your leave request has been approved by ${fromWho}</h4>`;

        sendMail(toWho, subject, content);
    }
    if (status === "Rejected") {

        const subject = "Leave Request Denied";

        const content = `<h4>Your leave request has been denied by ${fromWho}</h4>`;

        sendMail(toWho, subject, content);
    }
}